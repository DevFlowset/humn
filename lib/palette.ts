/* Shader colours (Ember). CSS colours live in app/theme.css; keep the two in step. */

type Tone = { base: string; deep: string; deep2: string; core: string; coreLt: string; hi: string; peach: string; peach2: string; rose: string };

/** Ember: the final HUMN palette. */
const EMBER: Tone = { base: "#1A0904", deep: "#8A2A0C", deep2: "#B8380E", core: "#EE5A24", coreLt: "#F57E42", hi: "#FFB892", peach: "#FFE6D6", peach2: "#FFC6A2", rose: "#F79A66" };

export const palette = (): Tone => EMBER;

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
