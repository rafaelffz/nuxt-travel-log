export const useLocationsStore = defineStore("locations", () => {
  const { data, pending, refresh } = useLazyFetch("/api/locations", {
    key: "locations",
    cache: "force-cache",
    server: false,
  });

  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  effect(() => {
    if (data.value) {
      sidebarStore.loading = false;
      sidebarStore.sidebarItems = data.value.map(location => ({
        id: `location-${location.id}`,
        label: location.name,
        icon: "tabler:map-pin",
        href: "*",
      }));

      mapStore.mapPoints = data.value.map((location) => {
        return {
          id: location.id,
          label: location.name,
          lat: location.lat,
          long: location.long,
        };
      });
    }

    sidebarStore.loading = pending.value;
  });

  return {
    locations: data,
    pending,
    refresh,
  };
});
