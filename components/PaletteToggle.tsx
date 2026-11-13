"use client";

import { useEffect, useState } from "react";
import type { PaletteName } from "@/lib/palette";

const OPTS: { id: PaletteName; label: string; dot: string }[] = [
  { id: "ember", label: "Ember", dot: "linear-gradient(135deg,#EE5A24,#FFC6A2)" },
  { id: "crimson", label: "Crimson", dot: "linear-gradient(135deg,#6B000C,#C4002A)" },
];

/** Review-only: flips the palette live so the client can compare. Remove before launch. */
export default function PaletteToggle() {
  const [p, setP] = useState<PaletteName>("ember");
  useEffect(() => {
    setP(document.documentElement.dataset.palette === "crimson" ? "crimson" : "ember");
  }, []);
  const pick = (id: PaletteName) => {
    document.documentElement.dataset.palette = id;
    try {
      localStorage.setItem("humn-palette", id);
    } catch {}
    setP(id);
  };
  return (
    <div className="pal" role="group" aria-label="Palette">
      {OPTS.map((o) => (
        <button key={o.id} type="button" aria-pressed={p === o.id} onClick={() => pick(o.id)}>
          <i style={{ background: o.dot }} />
          {o.label}
        </button>
      ))}
    </div>
  );
}
