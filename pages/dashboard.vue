<script setup lang="ts">
useHead({
  title: "MyTravlo | Dashboard",
});

const route = useRoute();
const sidebarStore = useSidebarStore();
const mapStore = useMapStore();
const locationsStore = useLocationsStore();
const { loading } = storeToRefs(sidebarStore);
const { showLoading } = useDelayedLoading(loading);

const isSidebarOpen = ref(true);

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
  if (route.path !== "/dashboard") {
    locationsStore.refresh();
  }
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
          :show-label="isSidebarOpen"
          label="Locations"
          icon="tabler:map-2"
          href="/dashboard"
        />
        <SidebarButton
          :show-label="isSidebarOpen"
          label="Add Location"
          icon="tabler:map-plus"
          href="/dashboard/add"
        />

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
            class="skeleton h-8 w-full animate-pulse"
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
        :class="{ 'flex-col': route.path !== '/dashboard/add' }"
      >
        <NuxtPage />
        <AppMap />
      </div>
    </div>
  </div>
</template>
