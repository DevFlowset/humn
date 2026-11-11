"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { makeTilt } from "@/lib/interactions";

const tilt = makeTilt();

export default function Phone() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = <T extends Element = HTMLElement>(s: string) => el.querySelector<T>(s);
    const msgs = Array.from(el.querySelectorAll<HTMLElement>(".feed > .m")).filter((n) => !n.classList.contains("tpm"));
    const st = q(".ph-st"), tp = q(".tpm"), isl = q(".isl"), cp = q(".cpin"), txt = q(".cptext");
    const meta = q(".meta"), btn = q(".lg"), feed = q(".feed"), pc = q(".pc"), mc = q(".mc");
    if (!tp || !isl || !cp || !txt || !meta || !btn || !feed || !pc || !mc) return;
    const m = (n: number) => q(".m" + n);
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let timers: number[] = [];
    let live = false;
    const at = (ms: number, fn: () => void) => { timers.push(window.setTimeout(fn, ms)); };
    const clear = () => { timers.forEach(clearTimeout); timers = []; };
    const typing = (on: boolean) => { tp.classList.toggle("in", on); isl.classList.toggle("is-wave", on); };
    const say = (ms: number, n: number, wait: number) => {
      at(ms, () => typing(true));
      at(ms + wait, () => { typing(false); m(n)?.classList.add("in"); });
    };
    const typeIn = (ms: number, text: string, n: number) => {
      const per = 48, end = ms + 200 + text.length * per;
      at(ms, () => cp.classList.add("typing"));
      for (let i = 1; i <= text.length; i++) {
        at(ms + 200 + i * per, () => { txt.textContent = text.slice(0, i); cp.classList.add("has"); });
      }
      at(end + 450, () => cp.classList.add("sent"));
      at(end + 620, () => {
        cp.classList.remove("has", "sent", "typing");
        txt.textContent = "";
        m(n)?.classList.add("in");
      });
    };
    const reset = () => {
      msgs.forEach((n) => n.classList.remove("in"));
      tp.classList.remove("in"); pc.classList.remove("on"); mc.classList.remove("on");
      btn.classList.remove("done", "press", "tap");
      isl.classList.remove("is-wave", "is-done");
      st?.classList.remove("hide");
      cp.classList.remove("has", "sent", "typing");
      txt.textContent = "";
      meta.textContent = "Delivered";
    };
    const play = () => {
      reset();
      say(700, 1, 1000);
      say(2500, 2, 1100);
      typeIn(4900, "Done. Feeling looser.", 3);
      at(7800, () => { meta.textContent = "Read"; });
      say(7400, 4, 1000);
      at(8600, () => pc.classList.add("on"));
      typeIn(11000, "What should I eat for lunch?", 5);
      say(14000, 6, 1000);
      at(16300, () => m(7)?.classList.add("in"));
      at(16700, () => mc.classList.add("on"));
      at(19800, () => btn.classList.add("tap", "press"));
      at(20000, () => btn.classList.remove("press"));
      at(20050, () => btn.classList.add("done"));
      at(20300, () => { st?.classList.add("hide"); isl.classList.add("is-done"); });
      at(23800, () => { isl.classList.remove("is-done"); st?.classList.remove("hide"); });
      at(25400, () => feed.classList.add("is-out"));
      at(25900, reset);
      at(26100, () => feed.classList.remove("is-out"));
      at(26300, () => { timers = []; play(); });
    };

    if (calm) {
      msgs.forEach((n) => n.classList.add("in"));
      pc.classList.add("on"); mc.classList.add("on"); btn.classList.add("done");
      meta.textContent = "Read";
      return;
    }
    const io = new IntersectionObserver((es) => {
      const v = es[es.length - 1].isIntersecting;
      if (v && !live) { live = true; at(1300, play); }
      else if (!v && live) { live = false; clear(); feed.classList.remove("is-out"); reset(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => { io.disconnect(); clear(); };
  }, []);

  return (
      <div className="stage">
      <div className="ph-wrap" ref={root}>
      <div className="ph-rise"><div className="ph-float">
      <div className="ph-tilt" onPointerEnter={tilt} onPointerMove={tilt} onPointerLeave={tilt}>
      <div className="phone hn-ui" role="img" aria-label="HUMN app in dark mode: a coach chat with a posture score and a lunch suggestion">
      <i className="ph-btn l1"></i><i className="ph-btn l2"></i><i className="ph-btn l3"></i><i className="ph-btn r1"></i>
      <div className="ph-bz"><div className="ph-sc">
      <div className="ph-st"><span className="st-t">9:41</span><span className="st-r">
      <svg viewBox="0 0 18 12" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx=".8"></rect><rect x="5" y="5.5" width="3" height="6.5" rx=".8"></rect><rect x="10" y="3" width="3" height="9" rx=".8"></rect><rect x="15" y="0" width="3" height="12" rx=".8"></rect></svg>
      <svg viewBox="0 0 16 12" aria-hidden="true"><path d="M8 11.6l1.9-2a2.7 2.7 0 0 0-3.8 0zM3.9 7.4l1.2 1.3a4.9 4.9 0 0 1 5.8 0l1.2-1.3a6.7 6.7 0 0 0-8.2 0zM.8 4.2l1.2 1.3a9.3 9.3 0 0 1 12 0l1.2-1.3a11.2 11.2 0 0 0-14.4 0z"></path></svg>
      <svg viewBox="0 0 27 13" aria-hidden="true"><rect className="bo" x=".5" y=".5" width="22" height="12" rx="3.6"></rect><rect x="2" y="2" width="19" height="9" rx="2.2"></rect><path d="M24 4.5v4c.8-.3 1.5-1.1 1.5-2s-.7-1.7-1.5-2z" opacity=".45"></path></svg>
      </span></div>
      <div className="isl"><span className="iw"><i className="iv"></i><span className="bars"><i></i><i></i><i></i><i></i></span></span><span className="id"><svg className="ck2" viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7.4l3 3 6-6.4"></path></svg><span>Lunch logged</span><b>+32 g</b></span></div>
      <div className="ph-hd">
      <span className="hd-b"><svg className="ch" viewBox="0 0 10 16" aria-hidden="true"><path d="M8 1.5L2 8l6 6.5"></path></svg></span>
      <span className="hd-c"><span className="av"></span><span className="hd-n">HUMN</span><span className="hd-s"><i></i>Coach</span></span>
      <span className="hd-r">Day 12</span>
      </div>
      <div className="ph-feed feed">
      <div className="ts"><b>Today</b> 9:41 AM</div>
      <div className="m m1"><div className="mi"><div className="mx"><div className="bub">Morning. You have been sitting for 1h 50m.</div></div></div></div>
      <div className="m m2"><div className="mi"><div className="mx"><div className="bub">Stand up and roll your shoulders for one minute?</div></div></div></div>
      <div className="m m3 u"><div className="mi"><div className="mx"><div className="bub">Done. Feeling looser.</div><span className="meta">Delivered</span></div></div></div>
      <div className="m m4"><div className="mi"><div className="mx"><div className="card pc">
      <div className="pc-top">
      <div className="ring"><svg viewBox="0 0 36 36" aria-hidden="true"><circle className="rt" cx="18" cy="18" r="15.5"></circle><circle className="rg" cx="18" cy="18" r="15.5"></circle></svg><span className="sco"><b className="num"></b></span></div>
      <div className="pc-tx"><span className="pc-h">Posture today<em className="chip">+12</em></span><span className="pc-d">Neck tilt 22° to 9°</span><span className="pc-s">Best score since Monday</span></div>
      </div>
      <svg className="spark" viewBox="0 0 220 44" aria-hidden="true"><path className="sg" d="M0 43.5H220"></path><path className="sl" d="M0 34 C12 33 20 30 30 31 S50 36 62 30 S84 24 96 26 S120 20 132 17 S160 14 172 11 S200 8 218 6"></path><circle className="sh" cx="218" cy="6" r="3"></circle><circle className="sd" cx="218" cy="6" r="3"></circle></svg>
      <div className="pc-ax"><span>8 am</span><span>Now</span></div>
      </div></div></div></div>
      <div className="m m5 u"><div className="mi"><div className="mx"><div className="bub">What should I eat for lunch?</div></div></div></div>
      <div className="m m6"><div className="mi"><div className="mx"><div className="bub">You are 18 g short on protein today. This fits.</div></div></div></div>
      <div className="m m7"><div className="mi"><div className="mx"><div className="card mc">
      <div className="mc-top">
      <div className="bowl" aria-hidden="true"><i className="bw-leaf"></i><i className="bw-mound"></i><i className="bw-egg"><b></b></i><i className="bw-bowl"></i></div>
      <div className="mc-tx"><span className="mc-h">Lentil and egg bowl</span><span className="mc-d">Lunch, 540 kcal</span><em className="chip">32 g protein</em></div>
      </div>
      <div className="mac">
      <div className="mr" style={{ "--p": 0.8, "--k": 0 } as CSSProperties}><span>Protein</span><span className="tk"><i></i></span><b>32 g</b></div>
      <div className="mr" style={{ "--p": 0.55, "--k": 1 } as CSSProperties}><span>Fibre</span><span className="tk"><i></i></span><b>11 g</b></div>
      <div className="mr" style={{ "--p": 0.45, "--k": 2 } as CSSProperties}><span>Carbs</span><span className="tk"><i></i></span><b>48 g</b></div>
      </div>
      <div className="lg"><span className="tapdot"></span><span className="lg-a">Log lunch</span><span className="lg-b"><svg className="ck" viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7.4l3 3 6-6.4"></path></svg>Logged</span></div>
      </div></div></div></div>
      <div className="m tpm"><div className="mi"><div className="mx"><div className="bub tp" aria-hidden="true"><i></i><i></i><i></i></div></div></div></div>
      </div>
      <div className="ph-cp cpin">
      <span className="cp-plus"><svg className="pl" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1.5v9M1.5 6h9"></path></svg></span>
      <span className="cp-box"><span className="cp-ph">Message HUMN</span><span className="cp-t cptext"></span><span className="cp-mic"><svg className="mic" viewBox="0 0 12 14" aria-hidden="true"><rect x="3.8" y=".8" width="4.4" height="7.4" rx="2.2"></rect><path d="M1.6 6.8a4.4 4.4 0 0 0 8.8 0M6 11.2v2"></path></svg></span><span className="cp-send"><svg className="ar" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 10V2.2M2.6 5.4L6 2l3.4 3.4"></path></svg></span></span>
      </div>
      <div className="ph-hi"><i></i></div>
      <div className="ph-gl"></div>
      </div></div>
      </div>
      </div></div>
      <div className="ph-shadow"></div>
      </div>
      </div>
      </div>
  );
}
