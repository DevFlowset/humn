import type { PointerEvent } from "react";

const reduced = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

type Spring = { x: number; y: number; tx: number; ty: number; raf: number };
const store = new WeakMap<HTMLElement, Spring>();
const spring = (el: HTMLElement): Spring => {
  let s = store.get(el);
  if (!s) { s = { x: 0, y: 0, tx: 0, ty: 0, raf: 0 }; store.set(el, s); }
  return s;
};
const clamp = (n: number) => Math.max(-1, Math.min(1, n));

/** Phone tilt: eased pointer follow, sets --rx --ry --gx --gy. */
export function makeTilt() {
  return (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    if (reduced() || e.pointerType === "touch") return;
    const s = spring(el);
    if (e.type === "pointermove" || e.type === "pointerenter") {
      const r = el.getBoundingClientRect();
      s.tx = clamp(((e.clientX - r.left) / r.width - 0.5) * 2);
      s.ty = clamp(((e.clientY - r.top) / r.height - 0.5) * 2);
    } else { s.tx = 0; s.ty = 0; }
    if (s.raf) return;
    const step = () => {
      s.x += (s.tx - s.x) * 0.08; s.y += (s.ty - s.y) * 0.08;
      el.style.setProperty("--rx", (-s.y * 4).toFixed(2) + "deg");
      el.style.setProperty("--ry", (s.x * 5).toFixed(2) + "deg");
      el.style.setProperty("--gx", (50 + s.x * 40).toFixed(1) + "%");
      el.style.setProperty("--gy", (10 + s.y * 30).toFixed(1) + "%");
      if (Math.abs(s.tx - s.x) > 0.002 || Math.abs(s.ty - s.y) > 0.002) s.raf = requestAnimationFrame(step);
      else s.raf = 0;
    };
    s.raf = requestAnimationFrame(step);
  };
}

/** Magnetic CTA: eased lean toward pointer, sets --tx --ty --lx --ly. */
export function mag(e: PointerEvent<HTMLElement>) {
  const btn = e.currentTarget;
  if (reduced() || e.pointerType === "touch") return;
  const s = spring(btn);
  if (e.type === "pointermove" || e.type === "pointerenter") {
    const r = btn.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2 - s.x)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2 - s.y)) / (r.height / 2);
    s.tx = clamp(dx) * 8;
    s.ty = clamp(dy) * 5;
  } else { s.tx = 0; s.ty = 0; }
  if (s.raf) return;
  const step = () => {
    s.x += (s.tx - s.x) * 0.14; s.y += (s.ty - s.y) * 0.14;
    btn.style.setProperty("--tx", s.x.toFixed(2) + "px");
    btn.style.setProperty("--ty", s.y.toFixed(2) + "px");
    btn.style.setProperty("--lx", (s.x * 0.45).toFixed(2) + "px");
    btn.style.setProperty("--ly", (s.y * 0.45).toFixed(2) + "px");
    if (Math.abs(s.tx - s.x) > 0.02 || Math.abs(s.ty - s.y) > 0.02) s.raf = requestAnimationFrame(step);
    else s.raf = 0;
  };
  s.raf = requestAnimationFrame(step);
}
