import type { CSSProperties } from "react";

/** Letter-wave label: each glyph is stacked twice and rolls on hover (see .lw in globals.css). */
export default function WaveLabel({ text }: { text: string }) {
  return (
    <span className="wv" aria-hidden="true">
      {Array.from(text).map((ch, i) =>
        ch === " " ? (
          <span key={i} className="lw sp">&nbsp;</span>
        ) : (
          <span key={i} className="lw" style={{ "--i": i } as CSSProperties}>
            <span>{ch}</span>
            <span>{ch}</span>
          </span>
        ),
      )}
    </span>
  );
}
