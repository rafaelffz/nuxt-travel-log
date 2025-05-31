<script setup lang="ts">
const { data, pending } = await useLazyFetch("/api/locations", {
  cache: "force-cache",
});
</script>

<template>
  <div class="p-6">
    <h2 class="text-2xl">
      Locations
    </h2>

    <div v-if="pending" class="flex flex-wrap gap-2 mt-4">
      <div v-for="(_, index) in 4" :key="index" class="skeleton h-32 w-72 animate-pulse" />
    </div>

    <div v-else-if="data && data.length > 0" class="flex flex-wrap mt-4 gap-2">
      <div v-for="location in data" :key="location.id" class="card bg-base-300 w-72">
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
