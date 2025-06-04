export function useDelayedLoading(loading: Ref<boolean>, delay: number = 100) {
  const showLoading = ref(false);
  let timer: NodeJS.Timeout;

  watch(
    loading,
    (newValue) => {
      if (newValue) {
        timer = setTimeout(() => {
          showLoading.value = true;
        }, delay);
      }
      else {
        clearTimeout(timer);
        showLoading.value = false;
      }
    },
    { immediate: true },
  );

  onUnmounted(() => {
    clearTimeout(timer);
  });

  return {
    showLoading,
  };
}
