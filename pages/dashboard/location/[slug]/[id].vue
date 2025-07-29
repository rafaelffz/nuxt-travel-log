<script setup lang="ts">
import type { FetchError } from "ofetch";

const route = useRoute();
const locationsStore = useLocationsStore();

const {
  currentLocationLog: locationLog,
  currentLocationLogStatus: status,
  currentLocationLogError: error,
} = storeToRefs(locationsStore);

const isOpen = ref<boolean>(false);
const deleteError = ref<string>("");
const isDeleting = ref<boolean>(false);

const loading = computed(() => isDeleting.value || status.value === "pending");

function openDialog() {
  isOpen.value = true;

  (document.activeElement as HTMLAnchorElement).blur();
}

async function confirmDelete() {
  try {
    isOpen.value = false;
    deleteError.value = "";
    isDeleting.value = true;

    await $fetch(`/api/location/${route.params.slug}/${route.params.id}`, {
      method: "DELETE",
    });

    navigateTo({
      name: "dashboard-location-slug",
      params: { slug: route.params.slug },
    });
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
  locationsStore.refreshCurrentLocationLog();
});

onBeforeRouteUpdate((to) => {
  if (to.name === "dashboard-location-slug-id") {
    locationsStore.refreshCurrentLocationLog();
  }
});
</script>

<template>
  <div>
    <div v-if="loading" class="flex flex-col gap-4">
      <div class="skeleton h-5 w-36 animate-pulse" />
      <div class="skeleton h-10 w-48 animate-pulse" />
      <div class="flex gap-2 h-full">
        <div
          v-for="(_, index) in 3"
          :key="index"
          class="skeleton h-32 w-72 animate-pulse"
        />
      </div>
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

    <div
      v-else-if="route.name === 'dashboard-location-slug-id' && !loading && locationLog"
    >
      <h2 class="text-3xl">
        <p
          v-if="locationLog.startedAt !== locationLog.endedAt"
          class="text-sm text-gray-500"
        >
          {{ formatDateBR(locationLog.startedAt) }} -
          {{ formatDateBR(locationLog.endedAt) }}
        </p>
        <p v-else class="text-sm text-gray-500">
          {{ formatDateBR(locationLog.startedAt) }}
        </p>
        {{ locationLog?.name }}

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
                  name: 'dashboard-location-slug-id-edit',
                  params: { slug: route.params.slug, id: route.params.id },
                }"
                class="font-medium flex items-end gap-2"
              >
                <Icon name="tabler:edit" size="18" />
                <span>Edit Location Log</span>
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
        {{ locationLog?.description }}
      </p>
      <div v-if="!locationLog.images.length">
        <p class="text-sm italic">
          You haven't added any image yet. Add one now to get started.
        </p>
        <NuxtLink
          class="btn btn-primary btn-sm mt-2"
          :to="{
            name: 'dashboard-location-slug-id-images',
            params: { slug: route.params.slug, id: route.params.id },
          }"
        >
          <Icon name="tabler:photo-cog" size="18" />
          <span class="text-sm">Add Image</span>
        </NuxtLink>
      </div>
      <ImageList :images="locationLog.images" />
    </div>
    <div v-else>
      <NuxtPage />
    </div>

    <AppDialog
      title="Are you sure?"
      description="Deleting this location log cannot be undone. Do you really want to do this?"
      :is-open
      confirm-label="Yes, delete!"
      confirm-class="btn-error"
      @on-close="isOpen = false"
      @on-confirm="confirmDelete"
    />
  </div>
</template>
