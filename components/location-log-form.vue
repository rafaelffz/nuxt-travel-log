<script setup lang="ts">
import { CENTER_MAP_COORDINATES } from "~/lib/constants";
import { InsertLocationLog } from "~/lib/db/schema";

const props = defineProps<{
  initialValues?: InsertLocationLog;
  onSubmit: (location: InsertLocationLog) => Promise<any>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
  zoom?: number;
}>();

const initialValues = {
  name: "",
  description: "",
  startedAt: Date.now() - 24 * 60 * 60 * 1000,
  endedAt: Date.now(),
  lat: (CENTER_MAP_COORDINATES as [number, number])[1],
  long: (CENTER_MAP_COORDINATES as [number, number])[0],
};
</script>

<template>
  <LocationBaseForm
    v-slot="{ errors, loading }"
    :zoom="props.zoom || 10"
    :schema="InsertLocationLog"
    :submit-icon
    :submit-label
    :initial-values="props.initialValues || initialValues"
    :on-submit
    :on-submit-complete
  >
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

    <AppDateFormField
      :value="initialValues.startedAt"
      name="startedAt"
      label="Started At"
      :error="errors.startedAt"
      :disabled="loading"
    />

    <AppDateFormField
      :value="initialValues.endedAt"
      name="endedAt"
      label="Ended At"
      :error="errors.endedAt"
      :disabled="loading"
    />
  </LocationBaseForm>
</template>
