<script setup lang="ts">
import { CENTER_MAP_COORDINATES } from "~/lib/constants";

const colorMode = useColorMode();
const style = computed(() =>
  colorMode.value === "dark" ? "/styles/dark.json" : "https://tiles.openfreemap.org/styles/liberty",
);

const center = ref<[number, number]>(CENTER_MAP_COORDINATES);

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    center.value = [longitude, latitude];
  });
}
else {
  console.warn("Geolocation is not supported by this browser.");
}

const zoom = 3;
</script>

<template>
  <div class="flex-1">
    <MglMap :map-style="style" :center="center" :zoom="zoom">
      <MglNavigationControl />
    </MglMap>
  </div>
</template>
