<script setup lang="ts">
const route = useRoute();
const error = route.query.error || "An unknown error occurred";
</script>

<template>
  <div
    class="card bg-base-300 container mt-4 min-h-72 text-center mx-auto flex flex-col justify-center items-center gap-4"
  >
    <div role="alert" class="alert alert-error min-w-1/2 flex justify-center">
      <span>Oh no! {{ error }}</span>
    </div>
    <NuxtLink to="/" class="btn btn-primary flex items-center">
      <Icon name="tabler:arrow-left" size="24" />
      Go to Home
    </NuxtLink>
  </div>
</template>
