export function useThemeTransition() {
  const colorMode = useColorMode();

  const isDark = computed(() => colorMode.value === "dark");

  const toggleTheme = async (event?: MouseEvent) => {
    if (!import.meta.client || !(document as any).startViewTransition) {
      console.error(
        "View Transitions API not supported or not on client, falling back to simple toggle.",
      );

      colorMode.preference = isDark.value ? "light" : "dark";
      return;
    }

    const x = event ? event.clientX : window.innerWidth / 2;
    const y = event ? event.clientY : window.innerHeight / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = (document as any).startViewTransition(async () => {
      colorMode.preference = isDark.value ? "light" : "dark";

      await nextTick();
    });

    await transition.ready;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const duration = isMobile ? 400 : 600;

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
        filter: ["blur(5px)", "blur(0px)"],
      },
      {
        duration,
        easing: "cubic-bezier(.76,.32,.29,.99)",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  };

  return {
    isDark,
    currentTheme: colorMode.value,
    preference: colorMode.preference,
    toggleTheme,
  };
}
