"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { makeTilt } from "@/lib/interactions";
import type { Card, Step } from "@/lib/scripts";

const tilt = makeTilt();
const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

type Item =
  | { id: number; k: "coach"; text: string; replies?: string[]; tag?: string }
  | { id: number; k: "you"; text: string }
  | { id: number; k: "note"; text: string }
  | { id: number; k: "card"; card: Card };

type Props = {
  script: Step[];
  /** Restart the script when this changes. */
  runKey?: string;
  loop?: boolean;
  /** Hero only: rise-in and idle float. */
  float?: boolean;
  badge?: string;
  label: string;
  onDone?: () => void;
};

/** Appears one frame after mount so the grid-rows + transform transition runs. */
function Row({ cls, children }: { cls: string; children: React.ReactNode }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setOn(true)));
    return () => cancelAnimationFrame(r);
  }, []);
  return (
    <div className={cls + (on ? " in" : "")}>
      <div className="mi">
        <div className="mx">{children}</div>
      </div>
    </div>
  );
}

function CardView({ card }: { card: Card }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), 380);
    return () => clearTimeout(t);
  }, []);
  if (card === "posture")
    return (
      <div className={"card pc" + (on ? " on" : "")}>
        <div className="pc-top">
          <div className="ring">
            <svg viewBox="0 0 36 36" aria-hidden="true">
              <circle className="rt" cx="18" cy="18" r="15.5"></circle>
              <circle className="rg" cx="18" cy="18" r="15.5"></circle>
            </svg>
            <span className="sco">
              <b className="num hn-display"></b>
            </span>
          </div>
          <div className="pc-tx">
            <span className="pc-h">Posture today</span>
            <span className="pc-d">Better than Monday</span>
          </div>
        </div>
      </div>
    );
  if (card === "form")
    return (
      <div className={"card xc xc-form" + (on ? " on" : "")}>
        <div className="xc-cam">
          <img src="/posture.webp" alt="" />
          <span className="xc-live">
            <i></i>Live
          </span>
          <span className="xc-line l"></span>
          <span className="xc-line r"></span>
        </div>
        <div className="xc-row">
          <span>Wall angels</span>
          <b className="hn-display">Rep 6 / 10</b>
        </div>
        <span className="xc-bar">
          <i style={{ "--p": 0.6 } as CSSProperties}></i>
        </span>
      </div>
    );
  if (card === "future")
    return (
      <div className={"card xc xc-fut" + (on ? " on" : "")}>
        <div className="xc-pair">
          <figure>
            <img src="/posture.webp" alt="" />
            <figcaption>Week 0</figcaption>
          </figure>
          <figure className="is-next">
            <img src="/posture.webp" alt="" />
            <figcaption>Future you</figcaption>
          </figure>
        </div>
        <div className="xc-row">
          <span>Goal date</span>
          <b className="hn-display">Moved up</b>
        </div>
      </div>
    );
  return (
    <div className={"card xc xc-room" + (on ? " on" : "")}>
      <div className="xc-row">
        <span>Room scan</span>
        <b className="hn-display">3 found</b>
      </div>
      <div className="xc-tags">
        {["Chair", "Towel", "Open floor"].map((t, i) => (
          <em key={t} className="chip" style={{ "--k": i } as CSSProperties}>
            {t}
          </em>
        ))}
      </div>
      <div className="xc-buddy">
        <span className="xc-av">S</span>
        <span>
          <b>Sam</b>
          <small>Free now · 2 km away</small>
        </span>
        <i className="xc-dot"></i>
      </div>
    </div>
  );
}

/** Phone mockup that plays a chat script: coach typing, your composer typing, cards, notes. */
export default function ChatPhone({ script, runKey = "", loop = false, float = false, badge = "Day 12", label, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [typing, setTyping] = useState(false);
  const [out, setOut] = useState(false);
  const [cp, setCp] = useState({ text: "", typing: false, sent: false });
  const done = useRef(onDone);
  useIso(() => {
    done.current = onDone;
  });

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timers: number[] = [];
    let id = 0;
    let live = false;
    const at = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, ms));
    };
    const clear = () => {
      timers.forEach(clearTimeout);
      timers = [];
    };
    const toItem = (s: Step): Item =>
      s.t === "coach" ? { id: id++, k: "coach", text: s.text, replies: s.replies, tag: s.tag } : s.t === "you" ? { id: id++, k: "you", text: s.text } : s.t === "note" ? { id: id++, k: "note", text: s.text } : { id: id++, k: "card", card: s.card };
    const push = (s: Step) => setItems((xs) => [...xs.slice(-9), toItem(s)]);
    const reset = () => {
      setItems([]);
      setTyping(false);
      setCp({ text: "", typing: false, sent: false });
    };

    const play = () => {
      reset();
      let t = 700;
      for (const s of script) {
        if (s.t === "coach") {
          const think = Math.min(1700, 650 + s.text.length * 9);
          at(t, () => setTyping(true));
          at(t + think, () => {
            setTyping(false);
            push(s);
          });
          t += think + Math.min(2600, 900 + s.text.length * 22) + (s.replies ? 900 : 0) + (s.tag ? 700 : 0);
        } else if (s.t === "you") {
          const per = 42;
          at(t, () => setCp({ text: "", typing: true, sent: false }));
          for (let i = 1; i <= s.text.length; i++) {
            const txt = s.text.slice(0, i);
            at(t + 220 + i * per, () => setCp({ text: txt, typing: true, sent: false }));
          }
          const end = t + 220 + s.text.length * per;
          at(end + 380, () => setCp((c) => ({ ...c, sent: true })));
          at(end + 560, () => {
            setCp({ text: "", typing: false, sent: false });
            push(s);
          });
          t = end + 560 + 1100;
        } else if (s.t === "note") {
          at(t, () => push(s));
          t += 1500;
        } else {
          at(t, () => push(s));
          t += 2600;
        }
      }
      at(t + 1600, () => {
        done.current?.();
        if (!loop) return;
        setOut(true);
        at(500, () => {
          reset();
          setOut(false);
          at(200, play);
        });
      });
    };

    if (calm) {
      // Final state, no motion.
      setItems(script.map(toItem).slice(-6));
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        const v = es[es.length - 1].isIntersecting;
        if (v && !live) {
          live = true;
          at(float ? 1300 : 200, play);
        } else if (!v && live) {
          live = false;
          clear();
          setOut(false);
          reset();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clear();
    };
  }, [script, runKey, loop, float]);

  const lastCoach = [...items].reverse().find((x) => x.k === "coach")?.id;
  const lastYou = [...items].reverse().find((x) => x.k === "you")?.id ?? -1;

  const phone = (
    <div className="ph-tilt" onPointerEnter={tilt} onPointerMove={tilt} onPointerLeave={tilt}>
      <div className="phone hn-ui" role="img" aria-label={label}>
      <i className="ph-btn l1"></i><i className="ph-btn l2"></i><i className="ph-btn l3"></i><i className="ph-btn r1"></i>
      <div className="ph-bz"><div className="ph-sc">
      <div className="ph-st"><span className="st-t">9:41</span><span className="st-r">
      <svg viewBox="0 0 18 12" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx=".8"></rect><rect x="5" y="5.5" width="3" height="6.5" rx=".8"></rect><rect x="10" y="3" width="3" height="9" rx=".8"></rect><rect x="15" y="0" width="3" height="12" rx=".8"></rect></svg>
      <svg viewBox="0 0 16 12" aria-hidden="true"><path d="M8 11.6l1.9-2a2.7 2.7 0 0 0-3.8 0zM3.9 7.4l1.2 1.3a4.9 4.9 0 0 1 5.8 0l1.2-1.3a6.7 6.7 0 0 0-8.2 0zM.8 4.2l1.2 1.3a9.3 9.3 0 0 1 12 0l1.2-1.3a11.2 11.2 0 0 0-14.4 0z"></path></svg>
      <svg viewBox="0 0 27 13" aria-hidden="true"><rect className="bo" x=".5" y=".5" width="22" height="12" rx="3.6"></rect><rect x="2" y="2" width="19" height="9" rx="2.2"></rect><path d="M24 4.5v4c.8-.3 1.5-1.1 1.5-2s-.7-1.7-1.5-2z" opacity=".45"></path></svg>
      </span></div>
      <div className={"isl" + (typing ? " is-wave" : "")}><span className="iw"><i className="iv"></i><span className="bars"><i></i><i></i><i></i><i></i></span></span><span className="id"><svg className="ck2" viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7.4l3 3 6-6.4"></path></svg><span>Lunch logged</span><b>+32 g</b></span></div>
      <div className="ph-hd">
      <span className="hd-b"><svg className="ch" viewBox="0 0 10 16" aria-hidden="true"><path d="M8 1.5L2 8l6 6.5"></path></svg></span>
      <span className="hd-c"><span className="av"></span><span className="hd-n">HUMN</span><span className="hd-s"><i></i>Coach</span></span>
      <span className="hd-r">{badge}</span>
      </div>
      <div className={"ph-feed feed" + (out ? " is-out" : "")}>
        <div className="ts"><b>Today</b> 9:41 AM</div>
        {items.map((x) =>
          x.k === "coach" ? (
            <Row key={x.id} cls="m">
              <div className="bub">{x.text}</div>
              {x.replies && (
                <div className={"qr" + (lastYou > x.id ? " is-used" : "")}>
                  {x.replies.map((r, i) => (
                    <span key={r} style={{ "--k": i } as CSSProperties}>{r}</span>
                  ))}
                </div>
              )}
              {x.tag && <em className="chip tag" style={{ "--k": 0 } as CSSProperties}>{x.tag}</em>}
            </Row>
          ) : x.k === "you" ? (
            <Row key={x.id} cls="m u">
              <div className="bub">{x.text}</div>
              {x.id === lastYou && <span className="meta">{(lastCoach ?? -1) > x.id || typing ? "Read" : "Delivered"}</span>}
            </Row>
          ) : x.k === "note" ? (
            <Row key={x.id} cls="m nt">
              <span className="note">{x.text}</span>
            </Row>
          ) : (
            <Row key={x.id} cls="m">
              <CardView card={x.card} />
            </Row>
          ),
        )}
        <div className={"m tpm" + (typing ? " in" : "")}>
          <div className="mi"><div className="mx"><div className="bub tp" aria-hidden="true"><i></i><i></i><i></i></div></div></div>
        </div>
      </div>
      <div className={"ph-cp cpin" + (cp.typing ? " typing" : "") + (cp.text ? " has" : "") + (cp.sent ? " sent" : "")}>
      <span className="cp-plus"><svg className="pl" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1.5v9M1.5 6h9"></path></svg></span>
      <span className="cp-box"><span className="cp-ph">Message HUMN</span><span className="cp-t cptext">{cp.text}</span><span className="cp-mic"><svg className="mic" viewBox="0 0 12 14" aria-hidden="true"><rect x="3.8" y=".8" width="4.4" height="7.4" rx="2.2"></rect><path d="M1.6 6.8a4.4 4.4 0 0 0 8.8 0M6 11.2v2"></path></svg></span><span className="cp-send"><svg className="ar" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 10V2.2M2.6 5.4L6 2l3.4 3.4"></path></svg></span></span>
      </div>
      <div className="ph-hi"><i></i></div>
      <div className="ph-gl"></div>
      </div></div>
      </div>
    </div>
  );

  return (
    <div className={"ph-wrap" + (float ? "" : " ph-static")} ref={root}>
      {float ? (
        <div className="ph-rise">
          <div className="ph-float">{phone}</div>
        </div>
      ) : (
        phone
      )}
      <div className="ph-shadow"></div>
    </div>
  );
}
