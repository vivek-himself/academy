"use client";

import { ReactLenis } from "lenis/react";

// lerp-based damping (Lenis's own documented default mechanism for continuous wheel/touch
// scroll) rather than a fixed-duration custom easing. The previous config used a "back"
// easing with overshoot, replayed via a fresh 1.1s animation on every single wheel tick —
// per Lenis's own docs, duration/easing is intended for one-shot programmatic scrollTo, not
// continuous input, and the overshoot could push Lenis's internal scroll position outside
// the page's actual bounds. That combination is the likely cause of scrolling occasionally
// freezing until a hard refresh. lerp damping recomputes toward the current target every
// frame with no fixed timer and no overshoot, which is what avoids that class of bug.
export default function SmoothScroll() {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        touchMultiplier: 1,
        // Without this, Lenis hijacks wheel/touch input over any nested scrollable element
        // (the course module list, modal bodies, dropdown menus) and tries to scroll the
        // page instead — the inner element only moves if you drag its scrollbar directly.
        // This is Lenis's own documented fix for that.
        allowNestedScroll: true,
      }}
    />
  );
}
