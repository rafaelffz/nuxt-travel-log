<script setup lang="ts">
import type { LngLatLike } from "maplibre-gl";

import { CENTER_MAP_COORDINATES } from "~/lib/constants";

const colorMode = useColorMode();
const mapStore = useMapStore();
const style = computed(() =>
  colorMode.value === "dark" ? "/styles/dark.json" : "https://tiles.openfreemap.org/styles/liberty",
);

const center = ref<LngLatLike>(CENTER_MAP_COORDINATES);
const zoom = 3;

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
    >
      <MglFullscreenControl />
      <MglNavigationControl />
      <MglMarker
        v-for="point in mapStore.mapPoints"
        :key="point.id"
        :coordinates="[point.long, point.lat]"
      >
        <template #marker>
          <div class="tooltip tooltip-top" :data-tip="point.label">
            <Icon
              name="tabler:map-pin-filled"
              size="32"
              class="text-secondary"
            />
          </div>
        </template>
      </MglMarker>
    </MglMap>
  </div>
</template>
