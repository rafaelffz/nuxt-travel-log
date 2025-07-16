<script setup lang="ts">
import type { FetchError } from "ofetch";

const route = useRoute();
const locationsStore = useLocationsStore();
const {
  currentLocation: location,
  currentLocationPending: pending,
  currentLocationError,
} = storeToRefs(locationsStore);

const isOpen = ref<boolean>(false);
const deleteError = ref<string>("");
const isDeleting = ref<boolean>(false);

const loading = computed(() => pending.value || isDeleting.value);
const error = computed(() => currentLocationError.value || deleteError.value);

function openDialog() {
  isOpen.value = true;

  (document.activeElement as HTMLAnchorElement).blur();
}

async function confirmDelete() {
  try {
    isOpen.value = false;
    deleteError.value = "";
    isDeleting.value = true;

    await $fetch(`/api/location/${route.params.slug}`, {
      method: "DELETE",
    });

    refreshNuxtData("locations");
    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;
    deleteError.value = getFetchErrorMessage(error);
  }
  finally {
    isDeleting.value = false;
  }
}

onMounted(() => {
  locationsStore.refreshCurrentLocation();
});

onBeforeRouteUpdate((to) => {
  if (to.name === "dashboard-location-slug") {
    locationsStore.refreshCurrentLocation();
  }
});
</script>

<template>
  <div class="p-6 min-h-64">
    <div v-if="loading">
      <div class="skeleton h-6 w-24 animate-pulse" />
    </div>
    <div
      v-else-if="!loading && error"
      class="h-full flex flex-col gap-4 items-center justify-center"
    >
      <Icon name="tabler:zoom-question" size="62" class="text-red-500" />
      <h2 class="text-xl font-medium text-red-500">
        We couldn't find this location.
      </h2>
      <h2 class="text-lg font-medium text-base-content">
        Please, try again with another location.
      </h2>
    </div>
    <div v-else-if="!loading && location">
      <h2 class="text-3xl">
        {{ location?.name }}

        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle btn-sm p-0">
            <Icon size="20" name="tabler:dots-vertical" />
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
          >
            <li>
              <NuxtLink
                :to="{
                  name: 'dashboard-location-slug-edit',
                  params: { slug: route.params.slug },
                }"
                class="font-medium flex items-end gap-2"
              >
                <Icon name="tabler:edit" size="18" />
                <span>Edit Location</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                class="text-error font-medium flex items-end gap-2"
                @click="openDialog"
              >
                <Icon name="tabler:trash" size="18" />
                <span>Delete</span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </h2>
      <p class="text-md mt-1">
        {{ location?.description }}
      </p>

      <div v-if="!location.locationLogs.length" class="mt-4">
        <p class="text-sm italic">
          You haven't added any location logs yet. Add one now to get started.
        </p>
        <button class="btn btn-primary btn-sm flex items-center gap-2 mt-2">
          <Icon name="tabler:bookmark-plus" size="18" />
          <span class="text-sm">Add location log</span>
        </button>
      </div>
    </div>
    <div v-if="route.name !== 'dashboard-location-slug'">
      <NuxtPage />
    </div>
    <AppDialog
      title="Are you sure?"
      description="Deleting this location will also delete all of the associated logs. This cannot be undone. Do you really want to do this?"
      :is-open
      confirm-label="Yes, delete!"
      confirm-class="btn-error"
      @on-close="isOpen = false"
      @on-confirm="confirmDelete"
    />
  </div>
</template>
