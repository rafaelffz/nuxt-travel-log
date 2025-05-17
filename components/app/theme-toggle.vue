<script setup lang="ts">
const { isDark, toggleTheme } = useThemeTransition();
const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});

function handleThemeToggle(event: MouseEvent) {
  toggleTheme(event);
}
</script>

<template>
  <label class="swap swap-rotate mx-4">
    <input v-model="isDark" type="checkbox" @click="handleThemeToggle">
    <Icon class="swap-on" name="tabler:sun" size="24" />
    <Icon class="swap-off" name="tabler:moon-filled" size="24" />
  </label>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
</style>
