"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import WaveLabel from "./WaveLabel";
import Logo from "./Logo";
import { createAura } from "@/lib/aura";
import { mag } from "@/lib/interactions";
import { watch } from "@/lib/reveal";
import { fieldColors } from "@/lib/palette";

type FormState = "idle" | "loading" | "success" | "error";

const NOTE: Record<FormState, string> = {
  idle: "No spam. Leave any time.",
  loading: "Saving your spot…",
  success: "You're on the list. We email you once, when your spot opens.",
  error: "Something went wrong. Check your email and try again.",
};

/** Closing call to action on a dark Aura field, plus the footer and the cropped wordmark. Plays once. */
export default function Close() {
  const cl = useRef<HTMLElement>(null);
  const bg = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<FormState>("idle");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const el = cl.current;
    if (!el) return;
    const aura = createAura(bg.current, () => {
      const h = el.clientHeight || 1100;
      return { speed: 1, uScale: 1, uGrain: 0.07, ...fieldColors(), uPull: 0.3, uCalm: 1 - 520 / h, uStretch: h / 900 };
    });
    const off = watch(el, el, "cgo", 0.3);
    return () => {
      aura.stop();
      off();
    };
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("success");
      setEmail("");
    } catch {
      setState("error");
    }
  };

  return (
    <section className="cl hn-ui" ref={cl} aria-labelledby="cl-h">{" "}<canvas className="cl-bg" ref={bg} aria-hidden="true"></canvas>{" "}<div className="cl-in">{" "}<h2 id="cl-h" className="hn-serif cl-h"><span className="cl-l" style={{"--i":"0"} as CSSProperties}>Be first to install</span><span className="cl-l tv-it" style={{"--i":"1"} as CSSProperties}>v2.0 of you.</span></h2>{" "}<p className="cl-p">Join the waitlist. We’ll email you once, when it’s your turn.</p>{" "}<form className="cl-form" onSubmit={submit}>
              <div className="form-row">
                <label className="sr-only" htmlFor="cl-email">
                  Email address
                </label>
                <input
                  id="cl-email"
                  className="field"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (state === "error" || state === "success") setState("idle");
                  }}
                  aria-describedby="cl-note"
                />
                <button
                  className="cta"
                  type="submit"
                  aria-label="Join the waitlist"
                  disabled={state === "loading"}
                  onPointerEnter={mag}
                  onPointerMove={mag}
                  onPointerLeave={mag}
                >
                  <WaveLabel text="Join the waitlist" />
                </button>
              </div>
            </form>{" "}<p id="cl-note" className="cl-note" data-state={state} role="status" aria-live="polite">{NOTE[state]}</p>{" "}</div>{" "}<footer className="ft"><div className="ft-in">{" "}<a className="ft-logo" href="#top" aria-label="HUMN home"><Logo /></a>{" "}<nav className="ft-nav" aria-label="Footer"><a href="#posture">Posture</a><a href="#movement">Movement</a><a href="#coaching">Coaching</a><a href="#food">Food</a></nav>{" "}<p className="ft-legal"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><span>© 2026 HUMN</span></p>{" "}</div></footer>{" "}<div className="wm" aria-hidden="true"><span className="wm-t hn-display">HUMN</span></div>{" "}</section>
  );
}
