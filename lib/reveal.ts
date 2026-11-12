/* Scroll-triggered class toggles, shared by Statement and Features. */

/** Adds `cls` to `target` the first time `node` is `th` visible, then stops watching, so the sequence plays once. Returns a cleanup. */
export function watch(node: Element | null, target: Element | null, cls: string, th: number) {
  if (!node || !target) return () => {};
  if (!("IntersectionObserver" in window)) {
    target.classList.add(cls);
    return () => {};
  }
  // A tall node can never be `th` visible on a short screen (phone landscape), so cap th by what fits.
  const h = node.getBoundingClientRect().height;
  if (h > 0) th = Math.min(th, (innerHeight * 0.85) / h);
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

/**
 * Draws a dashed SVG path left to right, dash by dash (a plain dashoffset reveal can't keep a dash pattern).
 * Starts when `root` gains `cls`, after `delay` ms, over `dur` ms. Returns a cleanup.
 */
export function dashDraw(root: Element | null, path: SVGPathElement | null, cls = "go", delay = 500, dur = 3800, dash = 4, gap = 4) {
  if (!root || !path || matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const len = path.getTotalLength(), step = dash + gap;
  let raf = 0;
  const run = () => {
    const t0 = performance.now() + delay;
    const tick = (now: number) => {
      if (now < t0) { raf = requestAnimationFrame(tick); return; }
      const k = Math.min(1, (now - t0) / dur), v = k * len, n = Math.floor(v / step), r = v - n * step;
      path.style.opacity = "1";
      path.style.strokeDasharray = k >= 1 ? `${dash} ${gap}` : `${`${dash} ${gap} `.repeat(n)}${Math.min(r, dash).toFixed(2)} 9999`;
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
  let started = false;
  const mo = new MutationObserver(() => {
    if (!started && root.classList.contains(cls)) { started = true; run(); }
  });
  mo.observe(root, { attributes: true, attributeFilter: ["class"] });
  if (root.classList.contains(cls)) { started = true; run(); }
  return () => { mo.disconnect(); cancelAnimationFrame(raf); };
}
