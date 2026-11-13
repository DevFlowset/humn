/* Shader colours per palette. CSS colours live in app/theme.css; keep the two in step. */

export type PaletteName = "ember" | "crimson";

type Tone = { base: string; deep: string; deep2: string; core: string; coreLt: string; hi: string; peach: string; peach2: string; rose: string };

export const PALETTES: Record<PaletteName, Tone> = {
  ember: { base: "#1A0904", deep: "#8A2A0C", deep2: "#B8380E", core: "#EE5A24", coreLt: "#F57E42", hi: "#FFB892", peach: "#FFE6D6", peach2: "#FFC6A2", rose: "#F79A66" },
  crimson: { base: "#120305", deep: "#6B000C", deep2: "#8C0018", core: "#C4002A", coreLt: "#DA2440", hi: "#FF8590", peach: "#FFDADC", peach2: "#FF9EA6", rose: "#EA4A5E" },
};

export const palette = (): Tone => {
  const n = typeof document !== "undefined" ? document.documentElement.dataset.palette : undefined;
  return PALETTES[n === "crimson" ? "crimson" : "ember"];
};

/** Dark field behind hero and close: base → deep → core → highlight. */
export const fieldColors = () => {
  const p = palette();
  return { uBase: p.base, uDeep: p.deep, uCore: p.core, uHigh: p.hi };
};

/** Bright orb (features hub, trust orb, coach orb). */
export const orbColors = () => {
  const p = palette();
  return { uBase: p.coreLt, uDeep: p.rose, uCore: p.peach2, uHigh: p.peach };
};

/** Statement bars: deep tones only. */
export const barColors = () => {
  const p = palette();
  return { uBase: p.deep, uDeep: p.deep2, uCore: p.core, uHigh: p.coreLt };
};

/** Inline script for <head>: sets data-palette before first paint. */
export const PALETTE_BOOT = `(function(){try{var q=new URLSearchParams(location.search).get('palette');var s=q||localStorage.getItem('humn-palette');if(q)localStorage.setItem('humn-palette',q);document.documentElement.dataset.palette=s==='crimson'?'crimson':'ember'}catch(e){document.documentElement.dataset.palette='ember'}})()`;
