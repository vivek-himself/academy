"use client";

import { useEffect, useRef } from "react";

const HOVER_TARGET_SELECTOR = "a, button, [role='button'], input, textarea, select, summary";

export default function LiquidCursor() {
  const orbRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const canHover = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reducedMotion) return;

    const orb = orbRef.current;
    if (!orb) return;

    document.body.classList.add("liquid-cursor-active");

    let initialized = false;
    const handleMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!initialized) {
        pos.current.x = e.clientX;
        pos.current.y = e.clientY;
        initialized = true;
      }
    };
    const handleOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.(HOVER_TARGET_SELECTOR)) {
        orb.classList.add("liquid-cursor-orb--active");
      }
    };
    const handleOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.(HOVER_TARGET_SELECTOR)) {
        orb.classList.remove("liquid-cursor-orb--active");
      }
    };
    const handleDown = () => orb.classList.add("liquid-cursor-orb--down");
    const handleUp = () => orb.classList.remove("liquid-cursor-orb--down");
    const handleLeave = () => orb.classList.add("liquid-cursor-orb--hidden");
    const handleEnter = () => orb.classList.remove("liquid-cursor-orb--hidden");

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    window.addEventListener("mouseout", handleOut);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.2;
      pos.current.y += (target.current.y - pos.current.y) * 0.2;
      orb.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mouseout", handleOut);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
      cancelAnimationFrame(rafId.current);
      document.body.classList.remove("liquid-cursor-active");
    };
  }, []);

  return (
    <div ref={orbRef} className="liquid-cursor-orb liquid-cursor-orb--hidden" aria-hidden="true">
      <div className="liquid-cursor-orb__highlight" />
    </div>
  );
}
