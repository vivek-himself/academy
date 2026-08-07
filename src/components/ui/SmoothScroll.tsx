"use client";

import { ReactLenis } from "lenis/react";

// Subtle overshoot-then-settle curve — smooth throughout, with a light spring at the end of each scroll.
function easeOutBackSubtle(t: number) {
  const c1 = 0.9;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export default function SmoothScroll() {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.1,
        easing: easeOutBackSubtle,
        smoothWheel: true,
        touchMultiplier: 1,
      }}
    />
  );
}
