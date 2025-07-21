<script setup lang="ts">
const locationsStore = useLocationsStore();
const mapStore = useMapStore();
const route = useRoute();
const { locations, locationsPending: pending } = storeToRefs(locationsStore);

onMounted(() => {
  if (route.path === "/dashboard") {
    mapStore.adjustMapBounds();
  }
});

onBeforeRouteLeave(() => {
  mapStore.selectedPoint = null;
});
</script>

<template>
  <div class="page-content-top">
    <h2 class="text-2xl">
      Locations
    </h2>

    <div v-if="pending" class="flex flex-wrap gap-2 mt-4">
      <div
        v-for="(_, index) in 3"
        :key="index"
        class="skeleton h-32 w-72 animate-pulse"
      />
    </div>

    <div v-else-if="!pending && locations && locations.length > 0" class="location-list">
      <LocationCard
        v-for="location in locations"
        :key="location.id"
        :map-point="createMapPointFromLocation(location)"
      />
    </div>

    <div v-else class="flex flex-col gap-2 mt-4">
      <p>Add a location to get started.</p>
      <NuxtLink to="/dashboard/add" class="btn btn-primary w-40">
        Add Location
        <Icon name="tabler:map-pin-plus" size="22" />
      </NuxtLink>
    </div>
  </div>
</template>
