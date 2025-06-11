<script setup lang="ts">
import type { MglEvent } from "@indoorequal/vue-maplibre-gl";
import type { LngLat, LngLatLike } from "maplibre-gl";

import { CENTER_MAP_COORDINATES } from "~/lib/constants";

const colorMode = useColorMode();
const mapStore = useMapStore();
const style = computed(() =>
  colorMode.value === "dark"
    ? "/styles/dark.json"
    : "https://tiles.openfreemap.org/styles/liberty",
);

const center = ref<LngLatLike>(CENTER_MAP_COORDINATES);
const zoom = 3;

function updateAddedPoint(location: LngLat) {
  if (mapStore.addedPoint) {
    mapStore.addedPoint.lat = location.lat;
    mapStore.addedPoint.long = location.lng;
  }
}

function onDoubleClick(event: MglEvent<"dblclick">) {
  console.log(event);
  if (mapStore.addedPoint) {
    mapStore.addedPoint.lat = event.event.lngLat.lat;
    mapStore.addedPoint.long = event.event.lngLat.lng;
  }
}

onMounted(() => {
  mapStore.init();
});
</script>

<template>
  <div class="flex-1">
    <MglMap
      :map-style="style"
      :center="center"
      :zoom="zoom"
      @map:dblclick="onDoubleClick"
    >
      <MglFullscreenControl />
      <MglNavigationControl />
      <MglMarker
        v-if="mapStore.addedPoint"
        draggable
        :coordinates="[mapStore.addedPoint.long, mapStore.addedPoint.lat]"
        @update:coordinates="updateAddedPoint"
      >
        <template #marker>
          <div
            class="tooltip tooltip-top tooltip-open cursor-pointer"
            data-tip="Drag to your desired location"
          >
            <Icon name="tabler:map-pin-filled" size="32" class="text-warning" />
          </div>
        </template>
      </MglMarker>

      <MglMarker
        v-for="point in mapStore.mapPoints"
        :key="point.id"
        :coordinates="[point.long, point.lat]"
      >
        <template #marker>
          <div
            class="tooltip tooltip-top cursor-pointer"
            :data-tip="point.name"
            :class="{
              'tooltip-open': mapStore.selectedPoint === point,
            }"
            @mouseenter="mapStore.selectedPoint = point"
            @mouseleave="mapStore.selectedPoint = null"
          >
            <Icon
              name="tabler:map-pin-filled"
              size="32"
              :class="mapStore.selectedPoint === point ? 'text-accent' : 'text-secondary'"
            />
          </div>
        </template>
      </MglMarker>
    </MglMap>
  </div>
</template>
