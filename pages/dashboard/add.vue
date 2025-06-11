<script setup lang="ts">
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";
import { motion } from "motion-v";

import { CENTER_MAP_COORDINATES } from "~/lib/constants";
import { InsertLocation } from "~/lib/db/schema";

useHead({
  title: "MyTravlo | Add Location",
});

const { $csrfFetch } = useNuxtApp();

const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues }
  = useForm({
    validationSchema: toTypedSchema(InsertLocation),
    initialValues: {
      name: "",
      description: "",
      long: (CENTER_MAP_COORDINATES as [number, number])[0],
      lat: (CENTER_MAP_COORDINATES as [number, number])[1],
    },
  });

const mapStore = useMapStore();
const router = useRouter();
const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;

    await $csrfFetch("/api/locations", {
      method: "POST",
      body: values,
    });

    await refreshNuxtData("locations");

    submitted.value = true;
    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data)
      setErrors(error.data?.data);
    submitError.value
      = error.data?.statusMessage || error.statusMessage || "An unknown error occurred";
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
    lat: (CENTER_MAP_COORDINATES as [number, number])[1],
    long: (CENTER_MAP_COORDINATES as [number, number])[0],
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
  <div class="container max-w-md m-6">
    <div>
      <h1 class="text-lg">
        Add Location
      </h1>
      <p class="text-sm">
        A location is a place you have traveled or will travel to. It can be a city,
        country, state or point of interest. You can add specific times you visited this
        location after adding it.
      </p>
    </div>

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
      <AppFormField
        name="name"
        label="Name"
        :error="errors.name"
        :disabled="loading"
      />

      <AppFormField
        name="description"
        label="Description"
        type="textarea"
        :error="errors.description"
        :disabled="loading"
      />

      <div class="flex items-center font-medium text-sm">
        <span>Drag the</span>
        <Icon name="tabler:map-pin-filled" class="text-warning mx-1" />
        <span>to your desired location or double click on the map</span>
      </div>

      <p class="text-xs text-gray-400">
        Current Location: {{ formatCoords(controlledValues.lat) }},
        {{ formatCoords(controlledValues.long) }}
      </p>

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
          Add
          <span v-if="loading" class="loading loading-spinner loading-sm" />
          <Icon v-else name="tabler:map-pin-plus" size="22" />
        </button>
      </div>
    </form>
  </div>
</template>
