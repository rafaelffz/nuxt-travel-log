<script lang="ts" setup>
import type { SelectLocationLogImage } from "~/lib/db/schema";

const props = defineProps<{
  images: SelectLocationLogImage[];
}>();

const config = useRuntimeConfig();
</script>

<template>
  <div class="flex mt-2 gap-2 overflow-auto">
    <div
      v-for="image in props.images"
      :key="image.id"
      class="card card-compact h-40 w-64 shrink-0 flex items-center justify-center bg-base-300"
    >
      <div class="size-full">
        <img
          class="size-full object-cover"
          :src="`${config.public.s3Endpoint}/${image.key}`"
          alt="Log's image"
        >
      </div>
    </div>
  </div>
</template>
