"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import ChatPhone from "./ChatPhone";
import { createAura } from "@/lib/aura";
import { orbColors } from "@/lib/palette";
import { watch } from "@/lib/reveal";
import { SCENARIOS } from "@/lib/scripts";

const FIELD = () => ({ speed: 0.5, uScale: 0.7, uGrain: 0.05, ...orbColors(), uPull: 0.22, uCalm: -4, uStretch: 1 });

/** Six real days with the coach. Pick one, or let them play in turn. Tough love where the client wrote it. */
export default function Coach() {
  const sec = useRef<HTMLElement>(null);
  const bg = useRef<HTMLCanvasElement>(null);
  const [i, setI] = useState(0);
  const [tough, setTough] = useState(false);
  const [auto, setAuto] = useState(true);
  const s = SCENARIOS[i];
  const hasTough = !!s.tough;
  const script = tough && s.tough ? s.tough : s.script;

  useEffect(() => {
    const el = sec.current;
    if (!el) return;
    const aura = createAura(bg.current, FIELD);
    const off = watch(el, el, "cgo", 0.25);
    return () => {
      aura.stop();
      off();
    };
  }, []);

  const pick = (n: number) => {
    setAuto(false);
    setI(n);
  };

  return (
    <section id="coach" ref={sec} className="kc hn-ui" aria-labelledby="kc-h">
      <div className="kc-in">
        <div className="kc-a">
          <p className="kc-k">Your coach</p>
          <h2 id="kc-h" className="hn-display kc-h">
            One coach.
            <br />
            <em>Every kind of day.</em>
          </h2>
          <p className="kc-p">HUMN reads your watch, your calendar and how you feel, then picks the right move. Warm when you need it. Tough when you ask for it.</p>

          <ol className="kc-list" role="tablist" aria-label="Scenarios">
            {SCENARIOS.map((x, n) => (
              <li key={x.id} style={{ "--k": n } as CSSProperties}>
                <button type="button" role="tab" aria-selected={n === i} className="kc-item" onClick={() => pick(n)}>
                  <span className="kc-n hn-display">{String(n + 1).padStart(2, "0")}</span>
                  <span className="kc-t">
                    <b>{x.title}</b>
                    <small>{x.trigger}</small>
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="kc-tone">
            <span className="kc-tl">Coach mode</span>
            {hasTough ? (
              <div className="seg" role="group" aria-label="Coach mode">
                <button type="button" aria-pressed={!tough} onClick={() => { setAuto(false); setTough(false); }}>
                  Supportive
                </button>
                <button type="button" aria-pressed={tough} onClick={() => { setAuto(false); setTough(true); }}>
                  Tough love
                </button>
                <i className="seg-k" style={{ transform: tough ? "translateX(100%)" : "none" }} aria-hidden="true" />
              </div>
            ) : (
              <em className="kc-mode">{s.mode}</em>
            )}
          </div>
        </div>

        <div className="kc-b">
          <canvas ref={bg} className="kc-bg" aria-hidden="true" />
          <ChatPhone
            script={script}
            runKey={s.id + (tough ? "-t" : "")}
            badge={s.mode}
            label={`HUMN coach chat: ${s.title}`}
            onDone={() => {
              if (auto) setI((n) => (n + 1) % SCENARIOS.length);
            }}
          />
        </div>
      </div>
    </section>
  );
}
