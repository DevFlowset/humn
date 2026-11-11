class Component extends DCLogic {
  constructor(props) { super(props); this.view = React.createRef(); this.phone = React.createRef(); this.timers = []; }
  componentDidMount() { this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; this.stage = shaderStage(this, FRAG); this.phoneInit(); }
  componentDidUpdate() { this.stage.update(); }
  componentWillUnmount() { this.stage.stop(); this.phoneStop(); }
  phoneStop() {
    this.timers.forEach(clearTimeout); this.timers = [];
    if (this.io) { this.io.disconnect(); this.io = null; }
  }
  phoneInit() {
    const root = this.phone && this.phone.current;
    if (!root) return;
    const q = (s) => root.querySelector(s);
    const msgs = Array.prototype.slice.call(root.querySelectorAll('.feed > .m')).filter((n) => !n.classList.contains('tpm'));
    const st = q('.ph-st'), tp = q('.tpm'), isl = q('.isl'), cp = q('.cpin'), txt = q('.cptext'), meta = q('.meta'), btn = q('.lg'), feed = q('.feed'), pc = q('.pc'), mc = q('.mc');
    if (!tp || !isl || !cp || !txt || !meta || !btn || !feed || !pc || !mc) return;
    const self = this;
    const m = (n) => q('.m' + n);
    const at = (ms, fn) => { self.timers.push(setTimeout(fn, ms)); };
    const typing = (on) => { tp.classList.toggle('in', on); isl.classList.toggle('is-wave', on); };
    const say = (ms, n, wait) => {
      at(ms, () => typing(true));
      at(ms + wait, () => { typing(false); m(n).classList.add('in'); });
    };
    const typeIn = (ms, text, n) => {
      const per = 48, end = ms + 200 + text.length * per;
      at(ms, () => cp.classList.add('typing'));
      for (let i = 1; i <= text.length; i++) at(ms + 200 + i * per, () => { txt.textContent = text.slice(0, i); cp.classList.add('has'); });
      at(end + 450, () => cp.classList.add('sent'));
      at(end + 620, () => { cp.classList.remove('has', 'sent', 'typing'); txt.textContent = ''; m(n).classList.add('in'); });
    };
    const reset = () => {
      msgs.forEach((n) => n.classList.remove('in'));
      tp.classList.remove('in'); pc.classList.remove('on'); mc.classList.remove('on');
      btn.classList.remove('done', 'press', 'tap');
      isl.classList.remove('is-wave', 'is-done'); if (st) st.classList.remove('hide');
      cp.classList.remove('has', 'sent', 'typing');
      txt.textContent = ''; meta.textContent = 'Delivered';
    };
    const play = () => {
      reset();
      say(700, 1, 1000);
      say(2500, 2, 1100);
      typeIn(4900, 'Done. Feeling looser.', 3);
      at(7800, () => { meta.textContent = 'Read'; });
      say(7400, 4, 1000);
      at(8600, () => pc.classList.add('on'));
      typeIn(11000, 'What should I eat for lunch?', 5);
      say(14000, 6, 1000);
      at(16300, () => m(7).classList.add('in'));
      at(16700, () => mc.classList.add('on'));
      at(19800, () => btn.classList.add('tap', 'press'));
      at(20000, () => btn.classList.remove('press'));
      at(20050, () => btn.classList.add('done'));
      at(20300, () => { if (st) st.classList.add('hide'); isl.classList.add('is-done'); });
      at(23800, () => { isl.classList.remove('is-done'); if (st) st.classList.remove('hide'); });
      at(25400, () => feed.classList.add('is-out'));
      at(25900, () => { reset(); });
      at(26100, () => { feed.classList.remove('is-out'); });
      at(26300, () => { self.timers = []; play(); });
    };
    const showAll = () => {
      msgs.forEach((n) => n.classList.add('in'));
      pc.classList.add('on'); mc.classList.add('on'); btn.classList.add('done'); meta.textContent = 'Read';
    };
    if (this.reduce) { showAll(); return; }
    let on = false;
    this.io = new IntersectionObserver((es) => {
      const v = es[es.length - 1].isIntersecting;
      if (v && !on) { on = true; at(1300, play); }
      else if (!v && on) { on = false; self.timers.forEach(clearTimeout); self.timers = []; feed.classList.remove('is-out'); reset(); }
    }, { threshold: 0.3 });
    this.io.observe(root);
  }
  uniforms() {
    const p = this.props;
    const h = (this.view.current && this.view.current.clientHeight) || 1470;
    return {
      speed: p.speed ?? 1,
      uScale: p.scale ?? 1,
      uGrain: p.grain ?? 0.07,
      uBase: p.base ?? '#19090E',
      uDeep: p.deep ?? '#571522',
      uCore: p.core ?? '#AE3443',
      uHigh: p.highlight ?? '#E58A86',
      uPull: p.pointer ?? 0.3,
      uCalm: 1 - 340 / h,
      uStretch: h / 900
    };
  }
  renderVals() {
    if (this.error) throw new Error(this.error);
    const self = this;
    const open = !!(this.state && this.state.open);
    return {
      view: this.view,
      phone: this.phone,
      tilt: (e) => {
        const el = e.currentTarget;
        if (self.reduce || e.pointerType === 'touch') return;
        const s = el.__t || (el.__t = { x: 0, y: 0, tx: 0, ty: 0, raf: 0 });
        if (e.type === 'pointermove' || e.type === 'pointerenter') {
          const r = el.getBoundingClientRect();
          s.tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
          s.ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
        } else { s.tx = 0; s.ty = 0; }
        if (s.raf) return;
        const step = () => {
          s.x += (s.tx - s.x) * 0.08; s.y += (s.ty - s.y) * 0.08;
          el.style.setProperty('--rx', (-s.y * 4).toFixed(2) + 'deg');
          el.style.setProperty('--ry', (s.x * 5).toFixed(2) + 'deg');
          el.style.setProperty('--gx', (50 + s.x * 40).toFixed(1) + '%');
          el.style.setProperty('--gy', (10 + s.y * 30).toFixed(1) + '%');
          if (Math.abs(s.tx - s.x) > 0.002 || Math.abs(s.ty - s.y) > 0.002) s.raf = requestAnimationFrame(step);
          else s.raf = 0;
        };
        s.raf = requestAnimationFrame(step);
      },
      submit: (e) => { e.preventDefault(); },
      menuOpen: open ? 'true' : 'false',
      panelCls: open ? 'nav-panel is-open' : 'nav-panel',
      toggleMenu: () => this.setState({ open: !open }),
      closeMenu: () => this.setState({ open: false }),
      navKey: (e) => { if (e.key === 'Escape' && open) this.setState({ open: false }); },
      mag: (e) => {
        const btn = e.currentTarget;
        if (self.reduce || e.pointerType === 'touch') return;
        const s = btn.__m || (btn.__m = { x: 0, y: 0, tx: 0, ty: 0, raf: 0 });
        if (e.type === 'pointermove' || e.type === 'pointerenter') {
          const r = btn.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2 - s.x)) / (r.width / 2);
          const dy = (e.clientY - (r.top + r.height / 2 - s.y)) / (r.height / 2);
          s.tx = Math.max(-1, Math.min(1, dx)) * 8;
          s.ty = Math.max(-1, Math.min(1, dy)) * 5;
        } else { s.tx = 0; s.ty = 0; }
        if (s.raf) return;
        const step = () => {
          s.x += (s.tx - s.x) * 0.14; s.y += (s.ty - s.y) * 0.14;
          btn.style.setProperty('--tx', s.x.toFixed(2) + 'px');
          btn.style.setProperty('--ty', s.y.toFixed(2) + 'px');
          btn.style.setProperty('--lx', (s.x * 0.45).toFixed(2) + 'px');
          btn.style.setProperty('--ly', (s.y * 0.45).toFixed(2) + 'px');
          if (Math.abs(s.tx - s.x) > 0.02 || Math.abs(s.ty - s.y) > 0.02) s.raf = requestAnimationFrame(step);
          else s.raf = 0;
        };
        s.raf = requestAnimationFrame(step);
      }
    };
  }
}
