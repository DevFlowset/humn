"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent } from "react";
import Logo from "./Logo";
import Phone from "./Phone";
import WaveLabel from "./WaveLabel";
import { createAura } from "@/lib/aura";
import { mag } from "@/lib/interactions";

const LINKS = [
  { href: "#posture", label: "Posture" },
  { href: "#movement", label: "Movement" },
  { href: "#coaching", label: "Coaching" },
  { href: "#food", label: "Food" },
  { href: "#faq", label: "FAQ" },
];

type FormState = "idle" | "loading" | "success" | "error";

const NOTE: Record<FormState, string> = {
  idle: "We email you once, when your spot opens.",
  loading: "Saving your spot…",
  success: "You're on the list. We email you once, when your spot opens.",
  error: "Something went wrong. Check your email and try again.",
};

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [menu, setMenu] = useState(false);
  const [state, setState] = useState<FormState>("idle");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;
    const aura = createAura(canvas, () => {
      const h = root.clientHeight || 900;
      return {
        speed: 1,
        uScale: 1,
        uGrain: 0.07,
        uBase: "#19090E",
        uDeep: "#571522",
        uCore: "#AE3443",
        uHigh: "#E58A86",
        uPull: 0.3,
        uCalm: 1 - 340 / h,
        uStretch: h / 900,
      };
    });
    return () => aura.stop();
  }, []);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") setMenu(false);
  };

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
    <div className="hero-root" ref={rootRef}>
      <canvas
        ref={canvasRef}
        className="hero-canvas"
        role="img"
        aria-label="Slow red and rose light that bends around the pointer"
      />

      <div className="nav-wrap hero-nav-wrap" onKeyDown={onKey}>
        <nav className="nav hn-ui drop hero-nav" aria-label="Primary">
          <a href="#top" aria-label="HUMN home" style={{ display: "inline-flex", alignItems: "center", lineHeight: 0 }}>
            <Logo />
          </a>
          <div className="nav-links">
            {LINKS.map((l) => (
              <a key={l.href} className="nav-link" href={l.href} aria-label={l.label}>
                <WaveLabel text={l.label} />
              </a>
            ))}
          </div>
          <div className="nav-end">
            <a
              className="cta cta-sm"
              href="#waitlist"
              aria-label="Join the waitlist"
              onPointerEnter={mag}
              onPointerMove={mag}
              onPointerLeave={mag}
            >
              <WaveLabel text="Join the waitlist" />
            </a>
            <button
              className="nav-menu"
              type="button"
              aria-label="Menu"
              aria-expanded={menu}
              aria-controls="nav-panel"
              onClick={() => setMenu((v) => !v)}
            >
              <i></i>
              <i></i>
            </button>
          </div>
        </nav>
        <nav id="nav-panel" className={menu ? "nav-panel is-open" : "nav-panel"} aria-label="Mobile">
          {LINKS.map((l, i) => (
            <a key={l.href} href={l.href} style={{ "--n": i } as CSSProperties} onClick={() => setMenu(false)}>
              <span className="gl">{l.label}</span>
            </a>
          ))}
        </nav>
      </div>

      <div id="top" className="hero-top">
        <h1 className="hn-serif rise hero-h1">
          <span>Feel at home</span>
          <em>in your body.</em>
        </h1>
        <p className="hn-ui rise hero-p">
          HUMN reads your posture, plans your movement, coaches you every day and helps you eat well. One app, one
          calm routine.
        </p>
        <form id="waitlist" className="rise hero-form" onSubmit={submit} noValidate={false}>
          <div className="form-row">
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              className="field"
              type="email"
              required
              autoComplete="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state === "error" || state === "success") setState("idle");
              }}
              aria-describedby="waitlist-note"
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
        </form>
        <p id="waitlist-note" className="hn-ui rise hero-note" data-state={state} role="status" aria-live="polite">
          {NOTE[state]}
        </p>
      </div>

      <Phone />
    </div>
  );
}
