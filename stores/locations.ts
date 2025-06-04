export const useLocationsStore = defineStore("locations", () => {
  const { data, pending, refresh } = useLazyFetch("/api/locations", {
    key: "locations",
    cache: "force-cache",
    server: false,
  });

  const sidebarStore = useSidebarStore();

  watchEffect(() => {
    if (data.value) {
      sidebarStore.loading = false;
      sidebarStore.sidebarItems = data.value.map(location => ({
        id: `location-${location.id}`,
        label: location.name,
        icon: "tabler:map-pin",
        href: "*",
      }));
    }

    sidebarStore.loading = pending.value;
  });

  return {
    locations: data,
    pending,
    refresh,
  };
});
