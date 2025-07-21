<script setup lang="ts">
import type { MapPoint } from "~/lib/types";

const props = defineProps<{
  mapPoint: MapPoint;
}>();

const mapStore = useMapStore();
</script>

<template>
  <NuxtLink
    class="card bg-base-300 border-2 w-72 min-h-28 shrink-0 cursor-pointer mb-2"
    :to="props.mapPoint.to"
    :class="{
      'border-accent': isPointSelected(props.mapPoint, mapStore.selectedPoint),
      'border-transparent': !isPointSelected(props.mapPoint, mapStore.selectedPoint),
    }"
    @mouseenter="mapStore.selectedPoint = props.mapPoint"
    @mouseleave="mapStore.selectedPoint = null"
  >
    <div class="card-body">
      <slot name="top" />

      <h2 class="text-xl font-medium">
        {{ props.mapPoint.name }}
      </h2>
      <p class="line-clamp-2">
        {{ props.mapPoint.description }}
      </p>
    </div>
  </NuxtLink>
</template>
