<script setup lang="ts">
useHead({
  title: "MyTravlog | Dashboard",
});

const isSidebarOpen = ref(true);

function toggleSidebaer() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
});
</script>

<template>
  <div class="flex-1 flex">
    <div
      class="bg-base-100 p-2 flex flex-col space-y-2 border-r border-r-base-300 transition-all duration-300 ease-out"
      :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }"
    >
      <div
        class="flex cursor-pointer hover:bg-base-300 rounded-md"
        :class="{
          'justify-center': !isSidebarOpen,
          'justify-end': isSidebarOpen,
        }"
        @click="toggleSidebaer"
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
      </div>

      <div class="divider m-0" />

      <div>
        <SidebarButton
          :show-label="isSidebarOpen"
          label="Sign Out"
          icon="tabler:logout-2"
          href="/sign-out"
        />
      </div>
    </div>
    <div class="flex-1">
      <NuxtPage />
    </div>
  </div>
</template>
