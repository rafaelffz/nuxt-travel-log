<template>
  <div class="navbar bg-primary text-primary-content">
    <div class="navbar-start">
      <NuxtLink to="/" class="text-xl font-semibold text-white hover:underline">
        Travel Log
      </NuxtLink>
    </div>
    <div class="navbar-end">
      <AppThemeToggle />
      <AuthButton />
    </div>
  </div>
</template>
