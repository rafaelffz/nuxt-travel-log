import type { MapPoint } from "~/lib/types";

export const useLocationsStore = defineStore("locations", () => {
  const { data, pending, refresh } = useLazyFetch("/api/locations", {
    key: "locations",
    cache: "force-cache",
  });

  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  effect(() => {
    if (data.value) {
      const mapPoints: MapPoint[] = [];
      const sidebarItems: SidebarItem[] = [];

      data.value.forEach((location) => {
        const mapPoint = createMapPointFromLocation(location);
        sidebarItems.push({
          id: `location-${location.id}`,
          label: location.name,
          icon: "tabler:map-pin-filled",
          to: { name: "dashboard-location-slug", params: { slug: location.slug } },
          mapPoint,
        });
        mapPoints.push(mapPoint);
      });

      sidebarStore.loading = false;
      sidebarStore.sidebarItems = sidebarItems;

      mapStore.mapPoints = mapPoints;
    }

    sidebarStore.loading = pending.value;
  });

  return {
    locations: data,
    pending,
    refresh,
  };
});
