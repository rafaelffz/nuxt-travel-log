<script setup lang="ts">
import type { InsertLocationLog } from "~/lib/db/schema";

import { CENTER_MAP_COORDINATES } from "~/lib/constants";

const route = useRoute();
const { currentLocation } = useLocationsStore();

const { $csrfFetch } = useNuxtApp();

async function onSubmit(values: InsertLocationLog) {
  await $csrfFetch(`/api/location/${route.params.slug}/add`, {
    method: "post",
    body: values,
  });
}

function onSubmitComplete() {
  navigateTo({
    name: "dashboard-location-slug",
    params: { slug: route.params.slug },
  });
}
</script>

<template>
  <div>
    <LocationLogForm
      :on-submit-complete
      :on-submit
      submit-icon="tabler:map-pin-plus"
      submit-label="Add Location Log"
      :initial-values="{
        name: '',
        description: '',
        startedAt: Date.now() - 24 * 60 * 60 * 1000,
        endedAt: Date.now(),
        lat: currentLocation?.long || (CENTER_MAP_COORDINATES as [number, number])[1],
        long: currentLocation?.lat || (CENTER_MAP_COORDINATES as [number, number])[0],
      }"
      :zoom="12"
    />
  </div>
</template>
