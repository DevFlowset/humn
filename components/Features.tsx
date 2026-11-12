"use client";

import { useEffect, useRef, useState } from "react";
import PhoneFrame from "./PhoneFrame";
import { FoodScreen, MovementScreen, PostureScreen, VoiceScreen } from "./FeatureScreens";

const ITEMS = [
  {
    id: "posture",
    title: "See how you stand.",
    body: "Take a photo scan from the front and side. HUMN maps your shoulders, spine and hips, then tells you in plain words what’s off and what to do about it.",
    label: "HUMN posture scan: head sits 12 degrees forward, score 86",
    Screen: PostureScreen,
  },
  {
    id: "movement",
    title: "Move in small pieces.",
    body: "A routine built around your day: desk breaks, mobility, strength. Every session is short, so it fits between meetings, not after them.",
    label: "HUMN movement plan: three short moves for today",
    Screen: MovementScreen,
  },
  {
    id: "coaching",
    title: "Talk to a coach that knows you.",
    body: "Ask out loud and get answers in real time. Pick a voice assistant for posture, mobility or food, or build your own. Each one knows your scan, your plan and your week.",
    label: "HUMN voice coach: mobility assistant answering a question",
    Screen: VoiceScreen,
  },
  {
    id: "food",
    title: "Photograph lunch. Know what’s missing.",
    body: "Snap a meal and HUMN logs it, then shows protein, fibre and what to add at your next one.",
    label: "HUMN meal log: salmon rice bowl with protein, fibre and carbs",
    Screen: FoodScreen,
  },
];

/** Phone shown inside each block on narrow screens. */
function InlinePhone({ i }: { i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const { Screen, label } = ITEMS[i];
  return (
    <div className="fx-wrap fx-m" ref={ref}>
      <PhoneFrame label={label}>
        <Screen on={on} />
      </PhoneFrame>
    </div>
  );
}

export default function Features() {
  const [active, setActive] = useState(0);
  const blocks = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    blocks.current.forEach((b) => b && io.observe(b));
    return () => io.disconnect();
  }, []);

  return (
    <section className="feat" id="features" aria-label="What HUMN does">
      <div className="feat-grid">
        <div className="feat-copy">
          {ITEMS.map((it, i) => (
            <article
              key={it.id}
              id={it.id}
              ref={(el) => {
                blocks.current[i] = el;
              }}
              data-i={i}
              className={"feat-block" + (active === i ? " is-on" : "")}
            >
              <h2 className="hn-serif feat-h">{it.title}</h2>
              <p className="hn-ui feat-p">{it.body}</p>
              <InlinePhone i={i} />
            </article>
          ))}
        </div>
        <div className="feat-stage">
          <div className="feat-pin">
            <div className="fx-wrap">
              <PhoneFrame label={ITEMS[active].label}>
                {ITEMS.map((it, i) => (
                  <it.Screen key={it.id} on={active === i} />
                ))}
              </PhoneFrame>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
