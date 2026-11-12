/* Scroll-triggered class toggles + click-to-replay, shared by Statement and Features. */

/** Adds `cls` to `target` once `node` is `th` visible; removes it when fully out of view. Returns a cleanup. */
export function watch(node: Element | null, target: Element | null, cls: string, th: number) {
  if (!node || !target) return () => {};
  if (!("IntersectionObserver" in window)) {
    target.classList.add(cls);
    return () => {};
  }
  const io = new IntersectionObserver(
    (es) => {
      const e = es[es.length - 1];
      if (e.intersectionRatio >= th) target.classList.add(cls);
      else if (!e.isIntersecting) target.classList.remove(cls);
    },
    { threshold: [0, th] },
  );
  io.observe(node);
  return () => io.disconnect();
}

/** Resets `target` (transitions off), then re-adds `cls` on the next paint so the sequence plays again. */
export function replay(target: HTMLElement, cls: string[]) {
  target.classList.add("rs");
  cls.forEach((c) => target.classList.remove(c));
  void target.offsetWidth;
  target.classList.remove("rs");
  requestAnimationFrame(() =>
    requestAnimationFrame(() => cls.forEach((c) => target.classList.add(c))),
  );
}

/** Scales the 1280px canvas down on narrow viewports. Sets --fit on `el` (1 at ≥1320px). */
export function fit(el: HTMLElement | null, width = 1320) {
  if (!el) return () => {};
  const set = () => el.style.setProperty("--fit", String(Math.min(1, document.documentElement.clientWidth / width)));
  set();
  window.addEventListener("resize", set);
  return () => window.removeEventListener("resize", set);
}
