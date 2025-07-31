<script lang="ts" setup>
import type { SelectLocationLogImage } from "~/lib/db/schema";

const props = defineProps<{
  images: SelectLocationLogImage[];
}>();

const config = useRuntimeConfig();
</script>

<template>
  <div class="flex mt-2 gap-2">
    <div
      v-for="image in props.images"
      :key="image.id"
      class="card card-compact w-64 shrink-0 flex items-center justify-center bg-base-300"
    >
      <div class="size-full">
        <img
          class="size-full object-cover h-36"
          :src="`${config.public.s3PubEndpoint}/${image.key}`"
          alt="Log's image"
        >
      </div>
      <div class="flex w-full justify-center p-1">
        <slot :image />
      </div>
    </div>
  </div>
</template>
