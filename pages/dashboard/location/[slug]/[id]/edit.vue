<script lang="ts" setup>
import type { InsertLocationLog } from "~/lib/db/schema";

const route = useRoute();
const locationsStore = useLocationsStore();

const { currentLocationLog: locationLog } = storeToRefs(locationsStore);

const { $csrfFetch } = useNuxtApp();

async function onSubmit(values: InsertLocationLog) {
  await $csrfFetch(`/api/location/${route.params.slug}/${route.params.id}`, {
    method: "put",
    body: values,
    onResponse: async () => {
      await locationsStore.refreshCurrentLocation();
    },
  });
}

async function onSubmitComplete() {
  navigateTo({
    name: "dashboard-location-slug-id",
    params: {
      slug: route.params.slug,
      id: route.params.id,
    },
  });
}
</script>

<template>
  <div>
    <LocationLogForm
      v-if="locationLog"
      :on-submit-complete
      :on-submit
      submit-icon="tabler:bookmark-edit"
      submit-label="Update Location Log"
      :initial-values="locationLog"
      :zoom="12"
    />
  </div>
</template>
