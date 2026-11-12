import type { CSSProperties } from "react";

type P = { on: boolean };
const cls = (on: boolean, extra: string) => `fs ${extra}${on ? " on" : ""}`;

export function PostureScreen({ on }: P) {
  return (
    <div className={cls(on, "fs-pos")}>
      <div className="fs-hd">
        <b>Posture scan</b>
        <em className="fs-chip">Side view</em>
      </div>
      <div className="fx-view">
        <svg viewBox="30 0 140 230" aria-hidden="true">
          <line className="fx-plumb" x1="90" y1="6" x2="90" y2="224" />
          <path className="fx-body" d="M104 62 C100 78 98 92 94 110 C92 128 91 140 92 152" />
          <path className="fx-body fx-legs" d="M92 152 L94 222" />
          <circle className="fx-head" cx="112" cy="40" r="19" />
          <polyline className="fx-line" points="112,42 100,90 92,152" pathLength={1} />
          <line className="fx-gap" x1="90" y1="42" x2="112" y2="42" />
          <circle className="fx-dot d1" cx="112" cy="42" r="4.4" />
          <circle className="fx-dot d2" cx="100" cy="90" r="4.4" />
          <circle className="fx-dot d3" cx="92" cy="152" r="4.4" />
          <text className="fx-deg" x="122" y="30">12°</text>
        </svg>
        <i className="fx-scan"></i>
        <i className="fx-c tl"></i><i className="fx-c tr"></i><i className="fx-c bl"></i><i className="fx-c br"></i>
      </div>
      <div className="fx-res">
        <div className="fx-ring">
          <svg viewBox="0 0 36 36" aria-hidden="true"><circle className="rt" cx="18" cy="18" r="15.5" /><circle className="rg" cx="18" cy="18" r="15.5" /></svg>
          <span className="fx-num"></span>
        </div>
        <ul className="fx-find">
          <li><i></i>Head sits 12° forward</li>
          <li><i></i>Left shoulder 1.5 cm lower</li>
          <li><i className="ok"></i>Hips level</li>
        </ul>
      </div>
      <div className="fx-btn">See your fixes</div>
    </div>
  );
}

const MOVES = [
  { t: "Neck release", d: "2 min", s: "done" },
  { t: "Hip opener", d: "3 min", s: "now" },
  { t: "Wall angels", d: "4 min", s: "next" },
  { t: "Evening stretch", d: "4 min", s: "later" },
];

export function MovementScreen({ on }: P) {
  return (
    <div className={cls(on, "fs-mov")}>
      <div className="fs-hd">
        <b>Today</b>
        <em className="fs-chip">13 min</em>
      </div>
      <p className="fx-sub">Fits the gap before your 3 pm call.</p>
      <div className="fx-segs" aria-hidden="true"><i className="a"></i><i className="b"></i><i></i><i></i></div>
      <ul className="fx-moves">
        {MOVES.map((m, i) => (
          <li key={m.t} className={`fx-move ${m.s}`} style={{ "--k": i } as CSSProperties}>
            <span className="fx-mi">
              {m.s === "done" ? (
                <svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7.4l3 3 6-6.4" /></svg>
              ) : (
                <svg viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="3.2" r="1.7" /><path d="M7 5.4v3.6M4 7.2h6M5.4 13l1.6-4 1.6 4" /></svg>
              )}
            </span>
            <span className="fx-mt"><b>{m.t}</b><small>{m.d}</small></span>
            {m.s === "now" ? <span className="fx-pg"><i></i></span> : null}
          </li>
        ))}
      </ul>
      <div className="fx-btn">Start next move</div>
    </div>
  );
}

const AGENTS = ["Posture", "Mobility", "Food"];

export function VoiceScreen({ on }: P) {
  return (
    <div className={cls(on, "fs-voi")}>
      <div className="fx-ag">
        {AGENTS.map((a) => (
          <span key={a} className={a === "Mobility" ? "on" : ""}>{a}</span>
        ))}
        <span className="add">+ New</span>
      </div>
      <div className="fx-orb" aria-hidden="true">
        <i className="r1"></i><i className="r2"></i><i className="r3"></i><b></b>
      </div>
      <p className="fx-who">Mobility coach</p>
      <div className="fx-say">
        <p className="u">My hips are tight after sitting.</p>
        <p className="a">Stand up. Hands on hips, circle slowly. Ten seconds each way, then tell me how it feels.</p>
      </div>
      <div className="fx-wave" aria-hidden="true">
        {Array.from({ length: 15 }, (_, i) => <i key={i} style={{ "--i": i } as CSSProperties}></i>)}
      </div>
      <div className="fx-vc">
        <span className="mute" aria-hidden="true"><svg viewBox="0 0 12 14"><rect x="3.8" y=".8" width="4.4" height="7.4" rx="2.2" /><path d="M1.6 6.8a4.4 4.4 0 0 0 8.8 0M6 11.2v2" /></svg></span>
        <span className="end">End</span>
      </div>
    </div>
  );
}

export function FoodScreen({ on }: P) {
  return (
    <div className={cls(on, "fs-food")}>
      <div className="fx-cam">
        <svg viewBox="0 0 200 150" aria-hidden="true">
          <ellipse cx="100" cy="128" rx="70" ry="9" fill="rgba(0,0,0,.35)" />
          <circle cx="100" cy="76" r="58" fill="#e9e3dc" />
          <circle cx="100" cy="76" r="48" fill="#f7f5f2" />
          <path d="M62 80 C66 58 94 50 112 58 C128 66 134 88 118 100 C100 112 66 104 62 80Z" fill="#f0e6d2" />
          <path d="M70 70 C76 58 96 56 108 62 C100 70 82 76 70 70Z" fill="#e8806f" />
          <path d="M108 62 C124 64 130 80 120 92 C112 84 108 74 108 62Z" fill="#cf5e52" />
          <path d="M120 58 C132 52 148 62 142 76 C134 74 124 70 120 58Z" fill="#6f9a52" />
          <path d="M60 96 C52 86 58 72 70 72 C70 84 68 92 60 96Z" fill="#88b062" />
          <circle cx="92" cy="94" r="7" fill="#f4c542" />
        </svg>
        <i className="fx-c tl"></i><i className="fx-c tr"></i><i className="fx-c bl"></i><i className="fx-c br"></i>
        <i className="fx-sweep"></i>
        <span className="fx-tag t1">Salmon</span>
        <span className="fx-tag t2">Rice</span>
        <span className="fx-tag t3">Greens</span>
      </div>
      <div className="fx-meal">
        <b>Salmon rice bowl</b>
        <small>Lunch, 610 kcal</small>
      </div>
      <div className="fx-mac">
        {[
          ["Protein", 0.8, "38 g"],
          ["Fibre", 0.32, "6 g"],
          ["Carbs", 0.62, "62 g"],
        ].map(([n, p, v], i) => (
          <div key={n as string} className="fx-mr" style={{ "--p": p, "--k": i } as CSSProperties}>
            <span>{n}</span><span className="tk"><i></i></span><b>{v}</b>
          </div>
        ))}
      </div>
      <p className="fx-tip">Add beans or greens at dinner for +5 g fibre.</p>
      <div className="fx-btn">Log meal</div>
    </div>
  );
}
