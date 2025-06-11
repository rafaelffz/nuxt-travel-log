<script setup lang="ts">
const locationsStore = useLocationsStore();
const mapStore = useMapStore();
const { locations, pending } = storeToRefs(locationsStore);

mapStore.adjustMapBounds();
</script>

<template>
  <div class="p-6">
    <h2 class="text-2xl">
      Locations
    </h2>

    <div v-if="pending" class="flex flex-wrap gap-2 mt-4">
      <div
        v-for="(_, index) in 3"
        :key="index"
        class="skeleton h-32 w-72 animate-pulse delayed-animation"
      />
    </div>

    <div
      v-else-if="!pending && locations && locations.length > 0"
      class="flex flex-nowrap mt-4 gap-2 overflow-auto"
    >
      <div
        v-for="location in locations"
        :key="location.id"
        class="card bg-base-300 border-2 w-72 min-h-28 shrink-0 cursor-pointer mb-2"
        :class="{
          'border-accent': mapStore.selectedPoint === location,
          'border-transparent': mapStore.selectedPoint?.id !== location.id,
        }"
        @mouseenter="mapStore.selectedPoint = location"
        @mouseleave="mapStore.selectedPoint = null"
      >
        <div class="card-body">
          <h2 class="text-xl font-medium">
            {{ location.name }}
          </h2>
          <p class="line-clamp-2">
            {{ location.description }}
          </p>
        </div>
      </div>
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
