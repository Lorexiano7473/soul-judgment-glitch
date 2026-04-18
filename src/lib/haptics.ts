// Wrapper haptics: usa navigator.vibrate (web/Capacitor Android lo supporta).
// Pattern brevi e secchi per feedback su trofei / easter egg.
export function vibrate(pattern: number | number[]) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      (navigator as Navigator).vibrate(pattern);
    }
  } catch {
    /* noop */
  }
}

export const hapticTap = () => vibrate(15);
export const hapticTrophy = () => vibrate([40, 30, 80]);
export const hapticGlitch = () => vibrate([10, 20, 10, 20, 60]);
