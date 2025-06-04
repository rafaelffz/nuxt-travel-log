<script setup lang="ts">
const props = defineProps<{
  label: string;
  icon: string;
  href: string;
  showLabel?: boolean;
}>();

const route = useRoute();
</script>

<template>
  <div class="tooltip tooltip-right" :data-tip="showLabel ? undefined : props.label">
    <NuxtLink
      :to="props.href"
      :class="{
        'bg-base-300': route.path === props.href,
      }"
      class="flex items-center gap-2 p-2 hover:bg-base-300 rounded-lg cursor-pointer font-medium transition-all duration-100 ease-out"
    >
      <Icon :name="props.icon" size="24" class="mx-1 min-h-6 min-w-6" />
      <Transition name="grow-x">
        <span
          v-show="showLabel"
          class="whitespace-nowrap origin-left"
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
