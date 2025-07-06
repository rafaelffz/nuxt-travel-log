<script lang="ts" setup>
import type { InsertLocation } from "~/lib/db/schema";

const route = useRoute();
const locationsStore = useLocationsStore();
const { $csrfFetch } = useNuxtApp();

async function onSubmit(values: InsertLocation) {
  await $csrfFetch(`/api/location/${route.params.slug}`, {
    method: "put",
    body: values,
    onResponse: async () => {
      await locationsStore.refreshLocations();
    },
  });
}

function onSubmitComplete() {
  navigateTo({
    name: "dashboard-location-slug",
    params: {
      slug: route.params.slug,
    },
  });
}
</script>

<template>
  <LocationForm
    v-if="!locationsStore.currentLocationPending"
    :on-submit
    :on-submit-complete
    :initial-values="locationsStore.currentLocation"
    submit-label="Update"
    submit-icon="tabler:pencil-check"
  />
</template>
