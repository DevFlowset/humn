# HUMN

Pre-launch site for HUMN, a wellness app for posture, movement, coaching and food. Next.js on Vercel is the planned stack. Work so far is design prototypes.

## Design prototypes

`design/hero/` holds the navbar + hero, built as Claude Design canvas files (`.dc.html`).

| File | What |
| --- | --- |
| `hero-dark.dc.html` | Main. Dark phone on space-black frame |
| `hero-light.dc.html` | Alt. Light (cream) phone on silver frame |
| `src/` | Source parts and `build.py`. Run `python3 design/hero/src/build.py` (add `--light` for the alt) |

The `.dc.html` files load `./support.js`, which the canvas runtime provides. They do not open standalone in a browser.

### Tokens

- Aura: `#19090E` base, `#571522` deep, `#AE3443` core, `#E58A86` highlight
- Light sections: cream `#F7F5F2`, ink `#19090E`
- Display: Kepler Std (Adobe kit `jjd4sjm`), Newsreader fallback in previews
- UI: Geist, tight tracking (-1.5% buttons, -1% nav, -2% input)
- Corners: 12px, pills for CTAs and chips
- Motion: entrance `cubic-bezier(0.625,0.05,0,1)`, hover `cubic-bezier(0.4,0,0.2,1)`, press scale 0.97, reduced motion respected

### Hero pieces

- WebGL2 Aura shader (domain-warped fbm, pointer pull default 0.1 to 0.3, grain)
- Waitlist button: orbit border + letter-wave label + magnetic lean, glass glaze on text
- Glass email field, glass mobile nav panel
- iPhone mockup (360px, sized in `em` from container width) with an animated coach chat: typing, composer typing, posture ring + sparkline, meal card, "Log lunch" tap, dynamic island states. Pointer tilt and idle float

## Next

App mosaic, zigzag features (Posture, Movement, Coaching, Food), FAQ, close, footer. Then port to Next.js on Vercel.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Deploy: import repo on Vercel, preset **Next.js**, root `./`, defaults.

## Env vars

| Name | Use |
| --- | --- |
| `WAITLIST_WEBHOOK_URL` | POST `{ email, source, at }` JSON on each signup. Unset: emails log to Vercel runtime logs only. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata (default `https://humn.app`). |

Kepler Std Display loads from Adobe Fonts kit `jjd4sjm`. Add the production domain to the kit's allowed domains.

## v2 (branch `feedback-v2`, client notes 2026-11-13)

- Palette: Ember (orange to peach, default) and Crimson (`#6B000C` / `#C4002A`). Tokens in `app/theme.css`, shader colours in `lib/palette.ts`. Preview with `?palette=crimson` or the toggle bottom left (review only, remove `<PaletteToggle />` before launch).
- Display font: Presicav slot. Michroma (OFL, `public/fonts`) stands in until the licensed Presicav webfont goes in `public/fonts` (see the commented `@font-face` in `app/theme.css`). Metrics use the display face.
- Copy: "Your body, updated." hero, feature taglines, "Be first to install v2.0 of you." close.
- Phone chats are scripts in `lib/scripts.ts`, played by `components/ChatPhone.tsx`. New `#coach` section: 6 scenarios, Supportive / Tough love where written.
