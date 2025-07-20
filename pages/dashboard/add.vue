<script setup lang="ts">
import type { InsertLocation } from "~/lib/db/schema";

useHead({
  title: "MyTravlo | Add Location",
});

const locationsStore = useLocationsStore();

const { $csrfFetch } = useNuxtApp();

async function onSubmit(values: InsertLocation) {
  await $csrfFetch("/api/locations", {
    method: "post",
    body: values,
    onResponse: async () => {
      await locationsStore.refreshLocations();
    },
  });
}

function onSubmitComplete() {
  navigateTo("/dashboard");
}
</script>

<template>
  <div class="container max-w-md p-4 m-2">
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

    <LocationForm
      :on-submit
      :on-submit-complete
      submit-label="Add"
      submit-icon="tabler:map-pin-plus"
      :zoom="8"
    />
  </div>
</template>
