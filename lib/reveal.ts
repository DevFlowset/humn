/* Scroll-triggered class toggles, shared by Statement and Features. */

/** Adds `cls` to `target` the first time `node` is `th` visible, then stops watching, so the sequence plays once. Returns a cleanup. */
export function watch(node: Element | null, target: Element | null, cls: string, th: number) {
  if (!node || !target) return () => {};
  if (!("IntersectionObserver" in window)) {
    target.classList.add(cls);
    return () => {};
  }
  const io = new IntersectionObserver(
    (es) => {
      if (es.some((e) => e.intersectionRatio >= th)) {
        target.classList.add(cls);
        io.disconnect();
      }
    },
    { threshold: [th] },
  );
  io.observe(node);
  return () => io.disconnect();
}

/** Scales the fixed-width design down on narrow viewports. Sets --fit on `el` (1 at ≥ `width` px). */
export function fit(el: HTMLElement | null, width = 1440) {
  if (!el) return () => {};
  const set = () => el.style.setProperty("--fit", String(Math.min(1, document.documentElement.clientWidth / width)));
  set();
  window.addEventListener("resize", set);
  return () => window.removeEventListener("resize", set);
}
