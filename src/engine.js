/* TENMILE — engine */
(function () {
  const $ = s => document.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/'/g, '’');
  const SAVE = 'tenmile.save.v1';
  let S = null, busy = false, curPlate = null, curPlateKey = '';

  function fresh() { return { v: { ledger: 1, hand: 1, ear: 1, dog: 1, preacher: 1, river: 1 }, f: {}, book: [], money: 30, t: 0, node: 'grade', tried: {} }; }
  function save() { try { localStorage.setItem(SAVE, JSON.stringify(S)); } catch (e) { } }
  function load() { try { const s = JSON.parse(localStorage.getItem(SAVE) || 'null'); return s && s.node && s.v ? s : null; } catch (e) { return null; } }
  function clearSave() { try { localStorage.removeItem(SAVE); } catch (e) { } }

  /* ---------- sound ---------- */
  const A = { ctx: null, on: true, master: null, wind: null, water: null };
  function audioStart() {
    if (A.ctx || !A.on) return;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    try {
      const c = A.ctx = new AC();
      A.master = c.createGain(); A.master.gain.value = 0; A.master.connect(c.destination);
      A.master.gain.linearRampToValueAtTime(.9, c.currentTime + 3);
      const len = c.sampleRate * 4, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
      let last = 0; for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + .02 * w) / 1.02; d[i] = last * 3.2; }
      const mk = (freq, q, type) => { const s = c.createBufferSource(); s.buffer = buf; s.loop = true; const f = c.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q; const g = c.createGain(); g.gain.value = 0; s.connect(f); f.connect(g); g.connect(A.master); s.start(); return { f, g }; };
      A.wind = mk(420, .6, 'bandpass'); A.water = mk(900, .3, 'lowpass');
      const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = .07; lg.gain.value = 170; lfo.connect(lg); lg.connect(A.wind.f.frequency); lfo.start();
      A.wind.g.gain.value = .16;
      A.buf = buf;
      setTimeout(tone, 5000);
      setAmb(curPlate);
    } catch (e) { A.ctx = null; }
  }
  const SCALE = [73.42, 110, 146.83, 174.61, 220, 261.63, 293.66];
  function tone() {
    if (!A.ctx) return;
    if (A.on && A.ctx.state === 'running') {
      const c = A.ctx, t = c.currentTime, f = SCALE[Math.floor(Math.random() * SCALE.length)];
      const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.05, t + 2.2); g.gain.exponentialRampToValueAtTime(.0005, t + 9);
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700;
      [0, 3].forEach(det => { const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = f; o.detune.value = det ? 7 : -5; o.connect(lp); o.start(t); o.stop(t + 9.2); });
      lp.connect(g); g.connect(A.master);
    }
    setTimeout(tone, 9000 + Math.random() * 12000);
  }
  function setAmb(plate) {
    if (!A.ctx) return;
    const t = A.ctx.currentTime;
    const w = { ferry: .2, night: .26, dam: .1, valley: .03 }[plate] || 0;
    const wi = { night: .09, store: .1, mill: .12 }[plate] || .16;
    A.water.g.gain.setTargetAtTime(w, t, 1.5); A.wind.g.gain.setTargetAtTime(wi, t, 1.5);
  }
  function blip(kind) {
    if (!A.ctx || !A.on || A.ctx.state !== 'running') return;
    const c = A.ctx, t = c.currentTime;
    if (kind === 'pen') {
      for (let i = 0; i < 9; i++) {
        const s = c.createBufferSource(); s.buffer = A.buf; const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1800 + Math.random() * 1500;
        const g = c.createGain(); const t0 = t + .25 + i * .15 + Math.random() * .05, dur = .07 + Math.random() * .08;
        g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(.5, t0 + .02); g.gain.linearRampToValueAtTime(0, t0 + dur);
        s.connect(f); f.connect(g); g.connect(A.master); s.start(t0, Math.random() * 3); s.stop(t0 + dur + .02);
      }
    } else {
      const n = kind === 'dice' ? 5 : 1;
      for (let i = 0; i < n; i++) {
        const o = c.createOscillator(), g = c.createGain(); const t0 = t + i * .13 + Math.random() * .03;
        o.type = 'square'; o.frequency.setValueAtTime(kind === 'dice' ? 900 + Math.random() * 700 : 420, t0); o.frequency.exponentialRampToValueAtTime(120, t0 + .05);
        g.gain.setValueAtTime(kind === 'dice' ? .05 : .025, t0); g.gain.exponentialRampToValueAtTime(.0005, t0 + .06);
        o.connect(g); g.connect(A.master); o.start(t0); o.stop(t0 + .08);
      }
    }
  }
  function setSound(on) {
    A.on = on; $('#b-sound').textContent = on ? 'Sound on' : 'Sound off';
    try { localStorage.setItem('tenmile.sound', on ? '1' : '0'); } catch (e) { }
    if (on) { audioStart(); if (A.ctx) { A.ctx.resume(); } } else if (A.ctx) A.ctx.suspend();
  }

  /* ---------- plate & book ---------- */
  function setPlate(id) {
    const key = id + '|' + S.t + '|' + (S.f.knowMill ? 1 : 0);
    if (key === curPlateKey) return;
    const fig = $('#plate'), holder = $('#plate-svg');
    const first = !curPlateKey; curPlateKey = key; curPlate = id;
    const put = () => { holder.innerHTML = plateSVG(id, S); fig.classList.remove('swap'); };
    if (first) put(); else { fig.classList.add('swap'); setTimeout(put, 460); }
    setAmb(id);
  }
  function bookHTML() {
    const n = S.book.filter(e => !e.struck).length;
    let rows = S.book.map((e, i) => `<li class="${e.struck ? 'struck' : ''}"><span class="no">${i + 1}</span><span class="nm">${esc(e.name)}<small>${esc(e.note)}</small></span><span class="ag">${e.age}</span></li>`).join('');
    for (let i = S.book.length; i < Math.max(7, S.book.length + 1); i++) rows += `<li class="blank"><span class="no">${i + 1}</span><span class="nm"></span><span class="ag"></span></li>`;
    return `<div class="book-inner"><div class="book-head"><span>Schedule C · Souls</span><span>Name</span><span>Age</span></div><ol class="book-rows">${rows}</ol>
    <div class="book-foot"><span>Entered: <b>${n}</b></span><span>Allowance: <b>$${n * 40}</b></span><span>Your voucher: <b>${S.money ? '$30' : 'given'}</b></span></div></div>`;
  }
  function refresh() {
    $('#book').innerHTML = bookHTML();
    const n = S.book.filter(e => !e.struck).length;
    $('#clock').textContent = TIMES[Math.min(S.t, 5)] + ' · ' + n + (n === 1 ? ' soul' : ' souls') + ' entered';
    $('#b-book').textContent = 'Book (' + n + ')';
  }

  /* ---------- the log ---------- */
  const log = () => $('#log'), scroller = () => $('#right');
  function scrollToNew(firstNew) {
    if (!firstNew) return;
    requestAnimationFrame(() => {
      const sc = scroller();
      const top = firstNew.offsetTop - 26;
      const bottomOfContent = log().lastElementChild.offsetTop + log().lastElementChild.offsetHeight;
      const fits = bottomOfContent - top < sc.clientHeight - 30;
      const target = fits ? Math.max(0, bottomOfContent - sc.clientHeight + 40) : top;
      if (target > sc.scrollTop) sc.scrollTo({ top: target, behavior: 'smooth' });
    });
  }
  function lineEl(L) {
    if (!L) return null;
    if (L.k === 'n') return el('p', 'ln-n', esc(L.t));
    if (L.k === 'p') return el('p', 'ln-p', `<span class="who">${esc(L.who)}</span>${esc(L.t)}`);
    if (L.k === 'v') { if (S.v[L.v] < L.min) return null; return el('div', 'ln-v v-' + L.v, `<span class="who">${esc(VOICES[L.v].name)}</span><span class="txt">${esc(L.t)}</span>`); }
    if (L.k === 'form') return el('div', 'ln-form', esc(L.t));
    if (L.k === 'note') return el('p', 'ln-note', esc(L.t));
    if (L.k === 'entry') { const e = S.book.find(e => e.key === L.key); if (!e) return null; blip('pen'); return el('div', 'ln-entry', `<span class="nm"><span class="wr">${esc(e.name)}<small>${esc(e.note)}</small></span></span><span class="ag"><span class="wr">${e.age}</span></span>`); }
    return null;
  }
  function trim() { const l = log(); while (l.children.length > 140) l.removeChild(l.firstChild); }

  function render(nd) {
    setPlate(nd.plate); refresh();
    if (nd.fin) return fin();
    const beats = nd.beats.map(b => b.map(lineEl).filter(Boolean)).filter(b => b.length);
    let i = 0;
    const step = () => {
      const b = beats[i++]; let first = null;
      if (b) b.forEach((e, k) => { e.style.animationDelay = (k * 110) + 'ms'; log().appendChild(e); if (!first) first = e; });
      if (i < beats.length) {
        const c = el('div', 'cont'); const btn = el('button', '', 'Go on'); c.appendChild(btn); c.style.animationDelay = ((b ? b.length : 0) * 110 + 100) + 'ms';
        btn.onclick = () => { blip('tap'); c.remove(); step(); };
        log().appendChild(c); scrollToNew(first || c);
      } else {
        const o = optsEl(nd.opts); o.style.animationDelay = ((b ? b.length : 0) * 110 + 100) + 'ms';
        log().appendChild(o); scrollToNew(first || o);
      }
    };
    step(); trim();
  }

  function mods(ch) { return (ch.mods || []).filter(m => m[2]); }
  function odds(ch) {
    const bonus = S.v[ch.v] + mods(ch).reduce((a, m) => a + m[1], 0); let w = 0;
    for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) { if (a + b === 12 || (a + b !== 2 && a + b + bonus >= ch.dc)) w++; }
    return Math.round(w / 36 * 100);
  }
  const diffWord = dc => dc <= 8 ? 'Plain' : dc <= 10 ? 'Uncertain' : dc <= 12 ? 'Hard' : 'Long odds';

  function optsEl(opts) {
    const ol = el('ol', 'opts');
    opts.filter(Boolean).forEach(o => {
      const ch = o.check; let spent = false;
      if (ch) {
        const tr = S.tried[ch.id];
        if (tr != null) { if (ch.red || tr === 'won') return; if (S.v[ch.v] <= tr) spent = true; }
      }
      const li = el('li', spent ? 'spent' : ''); const b = el('button');
      let h = `<span class="${o.act ? 'o-act' : ''}">${o.vc ? `<span class="who v-${o.vc}" style="font-style:normal">${esc(o.t)}</span>` : esc(o.t)}${o.tag ? `<span class="o-tag">${esc(o.tag)}</span>` : ''}`;
      if (o.sub) h += `<span class="o-sub">${esc(o.sub)}</span>`;
      if (ch) {
        h += `<span class="o-chk v-${ch.v}">${esc(VOICES[ch.v].name)} ${S.v[ch.v]} · ${diffWord(ch.dc)} ${ch.dc} · ${spent ? 'tried. A louder voice might try again' : odds(ch) + ' in 100'}${ch.red && !spent ? ' · <span class="red">one throw only</span>' : ''}</span>`;
        mods(ch).forEach(m => { h += `<span class="o-mod">+${m[1]} ${esc(m[0])}</span>`; });
      }
      h += '</span>';
      b.innerHTML = h;
      if (!spent) b.onclick = () => choose(o, ol);
      li.appendChild(b); ol.appendChild(li);
    });
    return ol;
  }

  function choose(o, ol) {
    if (busy) return; busy = true; audioStart(); blip('tap');
    ol.remove();
    let echo = null;
    if (!o.silent) { echo = o.act ? el('p', 'ln-you act', esc(o.t)) : el('p', 'ln-you', `<span class="who">You</span>${esc(o.t)}`); log().appendChild(echo); }
    if (o.do) o.do(S);
    if (o.check) return roll(o.check, echo);
    busy = false; go(o.go, true);
  }

  function pips(n) { const map = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] }[n]; let h = ''; for (let i = 0; i < 9; i++) h += `<i class="${map.includes(i) ? 'on' : ''}"></i>`; return h; }
  function roll(ch, echo) {
    const a = 1 + Math.floor(Math.random() * 6), b = 1 + Math.floor(Math.random() * 6);
    const ms = mods(ch), mb = ms.reduce((x, m) => x + m[1], 0), lvl = S.v[ch.v], tot = a + b + lvl + mb;
    const ok = a + b === 12 || (a + b !== 2 && tot >= ch.dc);
    S.tried[ch.id] = ok ? 'won' : (ch.red ? 'red' : lvl);
    const box = el('div', 'roll rolling v-' + ch.v, `<div class="dice"><div class="die">${pips(3)}</div><div class="die">${pips(5)}</div></div><div class="sum"><b>${esc(VOICES[ch.v].name)}</b><br>against ${ch.dc}</div><div class="res"></div>`);
    log().appendChild(box); scrollToNew(echo || box); blip('dice');
    const dice = box.querySelectorAll('.die');
    const iv = setInterval(() => { dice[0].innerHTML = pips(1 + Math.floor(Math.random() * 6)); dice[1].innerHTML = pips(1 + Math.floor(Math.random() * 6)); }, 90);
    setTimeout(() => {
      clearInterval(iv); box.classList.remove('rolling'); dice[0].innerHTML = pips(a); dice[1].innerHTML = pips(b);
      box.querySelector('.sum').innerHTML = `<b>${esc(VOICES[ch.v].name)}</b> ${lvl}${mb ? ' + ' + mb : ''} + dice ${a + b} = <b>${tot}</b><br>against ${ch.dc}`;
      const r = box.querySelector('.res'); r.className = 'res ' + (ok ? 'pass' : 'fail');
      r.textContent = a + b === 12 ? 'Two sixes. It holds.' : a + b === 2 ? 'Two ones. It fails.' : ok ? 'It holds.' : 'It fails.';
      setTimeout(() => { busy = false; go(ok ? ch.pass : ch.fail, false); }, 900);
    }, 850);
  }

  function go(id, sep) {
    S.node = id;
    const nd = STORY[id](S);
    save();
    render(nd);
  }

  function fin() {
    clearSave();
    const n = S.book.filter(e => !e.struck).length;
    const d = el('div', 'fin', `<hr class="sep"><h3>Tenmile</h3><p>${n} entered · $${n * 40} paid · valley certified vacant</p><p>The people of the valley could have fared otherwise. The book was yours.</p>`);
    const b = el('button', '', 'Come down the grade again'); b.onclick = () => begin(true); d.appendChild(b);
    log().appendChild(d); scrollToNew(d);
  }

  /* ---------- sheets ---------- */
  function sheet(html) {
    const sh = $('#sheet'); sh.querySelector('.card').innerHTML = html + '<div class="row-btns"><button class="close" id="sh-close">Close</button></div>'; sh.hidden = false;
    $('#sh-close').onclick = () => { sh.hidden = true; };
    return sh;
  }
  function voicesSheet() {
    let h = '<h2>The Voices</h2>';
    Object.keys(VOICES).forEach(k => { h += `<div class="vrow v-${k}"><span class="nm">${VOICES[k].name}</span><span class="pips">${'●'.repeat(S.v[k])}${'○'.repeat(Math.max(0, 5 - S.v[k]))}</span><span class="gl">${esc(VOICES[k].gloss)}</span></div>`; });
    h += `<div class="howto" style="margin-top:14px"><p>When you lean on a voice it throws two dice and adds its number. Meet the figure and it holds. Two sixes always hold. Two ones never do.</p><p>Some throws can be tried again when the voice has grown. Some can be thrown only once.</p></div>`;
    sheet(h);
  }
  function bookSheet() { sheet('<h2>The Book</h2><div id="book2">' + bookHTML() + '</div>'); }
  function menuSheet() {
    const sh = sheet(`<h2>Tenmile</h2><div class="howto"><p>You are the Commission's enumerator. Count the valley before dusk. Tap a line to say it or do it. Your place is kept on this device.</p></div>`);
    const row = sh.querySelector('.row-btns');
    const r = el('button', 'close', 'Start over'); let armed = false;
    r.onclick = () => { if (!armed) { armed = true; r.textContent = 'Tap again to burn the book'; return; } sh.hidden = true; begin(true); };
    row.appendChild(r);
  }

  /* ---------- boot ---------- */
  function begin(newGame) {
    if (newGame || !S) { S = fresh(); clearSave(); }
    log().innerHTML = ''; scroller().scrollTop = 0; curPlateKey = ''; busy = false;
    const t = $('#title'); t.classList.add('gone'); setTimeout(() => { t.hidden = true; t.querySelector('.tplate').innerHTML = ''; }, 950);
    $('#plate-svg').innerHTML = '';
    go(S.node);
  }
  function start(hot) {
    let sOn = true; try { sOn = localStorage.getItem('tenmile.sound') !== '0'; } catch (e) { }
    A.on = sOn; $('#b-sound').textContent = sOn ? 'Sound on' : 'Sound off';
    $('#b-sound').onclick = () => setSound(!A.on);
    $('#b-voices').onclick = voicesSheet; $('#b-book').onclick = bookSheet; $('#b-menu').onclick = menuSheet;
    $('#sheet').addEventListener('click', e => { if (e.target.id === 'sheet') e.target.hidden = true; });
    $('#plate').addEventListener('click', e => {
      const m = e.target.closest && e.target.closest('.mk'); if (!m || busy || !S || S.node !== 'hub') return;
      const map = { store: /store/i, church: /churchyard/i, ferry: /^The ferry/i, dam: /works/i };
      const loc = m.getAttribute('data-loc'); const btns = [...document.querySelectorAll('#log .opts:last-of-type button')];
      const b = btns.find(b => map[loc] && map[loc].test(b.textContent)); if (b) b.click();
    });
    const saved = (hot && hot.S) || load();
    $('#title .tplate').innerHTML = plateSVG('valley', { t: 0, f: { bare: 1 } });
    const bn = $('#t-new'), bc = $('#t-cont');
    if (saved && saved.node !== 'grade' && saved.node !== 'fin') { bc.hidden = false; bc.onclick = () => { S = saved; audioStart(); begin(false); }; bn.textContent = 'Begin again'; bn.classList.remove('primary'); bc.classList.add('primary'); }
    bn.onclick = () => { audioStart(); begin(true); };
    document.addEventListener('visibilitychange', () => { if (!A.ctx) return; if (document.hidden) A.ctx.suspend(); else if (A.on) A.ctx.resume(); });
    window.__tenmile = { get S() { return S; }, go };
  }
  try { window.claude && window.claude.hot && window.claude.hot.snapshot && window.claude.hot.snapshot(() => ({ S })); } catch (e) { }
  if (window.claude && window.claude.hot && window.claude.hot.ready) window.claude.hot.ready(start); else start((window.claude && window.claude.hot && window.claude.hot.data) || {});
})();
