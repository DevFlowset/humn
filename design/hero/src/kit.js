/* Shader kit */
function shaderStage(logic, frag) {
var calm = matchMedia('(prefers-reduced-motion: reduce)');
var view, paint, buf, gl, uni, raf = 0, away = 0, shown = true, broken = false, fresh = true, before = '', tints = {};
var time = 12, clock = 0, last = 0, down = false, inside = false, press = 0;
var level = 0, ticks = 0, due = 0, next = 0, wait = 2, sharp = 1.5;
var aim = [0.5, 0.5], mouse = [0.5, 0.5], trail = [], oops = 'This shader has an error. Ask Claude to fix it. ';
function fail(text) { broken = true; halt(); sleep(); logic.error = text; logic.setState({}); }
function part(kind, code) {
  var s = gl.createShader(kind);
  if (!s) return;
  gl.shaderSource(s, code); gl.compileShader(s);
  if (gl.getShaderParameter(s, gl.COMPILE_STATUS) || gl.isContextLost()) return s;
  var log = gl.getShaderInfoLog(s) || '', m = /ERROR: \d+:(\d+): (.*)/.exec(log);
  fail(oops + (m ? 'Shader line ' + m[1] + ': ' + m[2] : log));
}
function wake() {
  if (gl && gl.isContextLost()) gl = null;
  if (gl || broken) return !!gl;
  buf = document.createElement('canvas');
  gl = buf.getContext('webgl2', { alpha: false, antialias: false });
  if (!gl) {
    broken = !uni;
    if (broken) view.title = 'This browser can’t draw shaders. You can turn on hardware acceleration or try another browser.';
    return false;
  }
  var v = part(gl.VERTEX_SHADER, '#version 300 es\nvoid main(){vec2 p=vec2(gl_VertexID<<1&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.);}');
  var f = v && part(gl.FRAGMENT_SHADER, '#version 300 es\nprecision highp float;\nout vec4 outColor;\n#line 1\n' + frag);
  if (!f) return false;
  var prog = gl.createProgram();
  if (!prog) return false;
  gl.attachShader(prog, v); gl.attachShader(prog, f); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS) && !gl.isContextLost()) { fail(oops + gl.getProgramInfoLog(prog)); return false; }
  gl.useProgram(prog);
  uni = {};
  for (var i = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS) - 1; i >= 0; i--) {
    var a = gl.getActiveUniform(prog, i);
    uni[a.name.replace('[0]', '')] = { at: gl.getUniformLocation(prog, a.name), type: a.type };
  }
  fresh = true;
  return true;
}
function sleep() {
  var x = gl && gl.getExtension('WEBGL_lose_context');
  gl = null; if (x) x.loseContext();
}
function tint(color) {
  if (!tints[color]) {
    var g = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    g.fillStyle = color; g.fillRect(0, 0, 1, 1);
    tints[color] = Array.from(g.getImageData(0, 0, 1, 1).data.slice(0, 3), (n) => n / 255);
  }
  return tints[color];
}
function put(name, v) {
  var u = uni[name];
  if (!u) return;
  if (typeof v === 'string') v = tint(v);
  if (u.type === gl.FLOAT) gl.uniform1f(u.at, v);
  else if (u.type === gl.INT || u.type === gl.BOOL) gl.uniform1i(u.at, +v);
  else if (u.type === gl.FLOAT_VEC2) gl.uniform2fv(u.at, v);
  else if (u.type === gl.FLOAT_VEC3) gl.uniform3fv(u.at, v);
}
function draw(now) {
  var dt = Math.min(0.2, (now - last) / 1000), vals = logic.uniforms(), still = calm.matches, text = JSON.stringify(vals), rate = vals.speed == null ? 1 : vals.speed;
  last = now; clock += dt * rate;
  if (!still) time += dt * rate;
  if (!inside && !still) {
    aim = [0.5 + 0.3 * Math.sin(time * 0.37), 0.5 + 0.24 * Math.sin(time * 0.53 + 1.1)];
    drop(false);
  }
  var x = mouse[0], y = mouse[1], k = 1 - Math.pow(0.86, dt * 60);
  mouse = [x + (aim[0] - x) * k, y + (aim[1] - y) * k];
  press += ((down ? 1 : 0) - press) * k;
  var cw = view.clientWidth, ch = view.clientHeight, s = Math.min(devicePixelRatio || 1, 1.5);
  if (!view.__omCapGl) s = Math.pow(0.7, level) * Math.min(s, sharp, Math.sqrt(2.0736e6 / (cw * ch)));
  var w = Math.max(2, Math.round(cw * s)), h = Math.max(2, Math.round(ch * s));
  if (view.width !== w || view.height !== h) { view.width = w; view.height = h; fresh = true; }
  var moved = Math.abs(mouse[0] - x) + Math.abs(mouse[1] - y) > 0.0005 || (press > 0.01 && press < 0.99);
  if (still && !fresh && !moved && text === before) return;
  before = text; fresh = false;
  if (buf.width !== w || buf.height !== h) { buf.width = w; buf.height = h; }
  gl.viewport(0, 0, w, h);
  for (var name in vals) put(name, vals[name]);
  put('uTime', time); put('uResolution', [w, h]); put('uMouse', mouse); put('uPress', press);
  if (uni.uTrail) {
    var t = new Float32Array(36);
    for (var i = 0; i < 12; i++) {
      var p = trail[i] || [0, 0, clock + 1];
      t[i * 3] = p[0]; t[i * 3 + 1] = p[1]; t[i * 3 + 2] = clock - p[2];
    }
    gl.uniform3fv(uni.uTrail.at, t);
  }
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  paint.drawImage(buf, 0, 0);
}
function frame(now) {
  try { draw(now); } catch (e) { fail(oops + e.message); }
}
function count(now) { ticks = 0; due = now + 2e3; }
function tune(now) {
  var f = frameElement;
  sharp = f && f.getBoundingClientRect().width < f.offsetWidth / 2 ? 1 : 1.5;
  if (ticks < 50 && !calm.matches) { level += level < 5; next = now + wait * 1e3; }
  else if (level && now > next) { level--; wait = Math.min(wait * 2, 64); next = now + wait * 1e3; }
  count(now);
}
function tick(now) {
  raf = gl && !gl.isContextLost() ? requestAnimationFrame(tick) : 0;
  if (!raf) return;
  ticks++;
  if (now > due) tune(now);
  if (view.__omCapGl || now - last > (inside ? 12 : Math.max(30, level * level * 4))) frame(now);
}
function run() { clearTimeout(away); if (view && !raf && wake()) { count(last = performance.now()); raf = requestAnimationFrame(tick); } }
function halt() { cancelAnimationFrame(raf); raf = 0; }
function drop(force) {
  var l = trail[0];
  if (!force && l && Math.hypot(l[0] - aim[0], l[1] - aim[1]) < 0.04) return;
  trail.unshift([aim[0], aim[1], clock]);
  trail.length = Math.min(trail.length, 12);
}
function point(e) {
  aim = [e.offsetX / (view.clientWidth || 1), 1 - e.offsetY / (view.clientHeight || 1)];
  inside = true; run();
}
var on = {
  pointermove: (e) => { point(e); drop(false); },
  pointerdown: (e) => { point(e); down = true; drop(true); },
  pointerup: () => { down = false; },
  pointerleave: () => { inside = false; down = false; }
};
var seen = new IntersectionObserver((es) => {
  clearTimeout(away);
  shown = es[es.length - 1].isIntersecting;
  if (shown) run();
  else { halt(); away = setTimeout(sleep, 1500); }
});
function hold(el) {
  for (var ev in on) {
    if (view) view.removeEventListener(ev, on[ev]);
    if (el) el.addEventListener(ev, on[ev]);
  }
  seen.disconnect();
  view = el;
  if (el) { paint = el.getContext('2d'); seen.observe(el); } else halt();
}
document.addEventListener('visibilitychange', () => count(performance.now()));
hold(logic.view.current);
if (wake()) frame(last = performance.now());
return {
  update() { if (logic.view.current !== view) hold(logic.view.current); if (shown) run(); },
  stop() { halt(); clearTimeout(away); hold(null); sleep(); }
};
}
var FRAG = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uPress;
uniform vec3 uTrail[12];
uniform vec3 uBase;
uniform vec3 uDeep;
uniform vec3 uCore;
uniform vec3 uHigh;
uniform float uGrain;
uniform float uPull;
uniform float uScale;
uniform float uCalm;
uniform float uStretch;

float hash(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5; mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = r * p * 2.02; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  vec2 m = (uMouse - 0.5) * uResolution / uResolution.y;
  float t = uTime * 0.05;
  vec2 d = p - m;
  float well = exp(-dot(d, d) * 6.0) * uPull;
  // ripples left by the pointer
  float h = 0.0;
  for (int i = 0; i < 12; i++) {
    vec3 tr = uTrail[i];
    if (tr.z >= 0.0) {
      vec2 tp = (tr.xy - 0.5) * uResolution / uResolution.y;
      float rr = length(p - tp) - tr.z * 0.34;
      h += sin(rr * 36.0) * exp(-rr * rr * 40.0) * exp(-tr.z * 1.2);
    }
  }
  // warped coordinates: swirl around the pointer, bent by ripples
  vec2 q = p * 1.1 * uScale;
  q += vec2(-d.y, d.x) * well * 0.9 - d * well * 0.5;
  q += vec2(h, h * 0.6) * 0.12 * uPull;
  vec2 w1 = vec2(fbm(q + vec2(0.0, t)), fbm(q + vec2(5.2, 1.3) - t));
  vec2 w2 = vec2(fbm(q + 2.0 * w1 + vec2(1.7, 9.2) + t * 0.7), fbm(q + 2.0 * w1 + vec2(8.3, 2.8) - t * 0.6));
  float f = fbm(q + 2.2 * w2);
  // heat pools low and at the sides, calm behind the headline
  float low = pow(1.0 - uv.y, 1.8);
  float side = smoothstep(0.3, 0.95, abs(p.x) * 1.05);
  vec2 c = vec2(p.x * 0.8, (uv.y - uCalm) * 1.3 * uStretch);
  float calm = exp(-dot(c, c) * 3.0);
  float heat = f * 1.15 + 0.55 * low + 0.25 * side - 0.4 * calm - 0.08;
  heat += exp(-dot(d, d) * 10.0) * 0.2 * uPull * (0.7 + 0.6 * uPress);
  float x = clamp((heat - 0.15) / 0.95, 0.0, 1.0);
  x = mix(smoothstep(0.1, 0.9, x), x, 0.25);
  vec3 col = mix(uBase, uDeep, smoothstep(0.0, 0.4, x));
  col = mix(col, uCore, smoothstep(0.35, 0.78, x));
  col = mix(col, uHigh, smoothstep(0.72, 1.0, x) * 0.9);
  // luma grain, same on every channel
  float g = hash(gl_FragCoord.xy + floor(uTime * 12.0) * 17.31) - 0.5;
  col += g * uGrain;
  outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;
