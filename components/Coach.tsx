"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import ChatPhone, { scriptDuration } from "./ChatPhone";
import { createAura } from "@/lib/aura";
import { palette } from "@/lib/palette";
import { watch } from "@/lib/reveal";
import { SCENARIOS, type Signal } from "@/lib/scripts";

const N = SCENARIOS.length;
const STEP = 360 / N;
const mod = (n: number) => ((n % N) + N) % N;

/* Hex mix for the shader, so "Tough love" heats the field instead of switching it. */
const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) =>
  "#" + rgb(a).map((v, i) => Math.round(v + (rgb(b)[i] - v) * t).toString(16).padStart(2, "0")).join("");

function Icon({ k }: { k: Signal["icon"] }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...p}>
      {k === "watch" && (
        <>
          <rect x="6" y="6" width="12" height="12" rx="3.5" />
          <path d="M9 6l.8-3h4.4L15 6M9 18l.8 3h4.4L15 18M12 9.5V12l1.6 1.2" />
        </>
      )}
      {k === "calendar" && (
        <>
          <rect x="4" y="5.5" width="16" height="14" rx="3" />
          <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4M8 14h3M13 14h3M8 17h3" />
        </>
      )}
      {k === "camera" && (
        <>
          <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H8l1.5-2h5L16 6h1.5A2.5 2.5 0 0 1 20 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5z" />
          <circle cx="12" cy="12.5" r="3.4" />
        </>
      )}
      {k === "scan" && <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M4 12h16" />}
      {k === "pin" && (
        <>
          <path d="M12 21s6.5-5.6 6.5-11a6.5 6.5 0 0 0-13 0c0 5.4 6.5 11 6.5 11z" />
          <circle cx="12" cy="10" r="2.4" />
        </>
      )}
    </svg>
  );
}

/**
 * "Your coach": a day dial. Six moments sit on a watch bezel around the phone.
 * The bezel fills like a timer while a chat plays, then turns to the next moment.
 * Drag the bezel, click a moment, or let it run. Tough love heats the field.
 */
export default function Coach() {
  const sec = useRef<HTMLElement>(null);
  const bg = useRef<HTMLCanvasElement>(null);
  const dial = useRef<HTMLDivElement>(null);
  const rot = useRef<HTMLDivElement>(null);
  const heat = useRef({ v: 0, to: 0 });
  const drag = useRef<{ a0: number; r0: number; last: number; t: number; vel: number; moved: boolean } | null>(null);

  const [k, setK] = useState(0); // unbounded turn index, so the dial always takes the short way round
  const [tough, setTough] = useState(false);
  const [auto, setAuto] = useState(true);
  const [dragging, setDragging] = useState(false);
  const i = mod(k);
  const s = SCENARIOS[i];
  const hasTough = !!s.tough;
  const isTough = tough && hasTough;
  const script = isTough && s.tough ? s.tough : s.script;
  const dur = scriptDuration(script);

  useEffect(() => {
    heat.current.to = isTough ? 1 : 0;
  }, [isTough]);

  useEffect(() => {
    const el = sec.current;
    if (!el) return;
    let last = performance.now();
    const aura = createAura(bg.current, () => {
      const now = performance.now();
      const h = heat.current;
      h.v += (h.to - h.v) * Math.min(1, ((now - last) / 1000) * 2.2);
      last = now;
      const p = palette();
      const t = h.v;
      const ht = el.clientHeight || 1200;
      return {
        speed: 0.8 + 0.9 * t,
        uScale: 1 - 0.15 * t,
        uGrain: 0.07,
        uBase: mix(p.base, mix(p.base, p.deep, 0.4), t),
        uDeep: mix(mix(p.base, p.deep, 0.6), p.deep, t),
        uCore: mix(p.deep, p.core, t),
        uHigh: mix(p.core, p.coreLt, t),
        uPull: 0.3 + 0.25 * t,
        uCalm: 1 - 260 / ht,
        uStretch: ht / 900,
      };
    });
    const off = watch(el, el, "cgo", 0.2);
    return () => {
      aura.stop();
      off();
    };
  }, []);

  const go = (n: number) => {
    setAuto(false);
    let d = mod(n - i);
    if (d > N / 2) d -= N;
    setK((x) => x + d);
  };

  /* Bezel drag: 1:1 while held, snap with release velocity. */
  const angle = (e: PointerEvent) => {
    const r = dial.current!.getBoundingClientRect();
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
  };
  const setRot = (deg: number) => {
    const el = rot.current;
    if (!el) return;
    el.style.transform = `rotate(${deg}deg)`;
    el.style.setProperty("--kcr", `${deg}deg`);
  };
  const down = (e: PointerEvent<HTMLDivElement>) => {
    const r = dial.current!.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    if (Math.hypot(dx, dy) < r.width * 0.36) return; // phone area stays the phone's
    if ((e.target as HTMLElement).closest("button")) return; // a node click is a click
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { a0: angle(e), r0: -k * STEP, last: angle(e), t: performance.now(), vel: 0, moved: false };
    setDragging(true);
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const a = angle(e), now = performance.now();
    let da = a - d.last;
    if (da > 180) da -= 360;
    if (da < -180) da += 360;
    d.vel = da / Math.max(1, now - d.t);
    d.last = a;
    d.t = now;
    d.r0 += da;
    if (Math.abs(d.r0 + k * STEP) > 2) d.moved = true;
    setRot(d.r0);
  };
  const up = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    setDragging(false);
    if (!d.moved) {
      setRot(-k * STEP);
      return;
    }
    const proj = d.r0 + d.vel * 180; // fling carries a little further
    const nk = Math.round(-proj / STEP);
    setAuto(false);
    setRot(-nk * STEP);
    setK(nk);
  };

  useEffect(() => {
    if (!dragging) setRot(-k * STEP);
  }, [k, dragging]);

  return (
    <section id="coach" ref={sec} className="kc hn-ui" data-tough={isTough ? "true" : undefined} style={{ "--dur": `${dur}ms` } as CSSProperties} aria-labelledby="kc-h">
      <canvas ref={bg} className="kc-bg" aria-hidden="true" />
      <div className="kc-top">
        <p className="kc-k">Your coach</p>
        <h2 id="kc-h" className="hn-display kc-h">
          One coach.
          <br />
          <em>Any time, any day.</em>
        </h2>
        <p className="kc-p">HUMN reads your watch, your calendar and how you feel, then picks the right move. Warm when you need it. Tough when you ask for it.</p>
      </div>

      <div className="kc-stage">
        {/* Signal in: what HUMN noticed */}
        <div className="kc-side kc-l">
          <div key={s.id} className="kc-sig">
            <span className="kc-sig-i">
              <Icon k={s.signal.icon} />
            </span>
            <span className="kc-sig-s">{s.signal.source}</span>
            <b className="hn-display">{s.signal.lines[0]}</b>
            <small>{s.signal.lines[1]}</small>
            <svg className="kc-wire" aria-hidden="true">
              <path d="M0 4H1200" />
              <circle r="3" cy="4" />
            </svg>
          </div>
        </div>

        {/* The dial */}
        <div
          className={"kc-dial" + (dragging ? " is-drag" : "")}
          ref={dial}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
        >
          <svg className="kc-bezel" viewBox="0 0 760 760" aria-hidden="true">
            {Array.from({ length: 72 }, (_, n) => {
              if (n % 12 === 0) return null; // moments sit here
              const a = (n * 5 * Math.PI) / 180, mid = n % 6 === 0;
              const r1 = mid ? 338 : 342, r2 = 350;
              return <line key={n} className={mid ? "tk mid" : "tk"} x1={380 + r1 * Math.sin(a)} y1={380 - r1 * Math.cos(a)} x2={380 + r2 * Math.sin(a)} y2={380 - r2 * Math.cos(a)} />;
            })}
            <circle className="kc-track" cx="380" cy="380" r="362" />
            <circle
              key={s.id + (isTough ? "t" : "") + k}
              className="kc-prog"
              cx="380"
              cy="380"
              r="362"
              style={{ "--dur": `${dur}ms`, "--seg": `${(2 * Math.PI * 362) / N}` } as CSSProperties}
            />
          </svg>

          <div className="kc-disc" aria-hidden="true" />
          <div
            className="kc-rot"
            ref={rot}
            role="tablist"
            aria-label="Moments in a day"
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              const n = mod(i + (e.key === "ArrowRight" ? 1 : -1));
              go(n);
              (e.currentTarget.children[n] as HTMLElement | undefined)?.focus();
            }}
          >
            {SCENARIOS.map((x, n) => {
              const sa = mod(n - k) * STEP; // where this moment sits on screen, after the turn
              const side = sa === 0 ? "t" : sa === 180 ? "b" : sa < 180 ? "r" : "l";
              return (
              <button
                key={x.id}
                type="button"
                role="tab"
                aria-selected={n === i}
                tabIndex={n === i ? 0 : -1}
                className={"kc-node is-" + side}
                style={{ "--kca": `${n * STEP}deg`, "--kci": n } as CSSProperties}
                onClick={() => go(n)}
              >
                <span className="kc-node-in">
                  <i className="kc-dot" />
                  <span className="kc-lab">
                    <span className="hn-display">{x.time}</span>
                    <b>{x.title}</b>
                  </span>
                </span>
              </button>
              );
            })}
          </div>

          <div className="kc-phone">
            <ChatPhone
              script={script}
              runKey={s.id + (isTough ? "-t" : "") + k}
              badge={isTough ? "Tough love" : s.mode}
              label={`HUMN coach chat: ${s.title}`}
              onDone={() => {
                if (auto) setK((x) => x + 1);
              }}
            />
          </div>
        </div>

        {/* Coach mode */}
        <div className="kc-side kc-r">
          <span className="kc-tl">Coach mode</span>
          <div className={"kc-mode" + (hasTough ? "" : " is-fixed")}>
            {hasTough ? (
              <div className="seg" role="group" aria-label="Coach mode">
                <button type="button" aria-pressed={!isTough} onClick={() => { setAuto(false); setTough(false); }}>
                  Supportive
                </button>
                <button type="button" aria-pressed={isTough} onClick={() => { setAuto(false); setTough(true); }}>
                  Tough love
                </button>
                <i className="seg-k" style={{ transform: isTough ? "translateX(100%)" : "none" }} aria-hidden="true" />
              </div>
            ) : (
              <em className="kc-chip">{s.mode}</em>
            )}
          </div>
          <span className="kc-heat" aria-hidden="true">
            <i style={{ transform: `scaleX(${isTough ? 1 : hasTough ? 0.45 : 0.3})` }} />
          </span>
          <p className="kc-hint">{auto ? "Playing a day. Drag the dial or pick a moment." : "Drag the dial to change the moment."}</p>
        </div>
      </div>
    </section>
  );
}
