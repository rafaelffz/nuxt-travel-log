<script setup lang="ts">
const route = useRoute();
const locationsStore = useLocationsStore();

const {
  currentLocationLog: locationLog,
  currentLocationLogStatus: status,
  currentLocationLogError: error,
} = storeToRefs(locationsStore);

const loading = computed(() => status.value === "pending");

onMounted(() => {
  locationsStore.refreshCurrentLocationLog();
});
</script>

<template>
  <div>
    <div v-if="loading" class="flex flex-col gap-4">
      <div class="flex items-center gap-3">
        <div class="skeleton h-10 w-48 animate-pulse" />
        <div class="skeleton h-8 w-3 animate-pulse" />
      </div>
      <div class="flex gap-2 h-full">
        <div
          v-for="(_, index) in 3"
          :key="index"
          class="skeleton h-32 w-72 animate-pulse"
        />
      </div>
    </div>

    <div
      v-else-if="!loading && error"
      class="h-full flex flex-col gap-4 items-center justify-center"
    >
      <Icon name="tabler:zoom-question" size="62" class="text-red-500" />
      <h2 class="text-xl font-medium text-red-500">
        We couldn't find this location.
      </h2>
      <h2 class="text-lg font-medium text-base-content">
        Please, try again with another location.
      </h2>
    </div>

    <div
      v-else-if="route.name === 'dashboard-location-slug-id' && !loading && locationLog"
    >
      <h2 class="text-3xl">
        <p
          v-if="locationLog.startedAt !== locationLog.endedAt"
          class="text-sm text-gray-500"
        >
          {{ formatDateBR(locationLog.startedAt) }} -
          {{ formatDateBR(locationLog.endedAt) }}
        </p>
        <p v-else class="text-sm text-gray-500">
          {{ formatDateBR(locationLog.startedAt) }}
        </p>
        {{ locationLog?.name }}
      </h2>

      <p class="text-md mt-1">
        {{ locationLog?.description }}
      </p>
    </div>
  </div>
</template>
