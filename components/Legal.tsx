import Logo from "./Logo";
import Year from "./Year";

export type LegalSection = { h: string; body: React.ReactNode };

/** Short legal page shell: dark ember header, white reading column, quiet footer. */
export default function Legal({ kicker, title, updated, intro, sections }: { kicker: string; title: string; updated: string; intro: string; sections: LegalSection[] }) {
  return (
    <main className="lgl hn-ui">
      <header className="lgl-top">
        <div className="lgl-bar">
          <a href="/" className="lgl-home" aria-label="HUMN home">
            <Logo size={16} />
          </a>
          <a href="/" className="lgl-back">
            Back to HUMN
          </a>
        </div>
        <div className="lgl-hero">
          <p className="lgl-k">{kicker}</p>
          <h1 className="hn-display lgl-h">{title}</h1>
          <p className="lgl-u">Last updated {updated}</p>
        </div>
      </header>
      <article className="lgl-body">
        <p className="lgl-intro">{intro}</p>
        {sections.map((s, n) => (
          <section key={s.h} className="lgl-sec">
            <h2>
              <span className="hn-display">{String(n + 1).padStart(2, "0")}</span>
              {s.h}
            </h2>
            {s.body}
          </section>
        ))}
      </article>
      <footer className="lgl-ft">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <span>© <Year /> HUMN</span>
      </footer>
    </main>
  );
}
