<script setup lang="ts" generic="T extends LatLongItem">
import type { FetchError } from "ofetch";
import type { ZodSchema } from "zod";

import { toTypedSchema } from "@vee-validate/zod";
import { motion } from "motion-v";

import type { LatLongItem, NominatimResult } from "~/lib/types";

import { CENTER_MAP_COORDINATES } from "~/lib/constants";
import { getFetchErrorMessage } from "~/utils/get-fetch-error-message";

const props = defineProps<{
  initialValues: T;
  schema: ZodSchema;
  onSubmit: (location: T) => Promise<any>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
  zoom: number;
}>();

const mapStore = useMapStore();
const router = useRouter();
const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");

const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues }
  = useForm({
    validationSchema: toTypedSchema(props.schema),
    initialValues: props.initialValues,
  });

const onSubmit = handleSubmit(async (values: T) => {
  try {
    submitError.value = "";
    loading.value = true;

    await props.onSubmit(values);

    submitted.value = true;
    props.onSubmitComplete();
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data)
      setErrors(error.data?.data);
    submitError.value = getFetchErrorMessage(error);
  }
  finally {
    loading.value = false;
  }
});

function formatCoords(coords?: number) {
  if (!coords)
    return 0;
  return coords.toFixed(5);
}

function searchResultSelected(result: NominatimResult) {
  setFieldValue("name", result.name);

  mapStore.addedPoint = {
    id: 1,
    name: "Added Point",
    description: "",
    lat: Number(result.lat),
    long: Number(result.lon),
    centerMap: true,
  };
}

watchEffect(() => {
  if (mapStore.addedPoint) {
    setFieldValue("long", mapStore.addedPoint.long);
    setFieldValue("lat", mapStore.addedPoint.lat);
  }
});

onMounted(() => {
  mapStore.addedPoint = {
    id: 1,
    name: "Added Point",
    description: "",
    long: props.initialValues?.long || (CENTER_MAP_COORDINATES as [number, number])[0],
    lat: props.initialValues?.lat || (CENTER_MAP_COORDINATES as [number, number])[1],
    zoom: props.zoom,
  };
});

onBeforeRouteLeave(() => {
  if (!submitted.value && meta.value.dirty) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm(
      "Are you sure you want to leave? All unsaved changes will be lost.",
    );
    if (!confirm) {
      return false;
    }
  }
  mapStore.addedPoint = null;
  return true;
});
</script>

<template>
  <motion.div
    v-if="submitError"
    role="alert"
    class="alert alert-error"
    :initial="{ scale: 0 }"
    :animate="{ scale: 1 }"
    :transition="{ type: 'spring', stiffness: 260, damping: 20 }"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 shrink-0 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span> {{ submitError }} </span>
  </motion.div>
  <form class="flex flex-col" @submit.prevent="onSubmit">
    <slot :errors :loading />

    <p class="text-xs text-gray-400">
      Current Coordinates: {{ formatCoords(controlledValues.lat) }},
      {{ formatCoords(controlledValues.long) }}
    </p>

    <div class="text-sm">
      <p class="font-medium mt-2 mb-1">
        Here are a few ways to set a location:
      </p>
      <ul class="list-disc list-inside pl-0">
        <li>
          Drag the <Icon name="tabler:map-pin-filled" class="text-warning" /> to your
          desired location.
        </li>
        <li>Double click on your desired location.</li>
        <li>Search for a location below.</li>
      </ul>
    </div>

    <div class="flex justify-end gap-4 mt-4">
      <button
        :disabled="loading"
        type="button"
        class="btn btn-outline flex items-center"
        @click="router.back()"
      >
        <Icon name="tabler:arrow-left" size="22" />
        Cancel
      </button>

      <button :disabled="loading" type="submit" class="btn btn-primary">
        {{ props.submitLabel }}
        <span v-if="loading" class="loading loading-spinner loading-sm" />
        <Icon v-else :name="props.submitIcon" size="22" />
      </button>
    </div>
  </form>

  <div class="divider" />

  <AppPlaceSearch @result-selected="searchResultSelected" />
</template>
