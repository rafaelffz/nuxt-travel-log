<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

const props = defineProps<{
  label: string;
  icon: string;
  href?: string;
  to?: RouteLocationRaw;
  showLabel?: boolean;
  iconColor?: "text-accent" | "text-primary" | "text-secondary";
}>();

const route = useRoute();
</script>

<template>
  <div class="tooltip tooltip-right" :data-tip="showLabel ? undefined : props.label">
    <NuxtLink
      :to="props.href || props.to"
      :class="{
        'bg-base-300': route.path === props.href,
      }"
      class="relative gap-2 before:content-[''] before:scale-0 before:opacity-0 hover:before:scale-100 hover:before:opacity-100 before:bg-base-300 before:absolute before:rounded-lg before:origin-center before:inset-0 before:z-0 before:transition-all before:duration-200 before:ease-[cubic-bezier(0.18,0.89,0.32,1.05)] flex items-center p-2 rounded-lg cursor-pointer font-medium"
    >
      <Icon
        :name="props.icon"
        size="24"
        class="mx-1 min-h-6 min-w-6"
        :class="props.iconColor"
      />
      <Transition name="grow-x">
        <span
          v-show="showLabel"
          class="origin-left z-10 w-full truncate"
          :class="[showLabel ? 'w-auto opacity-100' : 'w-0 opacity-0']"
        >{{ props.label }}</span>
      </Transition>
    </NuxtLink>
  </div>
</template>

<style scoped>
.grow-x-enter-active,
.grow-x-leave-active {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
  transform-origin: left;
}

.grow-x-enter-from,
.grow-x-leave-to {
  transform: scaleX(0);
  opacity: 0;
}

.grow-x-enter-to,
.grow-x-leave-from {
  transform: scaleX(1);
  opacity: 1;
}
</style>
