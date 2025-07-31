<script lang="ts" setup>
import { motion } from "motion-v";
import { FetchError } from "ofetch";

import type { SelectLocationLogImage } from "~/lib/db/schema";

const route = useRoute();
const locationsStore = useLocationsStore();
const { currentLocationLog: locationLog } = storeToRefs(locationsStore);

const { $csrfFetch } = useNuxtApp();

const image = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const loading = ref(false);
const errorMessage = ref("");
const imageInput = useTemplateRef<HTMLInputElement>("imageInput");
const isOpen = ref<boolean>(false);
const isDeleting = ref<boolean>(false);
const deletingImage = ref<SelectLocationLogImage | null>(null);

function onDialogClose() {
  deletingImage.value = null;
  isOpen.value = false;
}

function deleteImage(image: SelectLocationLogImage) {
  deletingImage.value = image;
  isOpen.value = true;
}

async function confirmDelete() {
  if (!deletingImage.value)
    return;

  isOpen.value = false;
  try {
    isDeleting.value = true;
    await $fetch(
      `/api/location/${route.params.slug}/${route.params.id}/image/${deletingImage.value.id}`,
      {
        method: "DELETE",
      },
    );
    await locationsStore.refreshCurrentLocationLog();
  }
  catch (e) {
    const error = e as FetchError;

    errorMessage.value = getFetchErrorMessage(error);
  }

  isDeleting.value = false;
  deletingImage.value = null;
}

function selectImage(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    image.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
}

async function getChecksum(blob: Blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
}

async function uploadImage() {
  if (!image.value || !previewUrl.value)
    return;

  loading.value = true;
  errorMessage.value = "";

  const previewImage = new Image();
  previewImage.addEventListener("load", async () => {
    const width = Math.min(1024, previewImage.width);
    const resized = await createImageBitmap(previewImage, {
      resizeWidth: width,
    });

    const canvas = new OffscreenCanvas(width, resized.height);
    canvas.getContext("bitmaprenderer")?.transferFromImageBitmap(resized);
    const blob = await canvas.convertToBlob({
      type: "image/jpeg",
      quality: 0.9,
    });

    const checksum = await getChecksum(blob);

    try {
      const { signedUrl, key } = await $csrfFetch(
        `/api/location/${route.params.slug}/${route.params.id}/sign-image`,
        {
          method: "POST",
          body: {
            checksum,
            contentLength: blob.size,
            fileName: image.value?.name || "",
          },
        },
      );

      await $fetch(signedUrl, {
        method: "PUT",
        body: blob,
      });

      await $csrfFetch(`/api/location/${route.params.slug}/${route.params.id}/image`, {
        method: "POST",
        body: {
          key,
        },
      });

      await locationsStore.refreshCurrentLocationLog();
      image.value = null;
      previewUrl.value = null;
      if (imageInput.value) {
        imageInput.value.value = "";
      }
    }
    catch (err) {
      if (err instanceof FetchError) {
        errorMessage.value = (err as FetchError).statusMessage || "Unknown error";
      }
      else if (err instanceof Error) {
        errorMessage.value = (err as Error).message;
      }
      else {
        errorMessage.value = "Unknown error";
      }
    }

    loading.value = false;
  });

  previewImage.src = previewUrl.value;
}
</script>

<template>
  <div>
    <div class="flex items-center gap-4">
      <div class="flex gap-2 flex-col w-72">
        <h2 class="text-lg mb-2">
          Manage "{{ locationLog?.name || "Loading..." }}" Images
        </h2>

        <div class="bg-gray-500 h-28 w-full flex justify-center items-center p-1">
          <p v-if="!previewUrl" class="text-center text-white">
            Select an image
          </p>
          <img
            v-else
            :src="previewUrl"
            class="h-full object-cover"
            alt="upload preview"
          >
        </div>

        <motion.div
          v-if="errorMessage"
          role="alert"
          class="alert alert-error"
          :initial="{ scale: 0 }"
          :animate="{ scale: 1 }"
          :transition="{ type: 'spring', stiffness: 260, damping: 20 }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span> {{ errorMessage }} </span>
        </motion.div>

        <input
          ref="imageInput"
          type="file"
          accept="image/jpeg, image/jpg, image/png"
          class="file-input"
          :disabled="loading"
          @change="selectImage"
        >
        <button
          class="btn btn-primary"
          :disabled="!image || loading"
          @click="uploadImage"
        >
          <div v-if="!loading" class="flex items-center gap-1">
            <span>Upload</span>
            <Icon name="tabler:photo-share" size="20" />
          </div>
          <span v-else class="loading loading-spinner loading-xl" />
        </button>
      </div>

      <ImageList :images="locationLog?.images || []">
        <template #default="{ image: item }">
          <button
            :disabled="deletingImage === item && isDeleting"
            class="btn btn-error btn-sm w-full"
            @click="deleteImage(item)"
          >
            <span
              v-if="deletingImage === item && isDeleting"
              class="loading loading-spinner loading-xs"
            />
            <Icon v-else name="tabler:trash" size="16" />
            Delete
          </button>
        </template>
      </ImageList>
    </div>

    <AppDialog
      title="Are you sure?"
      description="Deleting this iamge cannot be undone. Do you really want to do this?"
      :is-open
      confirm-label="Yes, delete!"
      confirm-class="btn-error"
      @on-close="onDialogClose"
      @on-confirm="confirmDelete"
    />
  </div>
</template>
