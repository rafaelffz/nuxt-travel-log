import type { LngLatBounds } from "maplibre-gl";

import type { MapPoint } from "~/lib/types";

import { CENTER_MAP_COORDINATES } from "~/lib/constants";

export const useMapStore = defineStore("map", () => {
  const mapPoints = ref<MapPoint[]>([]);
  const selectedPoint = ref<MapPoint | null>(null);
  const addedPoint = ref<(MapPoint & { centerMap?: boolean; zoom?: number }) | null>(
    null,
  );

  let bounds: LngLatBounds | null = null;
  const padding = 60;

  async function init() {
    const { useMap } = await import("@indoorequal/vue-maplibre-gl");
    const map = useMap();

    effect(async () => {
      if (mapPoints.value.length > 0) {
        await adjustMapBounds();
      }
    });

    watch(addedPoint, (newValue, oldValue) => {
      if ((newValue && !oldValue) || newValue?.centerMap) {
        map.map?.flyTo(
          {
            center: [newValue.long, newValue.lat],
            speed: 0.8,
            zoom: newValue.zoom || 8,
          },
          {
            immediate: true,
          },
        );
      }
    });
  }

  async function adjustMapBounds() {
    const { useMap } = await import("@indoorequal/vue-maplibre-gl");
    const { LngLatBounds } = await import("maplibre-gl");

    const map = useMap();

    const firstPoint = mapPoints.value[0];
    if (!firstPoint) {
      map.map?.flyTo({
        center: CENTER_MAP_COORDINATES,
        zoom: 2,
      });
      return;
    }

    bounds = mapPoints.value.reduce(
      (bounds, point) => {
        return bounds.extend([point.long, point.lat]);
      },
      new LngLatBounds(
        [firstPoint.long, firstPoint.lat],
        [firstPoint.long, firstPoint.lat],
      ),
    );

    map.map?.fitBounds(bounds, {
      padding,
      maxZoom: addedPoint.value?.zoom || 8,
    });
  }

  return {
    init,
    mapPoints,
    selectedPoint,
    addedPoint,
    adjustMapBounds,
  };
});
