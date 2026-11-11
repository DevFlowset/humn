import re, json, pathlib, sys
HERE = pathlib.Path(__file__).parent
LIGHT = '--light' in sys.argv
logo = (HERE/'logo.svg').read_text()
kit = (HERE/'kit.js').read_text()
rd = lambda n: (HERE/n).read_text()

def word(txt, base=0):
    out = []
    for i, ch in enumerate(txt):
        if ch == ' ':
            out.append('<span class="lw sp" aria-hidden="true">&nbsp;</span>')
        else:
            out.append(f'<span class="lw" style="--i:{i+base}" aria-hidden="true"><span>{ch}</span><span>{ch}</span></span>')
    return '<span class="wv" aria-hidden="true">' + ''.join(out) + '</span>'

links = [('posture','Posture'),('movement','Movement'),('coaching','Coaching'),('food','Food'),('faq','FAQ')]
nav_links = ''.join(f'<a class="nav-link" href="#{h}" aria-label="{t}">{word(t)}</a>\n' for h,t in links)
mag = 'onPointerEnter="{{mag}}" onPointerMove="{{mag}}" onPointerLeave="{{mag}}"'
join = word('Join the waitlist')
panel = ''.join(f'<a href="#{h}" style="--n: {i}" onClick="{{{{closeMenu}}}}"><span class="gl">{t}</span></a>\n' for i,(h,t) in enumerate(links))

html = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>HUMN hero {'light' if LIGHT else 'dark'}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&amp;family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300;1,6..72,400&amp;display=swap">
<style>
{rd('base.css')}
{rd('phone.css')}
{'' if LIGHT else rd('dark.css')}
a:focus-visible,button:focus-visible{{outline:2px solid #E58A86;outline-offset:3px}}
</style>
</helmet>
<div style="position: relative; width: 100%; min-height: 1470px; overflow: hidden; background: radial-gradient(120% 80% at 50% 120%, #AE3443 0%, #571522 42%, #19090E 78%)">
<canvas ref="{{{{view}}}}" role="img" aria-label="Slow red and rose light that bends around the pointer" style="position: absolute; inset: 0; display: block; width: 100%; height: 100%; touch-action: none"></canvas>

<div class="nav-wrap" onKeyDown="{{{{navKey}}}}" style="position: absolute; top: 16px; left: 0; right: 0; z-index: 5; padding: 0 16px; display: flex; justify-content: center; pointer-events: none">
<nav class="nav hn-ui drop" aria-label="Primary" style="pointer-events: auto; box-sizing: border-box; height: 52px; padding: 0 6px 0 24px; gap: 28px; border-radius: 999px; background: rgba(25,9,14,.5); border: 1px solid rgba(247,245,242,.14); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px)">
<a href="#top" aria-label="HUMN home" style="display: inline-flex; align-items: center; line-height: 0">{logo}</a>
<div class="nav-links">
{nav_links}</div>
<div class="nav-end"><a class="cta cta-sm" href="#waitlist" aria-label="Join the waitlist" {mag}>{join}</a>
<button class="nav-menu" type="button" aria-label="Menu" aria-expanded="{{{{menuOpen}}}}" aria-controls="nav-panel" onClick="{{{{toggleMenu}}}}"><i></i><i></i></button>
</div>
</nav>
<nav id="nav-panel" class="{{{{panelCls}}}}" aria-label="Mobile">
{panel}</nav>
</div>

<div id="top" style="position: relative; z-index: 2; box-sizing: border-box; padding: 150px 24px 0; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; text-align: center; pointer-events: none">
<h1 class="hn-serif rise" style="margin: 0; color: #F7F5F2; font-size: clamp(44px, 5vw, 72px); font-weight: 300; line-height: 1.02; letter-spacing: -0.02em; animation-delay: 120ms">
<span style="display: block">Feel at home</span>
<span style="display: block; font-style: italic; color: #E58A86">in your body.</span>
</h1>
<p class="hn-ui rise" style="margin: 30px 0 0; max-width: 450px; color: rgba(247,245,242,.76); font-size: 16px; font-weight: 400; line-height: 1.42; letter-spacing: -0.05em; text-wrap: balance; animation-delay: 180ms">HUMN reads your posture, plans your movement, coaches you every day and helps you eat well. One app, one calm routine.</p>
<form id="waitlist" class="rise" style="margin: 38px 0 0; width: 100%; max-width: 470px; pointer-events: auto; animation-delay: 240ms" onSubmit="{{{{submit}}}}">
<div class="form-row">
<label for="email" style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap">Email address</label>
<input id="email" class="field" type="email" required="required" autocomplete="email" placeholder="Your email">
<button class="cta" type="submit" aria-label="Join the waitlist" {mag}>{join}</button>
</div>
</form>
<p class="hn-ui rise" style="margin: 16px 0 0; color: rgba(247,245,242,.64); font-size: 13px; font-weight: 300; line-height: 1.4; letter-spacing: -.01em; animation-delay: 300ms">We email you once, when your spot opens.</p>
</div>
{rd('phone.html')}</div>
</x-dc>
'''
props = {"speed":{"editor":"range","min":0,"max":3,"step":0.01,"default":1,"section":"Motion"},"scale":{"editor":"range","min":0.5,"max":2,"step":0.01,"default":0.5,"section":"Look"},"grain":{"editor":"range","min":0,"max":0.15,"step":0.005,"default":0.08,"section":"Look"},"base":{"editor":"color","default":"#19090E","section":"Color"},"deep":{"editor":"color","default":"#571522","section":"Color"},"core":{"editor":"color","default":"#AE3443","section":"Color"},"highlight":{"editor":"color","default":"#E58A86","section":"Color"},"pointer":{"editor":"range","min":0,"max":1,"step":0.01,"default":0.1,"section":"Pointer"},"$preview":{"width":1440,"height":900}}
html += "<script type=\"text/x-dc\" data-dc-script data-props='" + json.dumps(props, separators=(',',':')) + "'>\n" + kit + rd('comp.js') + "</script>\n</body>\n</html>\n"
out = HERE.parent; name = 'hero-light.dc.html' if LIGHT else 'hero-dark.dc.html'
(out/name).write_text(html)
print(name, len(html))
