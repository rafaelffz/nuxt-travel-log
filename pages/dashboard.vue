<script setup lang="ts">
import {
  CURRENT_LOCATION_LOG_PAGES,
  CURRENT_LOCATION_PAGES,
  EDIT_PAGES,
  LOCATIONS_PAGES,
} from "~/lib/constants";

useHead({
  title: "MyTravlo | Dashboard",
});

const route = useRoute();
const sidebarStore = useSidebarStore();
const mapStore = useMapStore();
const locationsStore = useLocationsStore();
const { currentLocation, currentLocationPending, currentLocationStatus }
  = storeToRefs(locationsStore);
const { loading } = storeToRefs(sidebarStore);
const { showLoading } = useDelayedLoading(loading);

const isSidebarOpen = ref(true);

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}

if (LOCATIONS_PAGES.has(route.name?.toString() || "")) {
  await locationsStore.refreshLocations();
}

if (
  CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")
  || CURRENT_LOCATION_LOG_PAGES.has(route.name?.toString() || "")
) {
  await locationsStore.refreshCurrentLocation();
}

if (CURRENT_LOCATION_LOG_PAGES.has(route.name?.toString() || "")) {
  await locationsStore.refreshCurrentLocationLog();
}

watchEffect(() => {
  if (LOCATIONS_PAGES.has(route.name?.toString() || "")) {
    sidebarStore.sidebarTopItems = [
      {
        id: "link-dashboard",
        label: "Locations",
        href: "/dashboard",
        icon: "tabler:map-2",
      },
      {
        id: "link-location-add",
        label: "Add Location",
        href: "/dashboard/add",
        icon: "tabler:map-plus",
      },
    ];
  }
  else if (CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
    sidebarStore.sidebarTopItems = [
      {
        id: "link-dashboard",
        label: "Back to Locations",
        href: "/dashboard",
        icon: "tabler:arrow-back-up",
      },
    ];

    if (currentLocation.value && currentLocationStatus.value !== "pending") {
      sidebarStore.sidebarTopItems.push(
        {
          id: "link-dashboard",
          label: currentLocation.value.name,
          to: {
            name: "dashboard-location-slug",
            params: {
              slug: route.params.slug,
            },
          },
          icon: "tabler:map-2",
        },
        {
          id: "link-location-edit",
          label: "Edit Location",
          to: {
            name: "dashboard-location-slug-edit",
            params: {
              slug: route.params.slug,
            },
          },
          icon: "tabler:edit",
        },
        {
          id: "link-location-add",
          label: "Add Location Log",
          to: {
            name: "dashboard-location-slug-add",
            params: {
              slug: route.params.slug,
            },
          },
          icon: "tabler:bookmark-plus",
        },
      );
    }
  }
  else if (CURRENT_LOCATION_LOG_PAGES.has(route.name?.toString() || "")) {
    if (currentLocation.value && currentLocationStatus.value !== "pending") {
      sidebarStore.sidebarTopItems = [
        {
          id: "link-location",
          label: `Back to ${currentLocation.value.name}`,
          to: {
            name: "dashboard-location-slug",
            params: {
              slug: route.params.slug,
            },
          },
          icon: "tabler:arrow-back-up",
        },
      ];
    }
  }
});

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
});
</script>

<template>
  <div class="flex-1 flex">
    <div
      class="bg-base-100 p-2 flex flex-col space-y-2 transition-all duration-300 ease-out shrink-0"
      :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }"
    >
      <div
        class="flex cursor-pointer hover:bg-base-300 rounded-md"
        :class="{
          'justify-center': !isSidebarOpen,
          'justify-end': isSidebarOpen,
        }"
        @click="toggleSidebar"
      >
        <Icon v-show="isSidebarOpen" name="tabler:chevrons-left" size="32" />
        <Icon v-show="!isSidebarOpen" name="tabler:chevrons-right" size="32" />
      </div>

      <div class="flex flex-col flex-1 gap-1">
        <SidebarButton
          v-for="item in sidebarStore.sidebarTopItems"
          :key="item.id"
          :show-label="isSidebarOpen"
          :label="item.label"
          :icon="item.icon"
          :href="item.href"
          :to="item.to"
        />

        <div
          v-if="route.path.startsWith('/dashboard/location') && currentLocationPending"
          class="flex flex-col gap-2"
        >
          <div
            v-for="(_, index) in 3"
            :key="index"
            class="skeleton h-9 w-full animate-pulse"
          />
        </div>

        <div
          v-show="sidebarStore.sidebarItems.length > 0 || showLoading"
          class="divider m-0"
        />

        <div v-show="!showLoading" class="flex flex-col gap-1">
          <SidebarButton
            v-for="item in sidebarStore.sidebarItems"
            :key="item.id"
            :show-label="isSidebarOpen"
            :label="item.label"
            :icon="item.icon"
            :to="item.to"
            :icon-color="
              isPointSelected(item.mapPoint, mapStore.selectedPoint)
                ? 'text-accent'
                : undefined
            "
            @mouseenter="mapStore.selectedPoint = item.mapPoint ?? null"
            @mouseleave="mapStore.selectedPoint = null"
          />
        </div>

        <div v-show="showLoading" class="flex flex-col gap-2">
          <div
            v-for="(_, index) in 3"
            :key="index"
            class="skeleton h-9 w-full animate-pulse"
          />
        </div>
      </div>

      <div class="divider m-0" />

      <div class="flex flex-col">
        <SidebarButton
          :show-label="isSidebarOpen"
          label="Sign Out"
          icon="tabler:logout-2"
          href="/sign-out"
        />
      </div>
    </div>
    <div class="flex-1 overflow-auto bg-base-200">
      <div
        class="flex size-full max-h-full"
        :class="{ 'flex-col': !EDIT_PAGES.has(route.name?.toString() || '') }"
      >
        <NuxtPage
          :class="{
            'shrink-0': EDIT_PAGES.has(route.name?.toString() || ''),
            'w-96': EDIT_PAGES.has(route.name?.toString() || ''),
          }"
        />
        <AppMap />
      </div>
    </div>
  </div>
</template>
