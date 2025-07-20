<script setup lang="ts">
import { CENTER_MAP_COORDINATES } from "~/lib/constants";
import { InsertLocation } from "~/lib/db/schema";

const props = defineProps<{
  initialValues?: InsertLocation;
  onSubmit: (location: InsertLocation) => Promise<any>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
  zoom?: number;
}>();
</script>

<template>
  <LocationBaseForm
    v-slot="{ errors, loading }"
    :zoom="props.zoom || 8"
    :schema="InsertLocation"
    :submit-icon
    :submit-label
    :initial-values="
      props.initialValues || {
        name: '',
        description: '',
        lat: (CENTER_MAP_COORDINATES as [number, number])[1],
        long: (CENTER_MAP_COORDINATES as [number, number])[0],
      }
    "
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
  </LocationBaseForm>
</template>
