<script setup lang="ts">
const locationsStore = useLocationsStore();
const {
  currentLocation: location,
  currentLocationPending: pending,
  currentLocationError: error,
} = storeToRefs(locationsStore);

onMounted(() => {
  locationsStore.refreshCurrentLocation();
});
</script>

<template>
  <div class="p-6 min-h-64">
    <div v-if="pending">
      <div class="skeleton h-6 w-24 animate-pulse" />
    </div>
    <div
      v-else-if="!pending && error"
      class="h-full flex flex-col gap-4 items-center justify-center"
    >
      <Icon name="tabler:zoom-question" size="62" class="text-error" />
      <h2 class="text-xl font-medium text-error">
        We couldn't find this location.
      </h2>
      <h2 class="text-lg font-medium text-gray-200">
        Plase, try again with another location.
      </h2>
    </div>
    <div v-else-if="!pending && location">
      <h2 class="text-3xl">
        {{ location?.name }}
      </h2>
      <p class="text-md mt-1">
        {{ location?.description }}
      </p>

      <div v-if="!location.locationLogs.length" class="mt-4">
        <p class="text-sm italic">
          You haven't added any location logs yet. Add one now to get started.
        </p>
        <button class="btn btn-primary btn-sm flex items-center gap-2 mt-2">
          <Icon name="tabler:bookmark-plus" size="18" />
          <span class="text-sm">Add location log</span>
        </button>
      </div>
    </div>
  </div>
</template>
