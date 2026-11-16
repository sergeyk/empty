/* Plates: cyanotype survey drawings, 800x500. Each returns inner SVG. */
const PL = '#dbe8ef';
function fig(x, y, s, opts) {
  // small standing figure, feet at x,y, height ~ 26*s
  opts = opts || {};
  const h = 26 * s;
  let g = `<g transform="translate(${x} ${y})" fill="${PL}">`;
  g += `<circle cx="0" cy="${-h}" r="${3.2 * s}"/>`;
  if (opts.skirt) g += `<path d="M${-3 * s} ${-h + 4 * s} L${3 * s} ${-h + 4 * s} L${5.5 * s} 0 L${-5.5 * s} 0 Z"/>`;
  else g += `<path d="M${-3.4 * s} ${-h + 4 * s} L${3.4 * s} ${-h + 4 * s} L${3 * s} ${-h * 0.42} L${3.6 * s} 0 L${1 * s} 0 L0 ${-h * 0.38} L${-1 * s} 0 L${-3.6 * s} 0 L${-3 * s} ${-h * 0.42} Z"/>`;
  if (opts.hat) g += `<path d="M${-6 * s} ${-h - 1.6 * s} L${6 * s} ${-h - 1.6 * s} L${3 * s} ${-h - 2.6 * s} L${2.6 * s} ${-h - 5.6 * s} L${-2.6 * s} ${-h - 5.6 * s} L${-3 * s} ${-h - 2.6 * s} Z"/>`;
  g += `</g>`;
  return g;
}
function mule(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${PL}">
  <path d="M-22 -22 C-10 -26 8 -26 18 -23 L26 -34 L29 -40 L31 -34 L34 -39 L35 -32 L42 -24 L40 -19 L32 -21 L24 -14 L22 0 L18 0 L17 -10 L-12 -9 L-14 0 L-18 0 L-19 -11 C-24 -13 -25 -18 -22 -22 Z"/>
  <path d="M-22 -21 C-27 -18 -27 -10 -25 -4" stroke="${PL}" stroke-width="1.6" fill="none"/></g>`;
}
function waterline(y, label) {
  return `<g class="wl"><line x1="18" x2="782" y1="${y}" y2="${y}" stroke="${PL}" stroke-width="1.2" stroke-dasharray="14 7 2 7" opacity=".9"/>
  <text x="776" y="${y - 7}" text-anchor="end" class="pl-t">${label || 'PROPOSED WATER SURFACE · EL. 412'}</text>
  <path d="M30 ${y} l-6 -9 h12 z" fill="${PL}"/></g>`;
}
function frame(no, name) {
  return `<rect x="9" y="9" width="782" height="482" fill="none" stroke="${PL}" stroke-width="1" opacity=".55"/>
  <rect x="14" y="14" width="772" height="472" fill="none" stroke="${PL}" stroke-width=".5" opacity=".4"/>
  <g><rect x="524" y="446" width="262" height="40" fill="#0d2a4a" stroke="${PL}" stroke-width=".7" opacity=".95"/>
  <text x="534" y="462" class="pl-s">VALLEY COMMISSION · SURVEY OF TENMILE</text>
  <text x="534" y="478" class="pl-t">PLATE ${no}. ${name}</text></g>`;
}
function hatch(id, gap, ang, op) {
  return `<pattern id="${id}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse" patternTransform="rotate(${ang})"><line x1="0" y1="0" x2="0" y2="${gap}" stroke="${PL}" stroke-width=".8" opacity="${op}"/></pattern>`;
}
const DEFS = `<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b2748"/><stop offset=".55" stop-color="#153f6c"/><stop offset="1" stop-color="#0e3157"/></linearGradient>
<radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#dbe8ef" stop-opacity=".55"/><stop offset="1" stop-color="#dbe8ef" stop-opacity="0"/></radialGradient>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .86  0 0 0 0 .91  0 0 0 0 .94  0 0 0 .5 -.18"/></filter>
<filter id="blot" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".008 .012" numOctaves="3" seed="3"/><feColorMatrix values="0 0 0 0 .04  0 0 0 0 .12  0 0 0 0 .22  0 0 0 1.1 -.5"/></filter>
${hatch('h1', 5, 35, .5)}${hatch('h2', 4, -40, .38)}${hatch('h3', 7, 90, .3)}${hatch('h4', 3.2, 60, .55)}${hatch('h5', 6, 0, .35)}
</defs>`;
function base(sunx, suny) {
  return `<rect width="800" height="500" fill="url(#sky)"/>
  <circle cx="${sunx}" cy="${suny}" r="70" fill="url(#glow)"/><circle cx="${sunx}" cy="${suny}" r="15" fill="none" stroke="${PL}" stroke-width="1.1"/><circle cx="${sunx}" cy="${suny}" r="11" fill="${PL}" opacity=".85"/>`;
}
function finish() {
  return `<rect width="800" height="500" filter="url(#blot)" opacity=".5"/><rect width="800" height="500" filter="url(#grain)" opacity=".5"/>`;
}
function sunAt(t) { // t 0..5
  const xs = [120, 230, 400, 560, 660, 715], ys = [150, 95, 60, 90, 135, 178];
  t = Math.max(0, Math.min(5, t));
  return [xs[t], ys[t]];
}
function house(x, y, w, h, o) {
  o = o || {};
  const r = o.roof || h * .55;
  return `<g><path d="M${x} ${y} v${-h} l${w / 2} ${-r} l${w / 2} ${r} v${h} z" fill="#123a65" stroke="${PL}" stroke-width="1"/>
  <path d="M${x} ${y} v${-h} l${w / 2} ${-r} l${w / 2} ${r} v${h} z" fill="url(#${o.h || 'h2'})"/>
  ${o.door ? `<rect x="${x + w * .42}" y="${y - h * .62}" width="${w * .18}" height="${h * .62}" fill="#081d36" stroke="${PL}" stroke-width=".7"/>` : ''}</g>`;
}

const PLATES = {
  valley(S) {
    const [sx, sy] = sunAt(S.t);
    const mk = (id, x, y, label, anchor, dx, dy) => `<g class="mk" data-loc="${id}"><circle cx="${x}" cy="${y}" r="16" fill="#0d2a4a" opacity=".01"/><circle cx="${x}" cy="${y}" r="5.5" fill="none" stroke="${PL}" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="1.6" fill="${PL}"/><text x="${x + (dx || 0)}" y="${y + (dy || -11)}" text-anchor="${anchor || 'middle'}" class="pl-m" style="font-size:${id === 'dam' ? 13 : 9}px">${label}</text></g>`;
    return base(sx, sy) + `
    <path d="M0 215 C90 170 150 205 230 180 C300 160 330 190 400 178 C470 168 520 150 600 172 C680 192 740 160 800 178 V500 H0Z" fill="#0f3359" stroke="${PL}" stroke-width=".9" opacity=".95"/>
    <path d="M0 215 C90 170 150 205 230 180 C300 160 330 190 400 178 C470 168 520 150 600 172 C680 192 740 160 800 178 V260 H0Z" fill="url(#h5)" opacity=".5"/>
    <!-- dam at head -->
    <path d="M352 196 L448 196 L441 236 L359 236 Z" fill="${PL}" opacity=".92"/>
    <path d="M364 196 v40 M376 196 v40 M388 196 v40 M400 196 v40 M412 196 v40 M424 196 v40 M436 196 v40" stroke="#123a65" stroke-width=".9"/>
    <rect x="392" y="186" width="16" height="10" fill="${PL}"/>
    <!-- valley walls -->
    <path d="M0 215 C60 240 140 250 205 300 C255 338 268 410 232 500 H0Z" fill="#0b2848" stroke="${PL}" stroke-width="1"/>
    <path d="M0 215 C60 240 140 250 205 300 C255 338 268 410 232 500 H0Z" fill="url(#h1)" opacity=".55"/>
    <path d="M800 178 C740 230 680 240 622 290 C580 330 566 410 604 500 H800Z" fill="#0b2848" stroke="${PL}" stroke-width="1"/>
    <path d="M800 178 C740 230 680 240 622 290 C580 330 566 410 604 500 H800Z" fill="url(#h2)" opacity=".6"/>
    <!-- floor -->
    <path d="M359 236 L441 236 C500 262 580 296 622 290 C580 330 566 410 604 500 H232 C268 410 255 338 205 300 C270 292 325 262 359 236Z" fill="#123d69" opacity=".9"/>
    <!-- river -->
    <path class="riv" d="M400 236 C392 262 436 280 430 310 C422 346 392 356 398 396 C404 434 452 450 440 500" fill="none" stroke="${PL}" stroke-width="5" opacity=".8"/>
    <path d="M400 236 C392 262 436 280 430 310 C422 346 392 356 398 396 C404 434 452 450 440 500" fill="none" stroke="#123d69" stroke-width="2.4"/>
    <!-- road down the grade -->
    <path d="M0 262 C70 268 110 300 150 330 C190 360 240 392 300 396" fill="none" stroke="${PL}" stroke-width="1.1" stroke-dasharray="5 4" opacity=".8"/>
    <g transform="translate(398 392) scale(1.55) translate(-380 -390)">
    <!-- town -->
    ${house(318, 384, 16, 9)}${house(338, 392, 20, 10, { door: 1 })}${house(300, 398, 14, 8)}${house(326, 410, 15, 8)}${house(350, 414, 13, 8)}${house(304, 420, 14, 8)}
    <!-- church on rise -->
    <path d="M330 338 q22 -16 46 0 z" fill="#0f3359" stroke="${PL}" stroke-width=".8"/>
    <path d="M346 330 v-12 l7 -6 l7 6 v12 z M353 312 v-11 M349.5 305 h7" fill="#123a65" stroke="${PL}" stroke-width="1"/>
    <!-- ferry cable -->
    <line x1="366" y1="388" x2="398" y2="396" stroke="${PL}" stroke-width=".8"/>
    <rect x="375" y="388" width="9" height="5" fill="${PL}"/>
    <!-- mill -->
    ${house(452, 372, 18, 12, { h: 'h4' })}<circle cx="450" cy="366" r="6" fill="none" stroke="${PL}" stroke-width="1"/>
    ${S.f.bare ? '' : mk('store', 348, 392, 'STORE', 'end', -11, 3) + mk('church', 353, 326, 'CHURCH', 'end', -12, 3) + mk('ferry', 380, 391, 'FERRY', 'middle', 0, 20)}
    ${S.f.knowMill ? mk('mill', 461, 364, 'MILL', 'start', 12, 3) : ''}
    </g>
    ${waterline(252)}
    ${S.f.bare ? '' : mk('dam', 400, 214, 'THE WORKS', 'middle', 0, -36)}
    <g opacity=".8"><path d="M60 440 h90 M60 436 v8 M105 438 v4 M150 436 v8" stroke="${PL}" stroke-width="1"/><text x="60" y="456" class="pl-s">0   ½   1 MILE</text></g>
    ` + frame('I', 'THE VALLEY') + finish();
  },
  store(S) {
    const [sx, sy] = sunAt(S.t);
    return base(sx, sy) + `
    <path d="M0 250 C120 225 260 240 400 232 C560 222 690 236 800 220 V500 H0Z" fill="#0f3359" stroke="${PL}" stroke-width=".8"/>
    <path d="M0 250 C120 225 260 240 400 232 C560 222 690 236 800 220 V300 H0Z" fill="url(#h5)" opacity=".4"/>
    <rect x="0" y="392" width="800" height="108" fill="#0b2848"/><line x1="0" x2="800" y1="392" y2="392" stroke="${PL}" stroke-width="1"/>
    <rect x="0" y="392" width="800" height="108" fill="url(#h1)" opacity=".35"/>
    <!-- store -->
    <path d="M210 392 V212 H560 V392 Z" fill="#123a65" stroke="${PL}" stroke-width="1.4"/>
    <path d="M196 212 H574 L560 176 H210 Z" fill="#0d2a4a" stroke="${PL}" stroke-width="1.4"/>
    <path d="M210 176 V140 H560 V176" fill="#123a65" stroke="${PL}" stroke-width="1.4"/>
    <text x="385" y="166" text-anchor="middle" class="pl-sign">OAKE · DRY GOODS</text>
    <path d="M210 392 V212 H560 V392 Z" fill="url(#h3)" opacity=".5"/>
    <!-- gallery roof and posts -->
    <path d="M186 276 H584 L574 262 H196 Z" fill="#0d2a4a" stroke="${PL}" stroke-width="1.2"/>
    <path d="M200 276 V392 M320 276 V392 M450 276 V392 M570 276 V392" stroke="${PL}" stroke-width="2.2"/>
    <rect x="186" y="384" width="398" height="8" fill="#0d2a4a" stroke="${PL}" stroke-width="1"/>
    <!-- door, windows -->
    <rect x="356" y="296" width="58" height="88" fill="#06182d" stroke="${PL}" stroke-width="1.2"/>
    <rect x="232" y="300" width="70" height="52" fill="#06182d" stroke="${PL}" stroke-width="1.2"/><path d="M267 300 v52 M232 326 h70" stroke="${PL}" stroke-width=".8"/>
    <rect x="468" y="300" width="70" height="52" fill="#06182d" stroke="${PL}" stroke-width="1.2"/><path d="M503 300 v52 M468 326 h70" stroke="${PL}" stroke-width=".8"/>
    <rect x="240" y="226" width="40" height="28" fill="#06182d" stroke="${PL}" stroke-width="1"/><rect x="490" y="226" width="40" height="28" fill="#06182d" stroke="${PL}" stroke-width="1"/>
    <!-- chimney smoke -->
    <rect x="500" y="118" width="18" height="24" fill="#123a65" stroke="${PL}" stroke-width="1.1"/>
    <path class="smoke" d="M509 116 C500 98 522 88 512 70 C504 54 524 44 518 26" fill="none" stroke="${PL}" stroke-width="1.4" stroke-linecap="round" opacity=".7"/>
    <!-- bench and girl -->
    <path d="M228 370 h72 M234 370 v14 M294 370 v14" stroke="${PL}" stroke-width="2.4"/>
    <g fill="${PL}"><circle cx="262" cy="343" r="5"/><path d="M256 349 h12 l3 21 h10 v4 h-26 z"/><rect x="266" y="358" width="7" height="6" fill="#0d2a4a" stroke="${PL}" stroke-width=".8"/></g>
    <!-- hitch rail and mule -->
    <path d="M610 392 v-30 M700 392 v-30 M604 364 h102" stroke="${PL}" stroke-width="2.2"/>
    ${mule(656, 392, 1.7)}
    <!-- empty houses beyond -->
    ${house(40, 392, 96, 70, { door: 1 })}${house(690, 330, 60, 40, { door: 1 })}
    ${waterline(96)}
    ` + frame('II', 'THE STORE') + finish();
  },
  church(S) {
    const [sx, sy] = sunAt(S.t);
    const crosses = [[120, 400], [170, 420], [86, 440], [220, 398], [610, 410], [660, 432], [712, 404], [560, 440]].map(([x, y]) => `<path d="M${x} ${y} v-26 M${x - 7} ${y - 18} h14" stroke="${PL}" stroke-width="2.4" stroke-linecap="square"/>`).join('');
    return base(sx, sy) + `
    <path d="M0 268 C140 248 300 262 420 250 C560 238 680 256 800 240 V500 H0Z" fill="#0f3359" stroke="${PL}" stroke-width=".8"/>
    <path d="M0 268 C140 248 300 262 420 250 C560 238 680 256 800 240 V330 H0Z" fill="url(#h5)" opacity=".4"/>
    <path d="M0 392 C160 340 300 328 400 328 C520 328 660 344 800 388 V500 H0Z" fill="#0b2848" stroke="${PL}" stroke-width="1.1"/>
    <path d="M0 392 C160 340 300 328 400 328 C520 328 660 344 800 388 V500 H0Z" fill="url(#h1)" opacity=".4"/>
    <!-- church -->
    <path d="M300 334 V196 L372 150 L444 196 V334 Z" fill="#123a65" stroke="${PL}" stroke-width="1.4"/>
    <path d="M300 334 V196 L372 150 L444 196 V334 Z" fill="url(#h3)" opacity=".5"/>
    <path d="M348 166 V96 L372 60 L396 96 V166" fill="#123a65" stroke="${PL}" stroke-width="1.4"/>
    <rect x="360" y="104" width="24" height="34" fill="#06182d" stroke="${PL}" stroke-width="1"/>
    <path d="M372 60 V30 M362 40 H382" stroke="${PL}" stroke-width="2"/>
    <path d="M356 334 V270 q16 -20 32 0 V334 Z" fill="#06182d" stroke="${PL}" stroke-width="1.1"/>
    <path d="M316 230 q8 -12 16 0 v40 h-16 z M412 230 q8 -12 16 0 v40 h-16 z" fill="#06182d" stroke="${PL}" stroke-width="1"/>
    ${crosses}
    <!-- the hole -->
    <path d="M452 424 h96 l-10 30 h-76 z" fill="#06182d" stroke="${PL}" stroke-width="1.2"/>
    <path d="M556 430 q26 -30 54 -2 q12 12 4 20 h-66 z" fill="#123a65" stroke="${PL}" stroke-width="1"/><path d="M556 430 q26 -30 54 -2 q12 12 4 20 h-66 z" fill="url(#h4)"/>
    <g fill="${PL}"><circle cx="498" cy="398" r="5.5"/><path d="M490 405 h16 l5 26 h-26 z"/><path d="M506 408 l22 -12 l2 3 l-22 14 z"/><path d="M526 392 l10 28" stroke="${PL}" stroke-width="2.2"/><path d="M533 418 l8 2 l-2 10 l-9 -3 z"/></g>
    <path d="M404 452 l34 -8 l2 7 l-34 8 z M418 438 l4 22" fill="${PL}" stroke="${PL}" stroke-width="1"/>
    ${waterline(128)}
    <text x="300" y="476" class="pl-s">GRAVE 31 · NOT ON REMOVAL LIST</text>
    ` + frame('III', 'THE CHURCHYARD') + finish();
  },
  ferry(S) {
    const [sx, sy] = sunAt(S.t);
    return base(sx, sy) + `
    <path d="M0 236 C140 210 260 226 400 214 C540 202 690 224 800 204 V500 H0Z" fill="#0f3359" stroke="${PL}" stroke-width=".8"/>
    <path d="M0 236 C140 210 260 226 400 214 C540 202 690 224 800 204 V290 H0Z" fill="url(#h5)" opacity=".4"/>
    <!-- far bank -->
    <path d="M0 300 C200 286 520 292 800 280 V330 H0Z" fill="#0b2848" stroke="${PL}" stroke-width="1"/>
    ${house(640, 304, 40, 26, { h: 'h4' })}<circle cx="636" cy="294" r="12" fill="none" stroke="${PL}" stroke-width="1.2"/><path d="M636 282 v24 M624 294 h24" stroke="${PL}" stroke-width=".8"/>
    <!-- water -->
    <rect x="0" y="322" width="800" height="110" fill="#164673"/>
    <g class="ripples" stroke="${PL}" stroke-width="1" opacity=".55" fill="none">
      <path d="M30 346 h70 M160 340 h110 M330 350 h60 M450 342 h120 M640 348 h90 M90 372 h130 M290 380 h90 M470 370 h60 M600 378 h140 M40 404 h80 M210 410 h150 M430 402 h110 M620 412 h70"/>
    </g>
    <!-- mud skirt and near bank -->
    <path d="M0 432 C200 416 520 428 800 414 V500 H0Z" fill="#1b4f80" stroke="${PL}" stroke-width=".8"/>
    <path d="M0 432 C200 416 520 428 800 414 V500 H0Z" fill="url(#h4)" opacity=".35"/>
    <path d="M0 452 C200 440 480 452 800 440 V500 H0Z" fill="#0b2848" stroke="${PL}" stroke-width="1.1"/>
    <!-- cable -->
    <path d="M120 300 V396 M112 396 h16" stroke="${PL}" stroke-width="3"/>
    <path d="M120 304 Q400 350 760 268" fill="none" stroke="${PL}" stroke-width="1.3"/>
    <path d="M760 262 v26" stroke="${PL}" stroke-width="3"/>
    <!-- scow -->
    <path d="M250 398 h190 l-14 20 h-162 z" fill="#0d2a4a" stroke="${PL}" stroke-width="1.4"/>
    <path d="M262 398 v-14 h166 v14" fill="none" stroke="${PL}" stroke-width="1"/>
    <path d="M300 384 L296 326 M400 384 L404 336" stroke="${PL}" stroke-width="1"/>
    <g fill="${PL}"><circle cx="348" cy="372" r="5"/><path d="M341 378 h14 l4 14 h14 v6 h-32 z"/><path d="M342 358 h12 l3 8 h-18 z"/></g>
    <!-- house on bank with chair -->
    <path d="M560 452 V372 H706 V452 Z" fill="#123a65" stroke="${PL}" stroke-width="1.3"/><path d="M560 452 V372 H706 V452 Z" fill="url(#h3)" opacity=".5"/>
    <path d="M546 374 L633 330 L720 374 Z" fill="#0d2a4a" stroke="${PL}" stroke-width="1.3"/>
    <rect x="652" y="402" width="26" height="50" fill="#06182d" stroke="${PL}" stroke-width="1"/>
    <rect x="582" y="396" width="34" height="26" fill="#06182d" stroke="${PL}" stroke-width="1"/>
    <path d="M500 452 h60 M500 452 v-2" stroke="${PL}" stroke-width="2"/>
    <path d="M518 452 v-18 h16 v18 M518 434 v-20 M518 440 h16" stroke="${PL}" stroke-width="2" fill="none"/>
    <!-- bell post -->
    <path d="M200 452 v-56 h20" stroke="${PL}" stroke-width="2.2" fill="none"/><path d="M214 398 q6 -2 8 8 q1 6 4 8 h-18 q3 -2 4 -8 z" fill="${PL}"/>
    ${waterline(150)}
    <text x="140" y="298" class="pl-s">CABLE, 1⅛ IN. · STRUNG 18—</text>
    ` + frame('IV', 'THE CROSSING') + finish();
  },
  mill(S) {
    const [sx, sy] = sunAt(S.t);
    let spokes = '';
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; spokes += `<line x1="250" y1="330" x2="${250 + 96 * Math.cos(a)}" y2="${330 + 96 * Math.sin(a)}" stroke="${PL}" stroke-width="1.2"/>`; }
    let stones = '';
    for (let r = 0; r < 9; r++) for (let c = 0; c < 8; c++) { stones += `<rect x="${316 + c * 34 + (r % 2 ? 17 : 0)}" y="${186 + r * 26}" width="34" height="26" fill="none" stroke="${PL}" stroke-width=".5" opacity=".5"/>`; }
    return base(sx, sy) + `
    <path d="M0 240 C140 220 300 230 420 222 C560 214 690 232 800 212 V500 H0Z" fill="#0f3359" stroke="${PL}" stroke-width=".8"/>
    <path d="M0 240 C140 220 300 230 420 222 C560 214 690 232 800 212 V300 H0Z" fill="url(#h5)" opacity=".4"/>
    <rect x="0" y="420" width="800" height="80" fill="#0b2848"/><line x1="0" x2="800" y1="420" y2="420" stroke="${PL}" stroke-width="1"/>
    <rect x="0" y="420" width="800" height="80" fill="url(#h1)" opacity=".35"/>
    <!-- mill body -->
    <clipPath id="mb"><path d="M316 420 V186 H588 V420 Z"/></clipPath>
    <path d="M316 420 V186 H588 V420 Z" fill="#123a65" stroke="${PL}" stroke-width="1.5"/>
    <g clip-path="url(#mb)">${stones}</g>
    <path d="M300 190 L452 104 L604 190 Z" fill="#0d2a4a" stroke="${PL}" stroke-width="1.5"/><path d="M300 190 L452 104 L604 190 Z" fill="url(#h2)" opacity=".6"/>
    <rect x="470" y="330" width="52" height="90" fill="#06182d" stroke="${PL}" stroke-width="1.2"/>
    <rect x="462" y="420" width="68" height="8" fill="#0d2a4a" stroke="${PL}" stroke-width="1"/>
    <ellipse cx="496" cy="418" rx="12" ry="3.4" fill="${PL}"/>
    <rect x="372" y="226" width="34" height="44" fill="#06182d" stroke="${PL}" stroke-width="1"/><rect x="500" y="226" width="34" height="44" fill="#06182d" stroke="${PL}" stroke-width="1"/>
    <rect x="436" y="140" width="30" height="30" fill="#06182d" stroke="${PL}" stroke-width="1"/>
    <!-- wheel in dry race -->
    <path d="M120 450 h260 v-22 h-260 z" fill="#06182d" stroke="${PL}" stroke-width="1"/>
    <circle cx="250" cy="330" r="96" fill="none" stroke="${PL}" stroke-width="3"/><circle cx="250" cy="330" r="80" fill="none" stroke="${PL}" stroke-width="1.2"/><circle cx="250" cy="330" r="9" fill="${PL}"/>
    ${spokes}
    <!-- weeds -->
    <path d="M150 428 q4 -30 -6 -44 M160 428 q0 -24 10 -38 M200 428 q-4 -26 4 -50 M226 428 q8 -20 2 -40 M300 428 q-6 -22 6 -46 M330 428 q6 -18 0 -34 M184 428 q10 -14 16 -30" stroke="${PL}" stroke-width="1.3" fill="none" opacity=".9"/>
    <!-- sluice -->
    <path d="M40 300 h120 l30 -8 M40 300 v128 M100 300 v128" stroke="${PL}" stroke-width="2" fill="none"/>
    ${waterline(86)}
    <text x="130" y="470" class="pl-s">RACE DRY SINCE GATES TRIED</text>
    ` + frame('V', 'THE MILL') + finish();
  },
  dam(S) {
    const [sx, sy] = [700, 62];
    let butt = '';
    for (let i = 0; i < 11; i++) butt += `<path d="M${90 + i * 64} 150 l10 0 l14 290 l-38 0 z" fill="#b9cfdc" opacity=".35"/>`;
    return base(sx, sy) + `
    <path d="M0 200 C80 180 130 150 190 150 H0Z" fill="#0b2848" stroke="${PL}" stroke-width="1"/>
    <path d="M800 190 C740 170 700 150 650 150 H800Z" fill="#0b2848" stroke="${PL}" stroke-width="1"/>
    <path d="M0 150 C40 150 60 160 80 150 L60 440 H0Z" fill="#0b2848" stroke="${PL}" stroke-width="1"/><path d="M0 150 C40 150 60 160 80 150 L60 440 H0Z" fill="url(#h1)" opacity=".5"/>
    <path d="M800 150 H760 L776 440 H800Z" fill="#0b2848" stroke="${PL}" stroke-width="1"/>
    <!-- the wall -->
    <path d="M70 150 H770 L784 440 H56 Z" fill="#9fb9c9" opacity=".5" stroke="${PL}" stroke-width="1.6"/>
    ${butt}
    <path d="M70 150 H770 L784 440 H56 Z" fill="url(#h3)" opacity=".45"/>
    <path d="M62 150 H778 V138 H62Z" fill="${PL}" opacity=".9"/>
    <!-- streaks -->
    <path d="M150 152 v120 M230 152 v70 M356 152 v160 M470 152 v90 M610 152 v140 M700 152 v60" stroke="#0d2a4a" stroke-width="2" opacity=".5"/>
    <!-- gatehouse -->
    <rect x="372" y="92" width="76" height="46" fill="#123a65" stroke="${PL}" stroke-width="1.4"/><path d="M364 92 h92 l-8 -14 h-76 z" fill="#0d2a4a" stroke="${PL}" stroke-width="1.2"/>
    <rect x="386" y="104" width="14" height="18" fill="#06182d" stroke="${PL}" stroke-width=".8"/><rect x="420" y="104" width="14" height="18" fill="#06182d" stroke="${PL}" stroke-width=".8"/>
    <!-- gates -->
    <g fill="#06182d" stroke="${PL}" stroke-width="1.2"><path d="M330 440 v-70 q20 -22 40 0 v70 z"/><path d="M390 440 v-70 q20 -22 40 0 v70 z"/><path d="M450 440 v-70 q20 -22 40 0 v70 z"/></g>
    <!-- ground -->
    <rect x="0" y="440" width="800" height="60" fill="#0b2848"/><line x1="0" x2="800" y1="440" y2="440" stroke="${PL}" stroke-width="1"/>
    <!-- table, engineer, sergeant on horse, wagon -->
    <path d="M164 440 v-22 M216 440 v-22 M158 418 h64" stroke="${PL}" stroke-width="2.4"/><rect x="180" y="413" width="22" height="5" fill="${PL}"/>
    ${fig(140, 440, 1.25, { hat: 0 })}
    ${mule(262, 440, 1.5)}
    <g fill="${PL}"><circle cx="262" cy="372" r="5"/><path d="M255 378 h14 l3 24 h-20 z"/><path d="M253 368 h18 l-3 -7 h-12 z"/></g>
    <path d="M560 440 v-24 h110 v24 M560 416 l-30 12" stroke="${PL}" stroke-width="2" fill="none"/><circle cx="584" cy="436" r="12" fill="none" stroke="${PL}" stroke-width="2"/><circle cx="648" cy="436" r="12" fill="none" stroke="${PL}" stroke-width="2"/>
    ${fig(700, 440, 1.1, { hat: 1 })}${fig(722, 440, 1.1, { hat: 1 })}${fig(746, 440, 1.15, { hat: 1 })}
    ${waterline(168, 'DESIGN WATER SURFACE · EL. 412')}
    <text x="96" y="186" class="pl-s">CREST EL. 420 · 11 BAYS</text>
    ` + frame('VI', 'THE WORKS') + finish();
  },
  night(S) {
    return `<rect width="800" height="500" fill="#081f3b"/>
    <circle cx="610" cy="96" r="60" fill="url(#glow)"/><circle cx="610" cy="96" r="17" fill="${PL}" opacity=".92"/><circle cx="603" cy="92" r="15" fill="#0b2545"/>
    <path d="M0 232 C140 206 260 222 400 210 C540 198 690 220 800 200 V262 H0Z" fill="#0b2848" stroke="${PL}" stroke-width=".8"/>
    <rect x="0" y="252" width="800" height="248" fill="#113a66"/>
    <line x1="0" x2="800" y1="252" y2="252" stroke="${PL}" stroke-width="1.3"/>
    <g class="ripples" stroke="${PL}" stroke-width="1" opacity=".5" fill="none">
      <path d="M40 276 h90 M200 270 h130 M420 280 h70 M560 272 h150 M100 310 h150 M330 318 h110 M520 306 h80 M660 316 h100 M50 356 h100 M240 362 h170 M480 352 h130 M680 364 h70 M120 410 h160 M360 404 h100 M540 414 h180"/>
    </g>
    <!-- steeple tip -->
    <path d="M356 252 V236 L372 212 L388 236 V252" fill="#123a65" stroke="${PL}" stroke-width="1.3"/><path d="M372 212 V186 M363 195 H381" stroke="${PL}" stroke-width="2"/>
    <path d="M372 256 v40 M364 262 h16" stroke="${PL}" stroke-width="1.2" opacity=".35"/>
    <path d="M590 258 v120" stroke="${PL}" stroke-width="10" opacity=".12"/>
    <!-- drowned things, faint, below -->
    <g opacity=".22" stroke="${PL}" fill="none" stroke-width="1"><path d="M300 440 v-150 l72 -40 l72 40 v150"/><path d="M120 470 v-40 l30 -18 l30 18 v40 M200 476 v-34 l26 -16 l26 16 v34 M520 470 v-44 l34 -20 l34 20 v44"/></g>
    <g class="wl"><text x="776" y="244" text-anchor="end" class="pl-t">WATER SURFACE · EL. 412 · AS BUILT</text></g>
    ` + frame('VII', 'THE LAKE') + finish();
  }
};
function plateSVG(id, S) {
  return `<svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Survey plate: ${id}">${DEFS}${PLATES[id](S)}</svg>`;
}
