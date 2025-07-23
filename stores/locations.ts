import type { SelectLocationLog, SelectLocationWithLogs } from "~/lib/db/schema";
import type { MapPoint } from "~/lib/types";

import {
  CURRENT_LOCATION_LOG_PAGES,
  CURRENT_LOCATION_PAGES,
  LOCATIONS_PAGES,
} from "~/lib/constants";

export const useLocationsStore = defineStore("locations", () => {
  const route = useRoute();

  const {
    data: locations,
    pending: locationsPending,
    status: locationStatus,
    refresh: refreshLocations,
  } = useLazyFetch("/api/locations", {
    key: "locations",
  });

  const locationUrlWithSlug = computed(() => `/api/location/${route.params.slug}`);
  const locationLogUrlWithSlugAndId = computed(
    () => `/api/location/${route.params.slug}/${route.params.id}`,
  );

  const {
    data: currentLocation,
    pending: currentLocationPending,
    status: currentLocationStatus,
    error: currentLocationError,
    refresh: refreshCurrentLocation,
  } = useLazyFetch<SelectLocationWithLogs>(locationUrlWithSlug, {
    immediate: false,
    watch: false,
  });

  const {
    data: currentLocationLog,
    status: currentLocationLogStatus,
    error: currentLocationLogError,
    refresh: refreshCurrentLocationLog,
  } = useLazyFetch<SelectLocationLog>(locationLogUrlWithSlugAndId, {
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
    ) {
      const mapPoints: MapPoint[] = [];
      const sidebarItems: SidebarItem[] = [];

      currentLocation.value.locationLogs.forEach((log) => {
        const mapPoint = createMapPointFromLocationLog(log);
        sidebarItems.push({
          id: `location-log-${log.id}`,
          label: log.name,
          icon: "tabler:bookmark-filled",
          to: { name: "dashboard-location-slug-id", params: { id: log.id } },
          mapPoint,
        });

        mapPoints.push(mapPoint);
      });

      sidebarStore.sidebarItems = sidebarItems;

      if (mapPoints.length) {
        mapStore.mapPoints = mapPoints;
      }
      else {
        mapStore.mapPoints = [currentLocation.value];
      }
    }
    else if (
      currentLocationLog.value
      && CURRENT_LOCATION_LOG_PAGES.has(route.name?.toString() || "")
    ) {
      sidebarStore.sidebarItems = [];
      mapStore.mapPoints = [currentLocationLog.value];
    }

    sidebarStore.loading
      = locationStatus.value === "pending" || currentLocationStatus.value === "pending";

    if (sidebarStore.loading) {
      mapStore.mapPoints = [];
    }
  });

  return {
    locations,
    locationsPending,
    refreshLocations,
    currentLocation,
    currentLocationPending,
    currentLocationStatus,
    currentLocationError,
    refreshCurrentLocation,
    currentLocationLog,
    currentLocationLogStatus,
    currentLocationLogError,
    refreshCurrentLocationLog,
  };
});
