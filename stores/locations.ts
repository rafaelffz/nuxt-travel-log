import type { SelectLocationWithLogs } from "~/lib/db/schema";
import type { MapPoint } from "~/lib/types";

import { CURRENT_LOCATION_PAGES, LOCATIONS_PAGES } from "~/lib/constants";

export const useLocationsStore = defineStore("locations", () => {
  const route = useRoute();

  const {
    data: locations,
    pending: locationsPending,
    refresh: refreshLocations,
  } = useLazyFetch("/api/locations", {
    key: "locations",
  });

  const locationUrlWithSlug = computed(() => `/api/location/${route.params.slug}`);
  const {
    data: currentLocation,
    pending: currentLocationPending,
    error: currentLocationError,
    refresh: refreshCurrentLocation,
  } = useLazyFetch<SelectLocationWithLogs>(locationUrlWithSlug, {
    key: `location-${route.params.slug}`,
    // cache: "force-cache",
    immediate: false,
    watch: false,
  });

  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  effect(() => {
    if (locations.value && LOCATIONS_PAGES.has(route.name?.toString() || "")) {
      const mapPoints: MapPoint[] = [];
      const sidebarItems: SidebarItem[] = [];

      locations.value.forEach((location) => {
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

      sidebarStore.sidebarItems = sidebarItems;
      mapStore.mapPoints = mapPoints;
    }
    else if (
      currentLocationPending.value
      && CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")
    ) {
      sidebarStore.sidebarItems = [];
    }
    else if (
      currentLocation.value
      && CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")
      && route.params.slug === currentLocation.value.slug
    ) {
      sidebarStore.sidebarItems = [];
      mapStore.mapPoints = [currentLocation.value];
    }
    sidebarStore.loading = locationsPending.value;
  });

  return {
    locations,
    locationsPending,
    refreshLocations,
    currentLocation,
    currentLocationPending,
    currentLocationError,
    refreshCurrentLocation,
  };
});
