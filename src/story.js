/* TENMILE — the script. Each node is a function of state S returning {plate, beats, opts}. */
const N = t => ({ k: 'n', t });
const P = (who, t) => ({ k: 'p', who, t });
const V = (v, min, t) => ({ k: 'v', v, min, t });
const FORM = t => ({ k: 'form', t });
const ENTRY = key => ({ k: 'entry', key });
const NOTE = t => ({ k: 'note', t });

const VOICES = {
  ledger: { name: 'The Ledger', gloss: 'Sums, statutes, the letter of the instruction. It is never wrong and seldom any help.' },
  hand: { name: 'The Hand', gloss: 'Rope, shovel, iron. What the body knew before you took up the pen.' },
  ear: { name: 'The Ear', gloss: 'What a person means under what they say. It hears the crack in the cup.' },
  dog: { name: 'The Dog', gloss: 'The hair on your neck. It knows who is behind the door and it is not ashamed of anything.' },
  preacher: { name: 'The Preacher', gloss: 'The voice that moves other men. It believes every word while it is saying it.' },
  river: { name: 'The River', gloss: 'Not yours. It speaks from the valley floor and it has no stake in the outcome.' }
};
const NUM = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const TIMES = ['First light', 'Morning', 'Noon', 'Afternoon', 'Late afternoon', 'Dusk'];

function write(S, key, name, age, note, truth) {
  if (S.book.find(e => e.key === key)) return;
  S.book.push({ key, name, age, note: note || '', truth: truth !== false, struck: false });
}
const has = (S, key) => S.book.find(e => e.key === key && !e.struck);
const count = S => S.book.filter(e => !e.struck).length;

const STORY = {

  /* ---------------- THE OPENING ---------------- */
  grade: S => ({
    plate: 'store',
    beats: [[
      N(`You come down the grade at first light leading the mule. The valley lies in its own shadow with the river in the floor of it thin and bright as wire. At the foot of it stands the dam, white and new, and nothing else in that country is either.`),
      N(`The town is called Tenmile. Eleven roofs and a church and smoke from one chimney. The doors of the houses stand open on the street and the rooms behind them are bare to the walls. Somebody has swept them.`),
      N(`The smoke is from a store. On the gallery a girl of nine or ten sits on a bench with an open tin of peaches in her lap, eating them with her fingers. She watches you tie the mule.`),
      P('WREN', `Are you the man that counts.`)
    ]],
    opts: [
      { t: 'I am. Every soul resident on the day of the count.', do: S => { S.v.ledger += 2; S.f.pick1 = 'ledger'; }, go: 'open1' },
      { t: 'Who told you a man was coming.', do: S => { S.v.dog += 2; S.f.pick1 = 'dog'; }, go: 'open1' },
      { t: 'Say nothing yet. Listen to the town.', act: 1, do: S => { S.v.ear += 2; S.f.pick1 = 'ear'; }, go: 'open1' }
    ]
  }),
  open1: S => {
    const k = S.f.pick1;
    const L = k === 'ledger' ? [
      V('ledger', 0, `Eleven roofs. One smoke. Say five souls, seven at the outside. Two hundred dollars to two hundred eighty. We will know by dusk.`),
      P('WREN', `Granny Oake said a man would come and count us and then they'd let the water in. She said be civil.`)
    ] : k === 'dog' ? [
      P('WREN', `Granny Oake. She said a man would come and count us and then they'd let the water in. She said be civil.`),
      V('dog', 0, `It's not her that has been watching you since the grade. Somebody has. I know it the way you know rain.`)
    ] : [
      N(`You stand and listen. No hens. No dogs. A stove ticking somewhere inside and a spoon going round a tin.`),
      V('ear', 0, `A town with no dogs has left already.`),
      N(`You tell her you are.`),
      P('WREN', `Granny Oake said a man would come and count us and then they'd let the water in. She said be civil.`)
    ];
    return {
      plate: 'store',
      beats: [L.concat([
        NOTE(`${VOICES[k].name} is one of six voices you carry. The ones you lean on speak up more and win more of their throws.`),
        N(`She looks at the mule.`),
        P('WREN', `Does he count.`)
      ])],
      opts: [
        { t: 'He has no soul to enter. The book is for souls.', do: S => { S.v.preacher += 2; S.f.pick2 = 'preacher'; }, go: 'open2' },
        { t: 'Ask him yourself. Mind the off hind foot.', do: S => { S.v.hand += 2; S.f.pick2 = 'hand'; }, go: 'open2' },
        { t: 'The river doesnt count either, and it has lived here longest.', do: S => { S.v.river += 2; S.f.pick2 = 'river'; }, go: 'open2' }
      ]
    };
  },
  open2: S => {
    S.f.metWren = 1;
    const k = S.f.pick2;
    const L = k === 'preacher' ? [
      P('WREN', `Who says.`),
      N(`The Commission, you tell her.`),
      P('WREN', `Did they ask a mule.`),
      V('preacher', 0, `You carry the book of the living, brother. Do not be catechised by a child with a peach tin.`)
    ] : k === 'hand' ? [
      N(`She gets down off the bench and asks him. The mule looks at the dam.`),
      P('WREN', `He dont know either.`),
      V('hand', 0, `That off hind shoe is loose. You felt it a mile back and did nothing.`)
    ] : [
      P('WREN', `The river's getting all the houses. It ought to count if it's getting the houses.`),
      V('river', 0, `I was here before the road. I will be here over it. I am not getting anything.`)
    ];
    return {
      plate: 'store',
      beats: [L.concat([NOTE(`${VOICES[S.f.pick1].name} and ${VOICES[k].name} are the two you lean on. Four more are in there. Tap Voices to meet them.`)])],
      opts: [{ t: 'Go in.', act: 1, go: 'store_in' }]
    };
  },

  /* ---------------- THE STREET (hub) ---------------- */
  hub: S => {
    if (S.f.raise > 0) return STORY.raise(S);
    const o = [];
    const done = k => S.f['done_' + k];
    const chGo = done('church') ? 'church_back' : (S.f.metOdile ? 'church_return' : 'church');
    o.push({ t: done('store') ? 'The store. Hallie Oake.' : 'The store, where the smoke is.', act: 1, go: done('store') ? 'store_back' : 'store_in', tag: done('store') ? 'counted' : '' });
    if (S.f.told || done('store')) {
      o.push({ t: 'The churchyard, on the rise.', act: 1, go: chGo, tag: done('church') ? 'settled' : (S.f.metOdile ? 'not settled' : '') });
      o.push({ t: 'The ferry.', act: 1, go: done('ferry') ? 'ferry_back' : 'ferry', tag: done('ferry') ? 'settled' : '' });
    }
    if (S.f.shoe !== 'ok') o.push({ t: S.f.shoe === 'bad' ? `Try the mule's shoe again.` : `See to the mule's shoe.`, act: 1, check: { id: 'shoe', v: 'hand', dc: 8, mods: [['Square nails and a hammer from the works', 2, !!S.f.worksTools]], pass: 'shoe_ok', fail: 'shoe_bad' } });
    if (done('store') && !S.f.purdy) o.push({ t: 'Walk into one of the empty houses.', act: 1, go: 'purdy' });
    if (S.f.told || done('store')) o.push({ t: S.f.worksSeen ? 'Go up to the works.' : 'Go up to the works and see them.', act: 1, go: S.f.worksSeen ? 'works_choices' : 'works_visit' });
    const lines = [];
    if (!S.f.hubSeen) { S.f.hubSeen = 1; lines.push(N(`You stand in the street with the mule. Behind you the store with its one smoke. Past the last house the ground rises to a church. Below the town the river, and at the foot of the valley the works.`), V('ledger', 0, `The gates close at dusk and dusk is a long way off. There is time to see every soul in this valley. See every one.`)); }
    else {
      const t = ['', `The sun is on the east wall of the valley and the street is still in shade.`, `Noon. The shadows have gone in under things.`, `The light has crossed the river. The dam throws its shadow up the valley now, a mile long.`, `The dam's shadow has reached the first houses.`, `The light is going.`][Math.min(S.t, 5)];
      lines.push(N(`The street. ${t}`));
      if (S.f.wrenAlong && S.t >= 2 && !S.f.fish) { S.f.fish = 1; lines.push(P('WREN', `When the water comes will the fish be in the houses.`), N(`You say you expect they will.`), P('WREN', `Granny Oake swept for fish then.`)); }
      else if (S.f.wrenAlong && S.t >= 3 && !S.f.howmany) { S.f.howmany = 1; lines.push(P('WREN', `How many is it now.`), N(`You tell her. ${NUM[count(S)]}.`), P('WREN', `That aint many for a town.`)); }
    }
    return { plate: S.t >= 3 ? 'valley_dusk' : 'valley', beats: [lines], opts: o };
  },
  raise: S => ({
    plate: S.t >= 3 ? 'valley_dusk' : 'valley',
    beats: [[
      N(S.f.raised ? `Coming up from the river you find you are listening harder than you were. One of them has gained on the others again.` : `Walking back up the street something has shifted in you the way a load shifts on a mule. One of them is louder than it was.`),
      NOTE(`Raise one voice by a point.`)
    ]],
    opts: Object.keys(VOICES).filter(k => S.v[k] < 5).map(k => ({ t: `${VOICES[k].name}.`, sub: `Now ${S.v[k]}. ${VOICES[k].gloss}`, vc: k, silent: 1, do: S => { S.v[k] += 1; S.f.raise -= 1; S.f.raised = 1; }, go: 'hub' }))
  }),
  shoe_ok: S => {
    S.f.shoe = 'ok';
    return {
      plate: 'valley', beats: [[
        N(S.f.worksTools ? `You lift the hoof into your lap. Two nails gone and a third backing out. You draw the old ones and drive Carl Vance's square nails where the wall is sound and clinch them over with his hammer.` : `You lift the hoof into your lap. Two nails gone and a third backing out. You have no nails. You draw the good ones and reset them where the wall is sound and clinch them over with the back of the hoof knife and a river stone.`),
        V('hand', 0, `It will hold to Corley. That's one true thing done today and it's not noon.`),
        S.f.wrenAlong ? P('WREN', `He let you. He bit the Commission man.`) : N(`The mule sets the foot down and tries it and looks at nothing.`)
      ]], opts: [{ t: 'Go on.', act: 1, go: 'hub' }]
    };
  },
  shoe_bad: S => {
    S.f.shoe = 'bad';
    return {
      plate: 'valley', beats: [[
        N(`You lift the hoof into your lap. The mule lets you get settled. Then it takes the foot back and puts it down on yours.`),
        V('hand', 0, `Eleven years of pens.`),
        N(`You stand in the street on one leg. The shoe is as loose as it was. The mule looks at the dam.`),
        S.f.wrenAlong ? P('WREN', `He done that to the Commission man too.`) : null
      ]], opts: [{ t: 'Go on, limping.', act: 1, go: 'hub' }]
    };
  },

  purdy: S => {
    S.f.purdy = 1;
    return {
      plate: 'purdy_in',
      beats: [[
        N(`You go in at the nearest open door. The room is bare to the boards and the boards are swept. There is a pale square on the wall where a picture hung. The flue hole is stuffed with a rag against weather that will not come.`),
        N(`On the door frame is a ladder of pencil marks with initials and dates. The lowest is at your knee.`),
        S.f.wrenAlong ? P('WREN', `This is Purdys'. That one's Addie. She was taller than me by that much.`) : null,
        S.f.wrenAlong ? N(`She stands against the frame under the mark. She has gained on it.`) : null,
        V('ledger', 0, `Six children by the marks. Counted in April by another man in another book. They are no concern of yours.`),
        V('ear', 0, `Somebody measured the smallest one twice in the one month.`),
        V('ledger', 2, `That is not a thing I can enter.`),
        V('hand', 2, `Nobody asked you to enter it.`)
      ]],
      opts: [
        S.f.wrenAlong ? { t: 'Take the pencil from the ledger and mark her height.', act: 1, do: S => { S.f.marked = 1; }, go: 'purdy_mark' } : null,
        { t: 'Go out. Leave the door as it was.', act: 1, go: 'hub' }
      ].filter(Boolean)
    };
  },
  purdy_mark: S => ({
    plate: 'purdy_in',
    beats: [[
      N(`You lay the pencil flat on her head and draw the line. She steps out from under it and looks.`),
      P('WREN', `Put the day.`),
      N(`You put the day.`),
      P('WREN', `Put who.`),
      N(`You ask her which name.`),
      P('WREN', `Just Wren.`),
      V('river', 2, `The line will stay on the frame after the door has come off it.`)
    ]],
    opts: [{ t: 'Go out. Leave the door as it was.', act: 1, go: 'hub' }]
  }),

  /* ---------------- THE STORE ---------------- */
  store_in: S => ({
    plate: 'store_in',
    beats: [[
      N(`Inside the shelves are near bare. A woman stands on a crate taking down the last of the lamp chimneys and wrapping each one in newspaper. She doesnt turn around.`),
      P('HALLIE', `Coffee's on the stove. I aint selling it. I quit selling Tuesday. Take what you want, there's not much left that's worth the carrying.`),
      V('hand', 2, `Tin cup on a nail by the stove. The coffee has been boiled twice. Drink it anyway.`),
      N(`You set the ledger on the counter and open it. The instructions are pasted inside the cover. You have read them in four other valleys. Tucked in the back is a voucher for thirty dollars which is your wage.`),
      FORM(`SCHEDULE C. ENUMERATION OF SOULS.\n\n1. The Enumerator shall enter every person resident in the valley on the day of the count.\n2. Each person entered is allowed forty dollars for removal.\n3. Each person entered shall be removed above the waterline by the constabulary before the gates are closed.\n4. A person not entered is not resident. The Commission has no concern with him.\n5. The gates close at dusk.`)
    ], [
      N(`You draw the cork from the ink. She hears the cork and comes down off the crate.`),
      P('HALLIE', `Hallie Oake. Sixty-one. Born in that back room and I'd as soon you wrote that too but I dont guess there's a column for it.`)
    ]],
    opts: [{ t: 'Write her down.', act: 1, do: S => write(S, 'hallie', 'Hallie Oake', 61, 'storekeeper'), go: 'store_in2' }]
  }),
  store_in2: S => ({
    plate: 'store_in',
    beats: [[
      N(`There is not a column for it.`),
      ENTRY('hallie'),
      P('HALLIE', `And the girl. Wren Oake. Nine.`),
      V('ear', 2, `She watched the pen when she said Oake.`),
      N(`From the doorway behind you:`),
      P('WREN', `It's Tolliver.`),
      P('HALLIE', `Hush.`),
      P('WREN', `Well it is.`)
    ]],
    opts: [{ t: 'Which is it.', go: 'store_wren' }]
  }),
  store_wren: S => ({
    plate: 'store_in',
    beats: [[
      P('HALLIE', `Her people went out in April with a wagon and six children and when they got to the top of the grade they had five. I dont say they meant it. Nobody come back.`),
      P('HALLIE', `You write Tolliver and Dace wants an undertaking for her. Then the county wants me before a magistrate, and till he sits they keep her at the home in Ansel. I seen what they ask a woman to prove. You write Oake and nobody asks.`),
      V('ledger', 0, `The instruction says every person resident. It doesnt say under what name. That's a thin place in the paper and you know it's thin.`),
      V('preacher', 2, `A false name in the book of the living. A small one. They are always small at first.`)
    ]],
    opts: STORY._wrenOpts(S)
  }),
  _wrenOpts: S => [
    { t: 'Write: Wren Oake, 9.', act: 1, do: S => { write(S, 'wren', 'Wren Oake', 9, 'granddaughter of H. Oake', false); S.f.wren = 'oake'; }, go: 'store_wren_oake' },
    { t: 'Write: Wren Tolliver, 9.', act: 1, do: S => { write(S, 'wren', 'Wren Tolliver', 9, 'no kin present'); S.f.wren = 'tolliver'; }, go: 'store_wren_tol' },
    { t: 'Wren. What do you say.', check: { id: 'askwren', v: 'ear', dc: 8, pass: 'store_wren_ask_ok', fail: 'store_wren_ask_no' } }
  ],
  store_wren_ask_ok: S => ({
    plate: 'store_in',
    beats: [[
      N(`You dont look at the woman when you ask it. You look at the girl and you wait.`),
      P('WREN', `I dont care what I'm called. I aint going to Ansel. Addie Purdy went to Ansel and when we seen her again they'd cut her hair off.`),
      V('ear', 0, `She knows a girl who went there. Hallie never said that name to you.`)
    ]],
    opts: STORY._wrenOpts(S).slice(0, 2)
  }),
  store_wren_ask_no: S => ({
    plate: 'store_in',
    beats: [[
      N(`The girl shrugs and eats a peach.`),
      V('ear', 0, `Nine years old and asked in front of the woman who feeds her. She's not going to hand you anything.`)
    ]],
    opts: STORY._wrenOpts(S).slice(0, 2)
  }),
  store_wren_oake: S => ({
    plate: 'store_in',
    beats: [[
      ENTRY('wren'),
      N(`The woman watches the pen. When it stops she lets her breath go.`),
      P('HALLIE', `I'll not thank you. If I thank you it's a thing we did.`)
    ]],
    opts: [{ t: 'Blot the line.', act: 1, go: 'store_talk' }]
  }),
  store_wren_tol: S => ({
    plate: 'store_in',
    beats: [[
      ENTRY('wren'),
      P('HALLIE', `Well. It's her name.`),
      N(`She goes back to the chimneys. She wraps one and then stands holding it.`),
      P('WREN', `Told you.`)
    ]],
    opts: [{ t: 'Blot the line.', act: 1, go: 'store_talk' }]
  }),
  store_talk: S => {
    const o = [];
    const a = S.f;
    if (!a.told) o.push({ t: 'Who else is left in the valley.', go: 'store_who' });
    if (a.told && !a.knowLyle) {
      if (a.slip) o.push({ t: 'You answered about the mill before I asked about the mill.', go: 'store_mill' });
      else o.push({ t: `Tell me again who's across the river.`, check: { id: 'hallie_mill', v: 'ear', dc: 9, pass: 'store_mill', fail: 'store_mill_no' } });
    }
    if (!a.qSwept) o.push({ t: 'Somebody swept the empty houses.', go: 'store_swept' });
    if (!a.qCorley) o.push({ t: 'What will you do in Corley.', go: 'store_corley' });
    if (!a.qDam) o.push({ t: 'What do they say the dam is for.', go: 'store_dam' });
    if (a.told) o.push({ t: 'Cork the ink and go.', act: 1, go: a.wrenAsked ? 'store_exit' : 'store_leave' });
    return { plate: 'store_in', beats: [[N(a.talked ? `She wraps another chimney.` : `She pours you the coffee herself after all and stands with her arms folded while you drink it.`)]], opts: (a.talked = 1, o) };
  },
  store_who: S => {
    S.f.told = 1;
    if (S.v.dog >= 2 || S.v.ledger >= 2) S.f.slip = 1;
    return {
      plate: 'store_in',
      beats: [[
        P('HALLIE', `Odile Vance is up at the churchyard, and you go easy up there. Abel Tarr's down at the ferry and you wont move him. That's the town. There's nobody across the river. Mill's been shut since spring.`),
        V('dog', 2, `You didnt ask her about across the river.`),
        V('ledger', 2, `One smoke. Two women, a child, an old man. Then who is she baking for. There are four loaf tins drying on that sill.`)
      ]],
      opts: [{ t: 'Nod.', act: 1, go: 'store_talk' }]
    };
  },
  store_mill: S => {
    S.f.knowMill = 1; S.f.knowLyle = 1;
    return {
      plate: 'store_in',
      beats: [[
        N(`She puts the lamp chimney down on the counter. She does it slowly so it wont ring.`),
        P('HALLIE', `It's my sister's boy. Lyle. He come in the night nine days back and I put him in the mill. I been sending bread over with Abel.`),
        P('HALLIE', `He done something in Ansel. I never asked what. I didnt want to have been told.`),
        P('HALLIE', `You could just not go over there. The book says resident. He aint resident. He's only there.`),
        V('ledger', 0, `Nine days. The instruction gives no term for resident. You have seen men counted on less.`)
      ]],
      opts: [{ t: 'Say nothing to that.', act: 1, go: 'store_talk' }]
    };
  },
  store_mill_no: S => ({
    plate: 'store_in',
    beats: [[
      P('HALLIE', `There's a mill across the river. It's shut. I said so.`),
      N(`She wraps a chimney and sets it in the crate with the others. That is all you will get here.`)
    ]],
    opts: [{ t: 'Let it lie.', act: 1, go: 'store_talk' }]
  }),
  store_swept: S => {
    S.f.qSwept = 1;
    return {
      plate: 'store_in', beats: [[
        P('HALLIE', `Somebody ought to.`),
        N(`You ask her why.`),
        P('HALLIE', `You dont leave a place dirty.`),
        V('river', 2, `She swept them for me. I will be in every one of those rooms by Thursday. I have no feeling about floors.`)
      ]], opts: [{ t: 'Drink the coffee.', act: 1, go: 'store_talk' }]
    };
  },
  store_corley: S => {
    S.f.qCorley = 1;
    return {
      plate: 'store_in', beats: [[
        P('HALLIE', `Sit in my sister's kitchen and be told where things are kept.`),
        V('ear', 2, `Sixty-one years she has known where everything was kept.`)
      ]], opts: [{ t: 'Drink the coffee.', act: 1, go: 'store_talk' }]
    };
  },
  store_dam: S => {
    S.f.qDam = 1;
    return {
      plate: 'store_in', beats: [[
        P('HALLIE', `Lights for the cities. I been to a city once. They had enough lights.`)
      ]], opts: [{ t: 'Drink the coffee.', act: 1, go: 'store_talk' }]
    };
  },
  store_leave: S => {
    S.f.wrenAsked = 1;
    return {
      plate: 'store_in',
      beats: [[
        N(`You cork the ink. The girl is standing at your elbow.`),
        P('WREN', `I can carry that.`),
        P('HALLIE', `She'll follow you anyhow. She's like a burr.`)
      ]],
      opts: [
        { t: 'Come on then. Carry it level.', do: S => { S.f.wrenAlong = 1; }, go: 'store_exit' },
        { t: 'Stay with your granny.', go: 'store_stay' }
      ]
    };
  },
  store_stay: S => ({
    plate: 'store_in', beats: [[P('WREN', `She aint my granny. I just call her it.`), N(`She goes back out to the bench and the peaches.`)]],
    opts: [{ t: 'Go out.', act: 1, go: 'store_exit' }]
  }),
  store_exit: S => {
    if (!S.f.done_store) { S.f.done_store = 1; S.t = Math.max(S.t, 1); S.f.raise = (S.f.raise || 0) + 1; }
    return STORY.hub(S);
  },
  store_back: S => ({
    plate: 'store_in',
    beats: [[
      N(`The crate of lamp chimneys is full and nailed shut. She is sitting on it.`),
      P('HALLIE', S.f.done_church && S.f.done_ferry ? `You seen them all then. Go on up. Dont stand in here on my account.` : `You aint done. I can see the dam from here and I can see you.`),
      !S.f.wrenAlong && !S.f.done_ferry ? P('WREN', `I can still carry the ink.`) : null
    ]],
    opts: [
      (!S.f.wrenAlong && !S.f.done_ferry) ? { t: 'Come on then. Carry it level.', do: S => { S.f.wrenAlong = 1; }, go: 'hub' } : null,
      (S.f.told && !S.f.knowLyle && S.f.slip) ? { t: 'You answered about the mill before I asked about the mill.', go: 'store_mill' } : null,
      { t: 'Go out.', act: 1, go: 'hub' }
    ].filter(Boolean)
  }),

  /* ---------------- THE CHURCHYARD ---------------- */
  church: S => ({
    plate: 'church',
    beats: [[
      N(`The church stands on the one rise in the valley floor and it will be the last roof to go under. The bell is gone from it already. In the yard a woman is waist deep in a hole with a shovel, and on the grass beside the hole a wooden marker lies where she has pulled it and laid it flat.`),
      S.f.wrenAlong ? P('WREN', `That's Miz Vance. That's Tommy she's digging. He had the fever.`) : null,
      N(`She goes on digging while you come up. By the spoil she has been at it since before light. Under the first foot the ground is clay and she is cutting it out in pieces the size of loaves.`),
      P('ODILE', `You're the count.`)
    ]],
    opts: [{ t: 'I am.', go: 'church2' }]
  }),
  church2: S => ({
    plate: 'church',
    beats: [[
      P('ODILE', `Odile Vance. Twenty-six. My husband is Carl Vance and he's on the dam works since winter. He's on their book up there. Dont put him on yours.`)
    ]],
    opts: [{ t: 'Write her down.', act: 1, do: S => write(S, 'odile', 'Odile Vance', 26, 'husband at the works'), go: 'church3' }]
  }),
  church3: S => ({
    plate: (S.f.metOdile = 1, 'church'),
    beats: [[
      ENTRY('odile'),
      P('ODILE', `And Thomas Vance. Four.`),
      N(`She has stopped digging. She is looking at the marker on the grass.`)
    ]],
    opts: [{ t: 'Where is he.', go: 'church4' }, { t: `That's the boy in the ground.`, go: 'church4' }]
  }),
  church4: S => ({
    plate: 'church',
    beats: [[
      P('ODILE', `He's right here. He's resident. He's been resident since March and he aint missed a day.`),
      V('preacher', 2, `If the dead are resident you have missed most of this town.`),
      V('ear', 2, `Dont say that to her.`)
    ], [
      P('ODILE', `There was a paper nailed up at the store in June about moving graves. You had to put your name to it by the first of July. I cant read. Nobody said.`),
      P('ODILE', `Now the Commission man says the list is shut and what's in the ground stays in the ground. The carter at Corley wants thirty dollars to haul a box that size up the grade and bury it at the top. I got four.`),
      P('ODILE', `So you write him. Thomas Vance, four. That's forty dollars. Thirty for the carter and ten for a stone.`)
    ]],
    opts: STORY._odileOpts(S)
  }),
  _odileOpts: S => {
    const o = [];
    const settled = S.f.odile && S.f.odile !== 'refused';
    if (!settled) {
      o.push({ t: 'Write: Thomas Vance, 4.', act: 1, do: S => { write(S, 'thomas', 'Thomas Vance', 4, 'son of O. Vance', false); S.f.odile = 'wrote'; }, go: 'church_wrote' });
      o.push({ t: 'Look in the instructions for what they say about graves.', act: 1, check: { id: 'sec14', v: 'ledger', dc: 11, pass: 'church_sec14', fail: 'church_sec14_no' } });
      if (S.money >= 30) o.push({ t: 'Give her your voucher. Thirty dollars, payable to bearer.', act: 1, do: S => { S.money = 0; S.f.odile = 'voucher'; }, go: 'church_voucher' });
    }
    if (!S.f.dug && S.f.odile !== 'mule') o.push({ t: S.f.worksTools ? 'Get down in the hole with the shovel from the works.' : 'Get down in the hole and dig.', act: 1, check: { id: 'dig', v: 'hand', dc: 8, red: 1, mods: [['A sound shovel from the works', 2, !!S.f.worksTools]], pass: 'church_dig', fail: 'church_dig_no' } });
    if (!settled && S.f.dug === 'yes' && S.f.shoe === 'ok') o.push({ t: 'Lash the box on the mule. You are going up to Corley regardless.', act: 1, do: S => { S.f.odile = 'mule'; }, go: 'church_mule' });
    if (!S.f.odile) o.push({ t: 'I cant write the dead.', do: S => { S.f.odile = 'refused'; }, go: 'church_refuse' });
    o.push(S.f.odile ? { t: 'Go down off the rise.', act: 1, go: 'church_exit' } : { t: 'Tell her you will come back.', act: 1, go: 'hub' });
    return o;
  },
  church_wrote: S => ({
    plate: 'church',
    beats: [[
      ENTRY('thomas'),
      N(`You write it under hers. The ink takes the same as it did for the living.`),
      P('ODILE', `Read it to me.`),
      N(`You read it to her. Thomas Vance. Four. Son of O. Vance.`),
      P('ODILE', `That's right. That's him.`),
      N(`She takes up the shovel.`),
      V('ledger', 2, `The sergeant carried the fever returns out of this valley in March. If he reads as well as he rides you'll answer for that line.`)
    ]],
    opts: [{ t: 'Leave her to it.', act: 1, go: 'church_exit' }]
  }),
  church_sec14: S => {
    S.f.odile = 'cert';
    return {
      plate: 'church',
      beats: [[
        N(`You sit on the church step and go through the back of the book where nobody goes. Section fourteen. Interments.`),
        FORM(`14(c). Where notice was not had by reason of infirmity or want of letters, the Enumerator may certify the claim late upon his own hand, and the remains shall be removed at the charge of the Commission.`),
        V('ledger', 0, `Somebody put it there. You have carried it through four valleys and never used it.`),
        N(`You write the certificate on the facing page and sign it and read it out to her. Two men and a wagon, at the Commission's cost. A plot at Corley. She listens to all of it.`),
        P('ODILE', `It was in the book the whole time.`),
        N(`You tell her it was.`),
        P('ODILE', `And the man they sent in June never said.`),
        N(`She takes up the shovel. She is not going to stop digging on the strength of a paper and you dont ask her to.`)
      ]],
      opts: [{ t: 'Leave her to it.', act: 1, go: 'church_exit' }]
    };
  },
  church_sec14_no: S => ({
    plate: 'church',
    beats: [[
      N(`You sit on the church step and go through the back of the book. There is a section on interments. You read it twice. Something about notice. Something about the first of July.`),
      V('ledger', 0, `I cant make it hold still. If you write what you cant swear to they will void the page and everyone on it.`),
      N(`She has watched you read. She knows what a man looks like who has not found it.`)
    ]],
    opts: STORY._odileOpts(S)
  }),
  church_voucher: S => ({
    plate: 'church',
    beats: [[
      N(`You take the voucher from the back of the ledger and hold it down to her. She doesnt reach for it.`),
      P('ODILE', `I dont take from strangers.`),
      N(`You tell her it's not from you. It's from the Commission. They just dont know it yet.`),
      N(`She looks at the paper a while. Then she wipes her hand on her skirt and takes it by the corner and puts it inside her dress.`),
      P('ODILE', `What does it say on it.`),
      N(`Thirty dollars. Pay to the bearer.`),
      P('ODILE', `Bearer. That's me.`),
      V('ledger', 0, `That was your wage for this valley. I only note it.`)
    ]],
    opts: [{ t: 'Leave her to it.', act: 1, go: 'church_exit' }]
  }),
  church_dig: S => {
    S.f.dug = 'yes';
    return {
      plate: 'church',
      beats: [[
        N(S.f.worksTools ? `You take off your coat and get down in the hole with the works shovel. She looks at the handle. She knows whose hands have been on it. She doesnt say anything and she doesnt move over much.` : `You take off your coat and get down in the hole. She doesnt say anything and she doesnt move over much. You take the shovel and she takes the bar.`),
        V('hand', 0, `Cut the clay square. Lift with the legs. This you know. It's the one thing today nobody can argue with.`),
        S.f.wrenAlong ? N(`The girl sits on the spoil heap holding the ink in both hands, level, as she was told.`) : null
      ], [
        N(`In an hour the blade knocks on wood. You clear it with your hands, the two of you. A box of pine boards and it is sound.`),
        N(`You lift it out between you. It weighs almost nothing. That is the part your hands had not got ready for.`),
        P('ODILE', `His daddy built that. He planed it inside. He said no splinters.`),
        N(`She sets it on the grass by the marker and stands looking at you. The box is out of the ground and it is still at the bottom of the valley.`),
        S.f.shoe === 'ok' ? V('hand', 0, `That would ride on a mule. Yours is shod for it now.`) : V('hand', 0, `That would ride on a mule. Not on yours. Not on that off hind shoe.`)
      ]],
      opts: STORY._odileOpts(S)
    };
  },
  church_dig_no: S => {
    S.f.dug = S.f.worksTools ? 'beat' : 'broke';
    return {
      plate: 'church',
      beats: [S.f.worksTools ? [
        N(`You take off your coat and get down in the hole with the works shovel. The clay is like saddle leather. In an hour you have blisters broken on both hands and the hole is no deeper than a man could spit.`),
        V('hand', 0, `Eleven years of pens.`),
        N(`She takes the shovel out of your hands. She does it the way you would take a knife from a child. She goes on with it herself.`),
        P('ODILE', `That's Carl's. I know the handle.`)
      ] : [
        N(`You take off your coat and get down in the hole and she hands you the shovel. The clay turns the blade. You put your weight on it and the handle goes at the neck.`),
        N(`You stand there holding a stick.`),
        P('ODILE', `That was the only shovel in Tenmile.`),
        V('hand', 0, `Eleven years of pens.`),
        N(`She fishes the blade out of the hole and goes on with it short, on her knees. You climb out and stand there with clay to the elbows.`)
      ]],
      opts: STORY._odileOpts(S)
    };
  },
  church_mule: S => ({
    plate: 'church',
    beats: [[
      N(`You bring the mule up to the yard fence. It smells the clay on the box and lays back its ears and you stand with a hand on its neck until it has thought better of it.`),
      N(`You lash the box on the packsaddle with the spare halter rope, high and level.`),
      V('hand', 0, `It wont shift on the grade. And the shoe will carry it, now it's been set.`),
      P('ODILE', `You dont know us.`),
      N(`You say you are going up to Corley regardless. You will leave him with the sexton there and he can go in the ground when she comes.`),
      P('ODILE', `I'll find it. You tell the man I'll find it.`),
      S.f.wrenAlong ? P('WREN', `Is Tommy coming with us.`) : null,
      S.f.wrenAlong ? N(`You tell her he is. She moves around to the other side of the mule and walks there.`) : null
    ]],
    opts: [{ t: 'Lead the mule down off the rise.', act: 1, go: 'church_exit' }]
  }),
  church_return: S => ({
    plate: 'church',
    beats: [[
      N(S.f.dug === 'yes' ? `The box is on the grass where you set it. She is sitting beside it with her hand flat on the lid.` : `She is where you left her, and deeper.`),
      P('ODILE', `Well.`),
      (S.f.metCarl && !S.f.toldOdileCarl) ? N(`You tell her you have been up to the works and seen her husband.`) : null,
      (S.f.metCarl && !S.f.toldOdileCarl) ? P('ODILE', `Is he eating.`) : null,
      (S.f.metCarl && !S.f.toldOdileCarl) ? N(`You say you didnt see him eat. You say he asked whether she had got down to the boy.`) : null,
      (S.f.metCarl && !S.f.toldOdileCarl) ? P('ODILE', (S.f.toldOdileCarl = 1, `He'd ask that. He wouldnt ask was I tired.`)) : null
    ]],
    opts: STORY._odileOpts(S)
  }),
  church_refuse: S => ({
    plate: 'church',
    beats: [[
      N(`She looks at you from the hole. She is not angry. She is working something out.`),
      P('ODILE', `You write down who's here. And then they pay for who's wrote down. And he's here and you wont write it.`),
      P('ODILE', `Then what are you for.`),
      N(`She doesnt wait on an answer. She takes up the shovel.`),
      V('river', 2, `The clay will settle back over it. Then ninety feet of me. She wont reach him after that.`)
    ]],
    opts: [{ t: 'Go down off the rise.', act: 1, go: 'church_exit' }]
  }),
  church_exit: S => {
    if (!S.f.odile) return STORY.hub(S);
    if (!S.f.done_church) { S.f.done_church = 1; S.t = Math.min(4, S.t + 1); if (S.f.done_ferry) S.f.raise = (S.f.raise || 0) + 1; }
    return STORY.hub(S);
  },
  church_back: S => ({
    plate: 'church',
    beats: [[
      N(S.f.odile === 'mule' ? `She is filling the hole back in. You dont know why and you dont ask.` : S.f.dug === 'yes' ? `The box is on the grass with her shawl laid over it. She is sitting by it.` : S.f.dug === 'beat' ? `She is still digging, with her husband's shovel. The hole is deeper. She doesnt look up.` : `She is still digging. The hole is deeper and so is the heap. She doesnt look up.`),
      S.f.odile === 'refused' ? P('ODILE', `You come to tell me different.`) : null,
      (S.f.metCarl && !S.f.toldOdileCarl) ? N(`You tell her you have been up to the works and seen her husband.`) : null,
      (S.f.metCarl && !S.f.toldOdileCarl) ? P('ODILE', `Is he eating.`) : null,
      (S.f.metCarl && !S.f.toldOdileCarl) ? N(`You say you didnt see him eat. You say he asked whether she had got down to the boy.`) : null,
      (S.f.metCarl && !S.f.toldOdileCarl) ? P('ODILE', (S.f.toldOdileCarl = 1, `He'd ask that. He wouldnt ask was I tired.`)) : null
    ]],
    opts: STORY._odileOpts(S).map(o => o.go === 'church_exit' ? Object.assign({}, o, { go: 'hub' }) : o)
  }),
  church_sec14_back: S => ({
    plate: 'church',
    beats: [[N(`You read the section again on the church step. It is no clearer than it was.`)]],
    opts: STORY._odileOpts(S)
  }),

  /* ---------------- THE FERRY ---------------- */
  ferry: S => ({
    plate: 'ferry',
    beats: [[
      N(`The river has gone slack. They have had the gates part shut a month to try the works and the current has gone out of it. The water stands over the lower landing brown and without push, and along the bank it has left a line of scum and cane trash with the track of every bird in it.`),
      N(`The ferry is a flat scow on a cable. An old man sits on the deck of it with a length of rope in his hands, splicing an eye into the end. Behind him his house stands ten feet above the water with a chair on the porch faced at the river.`),
      S.f.wrenAlong ? P('WREN', `Mr Tarr this is the man that counts.`) : null,
      P('TARR', `I know what he is. He can save his ink.`)
    ], [
      P('TARR', `Abel Tarr. Seventy and some. I quit keeping it. I'm telling you that to be civil. I aint asking in.`),
      P('TARR', `I run this crossing fifty-one years. My daddy strung that cable. I been over this river more times than you have drawn breath and I never been across anything else.`),
      P('TARR', `You put me in that book and Dace's boys come down here and carry me up the grade like a sack of meal. I seen it done to the Purdys. Then I sit in a room in Corley with a window that looks on a wall.`),
      P('TARR', `You leave me out and I aint here. Book says so. Man that aint here cant be moved.`)
    ]],
    opts: [{ t: 'The water will come over that house.', go: 'ferry2' }, { t: 'What is the rope for.', go: 'ferry_rope' }]
  }),
  ferry_rope: S => ({
    plate: 'ferry',
    beats: [[
      P('TARR', `It's for nothing. It's a splice. I'd as soon my hands had something.`),
      V('hand', 2, `That's a long splice and he's doing it by feel. Dont watch a man work and then tell him his business.`)
    ]],
    opts: [{ t: 'The water will come over that house.', go: 'ferry2' }]
  }),
  ferry2: S => ({
    plate: 'ferry',
    beats: [[
      P('TARR', `I know what water does. I worked for it all my life. I reckon it can have me. It's owed.`),
      V('river', 2, `I am not owed. I keep no accounts. That is his word for it. I will take him the same as I take the chair.`),
      V('ear', 2, `He's not grieving. Listen to him. He's finished. From across a room the two sound alike.`),
      V('preacher', 2, `Finished is a word. I have talked men out of words.`),
      (S.v.ear >= 2 && S.v.preacher >= 2) ? V('ear', 0, `You have talked men into them.`) : null
    ], [
      N(`He draws the splice tight with his teeth and looks at you for the first time.`),
      P('TARR', `You done this in other valleys. Somebody has asked you this before.`)
    ]],
    opts: [
      { t: 'A man at Sabra. I left him off the book. They found him in April in a tree.', do: S => { S.f.past = 'left'; }, go: 'ferry_past' },
      { t: 'A woman at Sabra. I wrote her down. They carried her out. She was dead in the county home by Christmas.', do: S => { S.f.past = 'wrote'; }, go: 'ferry_past' },
      { t: 'Nobody asked.', do: S => { S.f.past = 'none'; }, go: 'ferry_past' }
    ]
  }),
  ferry_past: S => ({
    plate: 'ferry',
    beats: [[
      S.f.past === 'left' ? P('TARR', `And here you are with the book again.`) : S.f.past === 'wrote' ? P('TARR', `Then you know what the room is.`) : P('TARR', `Then you been lucky or you been deaf.`),
      S.f.past === 'none' ? V('dog', 0, `He knows that for a lie. He has let it go by. Old men do.`) : null,
      N(`You shift the book on your knee. A folded paper slips from the back cover and catches against the binding.`),
      N(`The blue stamp on it says SABRA. Under the stamp your signature has run where the paper once got wet.`),
      V('ledger', 0, `The removal receipt. It belongs with the return. You never filed it.`),
      V('hand', 2, `You have folded it along the one crease until it is near through.`),
      S.f.past === 'none' ? P('TARR', `That one of your other valleys.`) : P('TARR', `You ever go back.`)
    ]],
    opts: [
      { t: 'No.', go: 'sabra_no' },
      { t: 'There was nowhere to go back to.', go: 'sabra_nowhere' },
      { t: 'Put the paper away.', act: 1, go: 'sabra_shut' }
    ]
  }),
  sabra_no: S => ({
    plate: 'ferry',
    beats: [[
      S.f.past === 'left' ? P('TARR', `Who told you about the tree.`) : S.f.past === 'wrote' ? P('TARR', `Who told you she was dead.`) : P('TARR', `You hear what become of them.`),
      N(`You tell him it came in a return.`),
      P('TARR', `Same as you'll send on me.`),
      V('ledger', 0, `A return is evidence. A man cannot stand in every place afterward.`),
      V('ear', 0, `He asked did you stand in one.`),
      V('preacher', 2, `Tell him you would do it different now.`),
      V('dog', 0, `You dont know that.`)
    ]],
    opts: [
      { t: 'I dont know what I would do different.', do: S => { S.f.sabraPlain = 1; }, go: 'sabra_not_him' },
      { t: 'I would do it different now.', go: 'sabra_different' },
      { t: 'Fold the receipt.', act: 1, go: 'sabra_address' }
    ]
  }),
  sabra_different: S => ({
    plate: 'ferry',
    beats: [[
      P('TARR', `Would you.`),
      N(`He looks at the book open on your knee, at the line where his name would go.`),
      P('TARR', `Different which way.`),
      N(`You find you cannot tell him.`),
      V('preacher', 0, `It was the right thing to say.`),
      V('ear', 0, `It was a thing to say.`)
    ]],
    opts: [{ t: 'Fold the receipt.', act: 1, go: 'sabra_address' }]
  }),
  sabra_nowhere: S => ({
    plate: 'ferry',
    beats: [[
      P('TARR', `I never asked about the valley.`),
      N(`The paper lies across the open page. You put it back under the cover.`),
      V('ledger', 0, `Your work there was finished.`),
      V('ear', 0, `That's what he is asking you about.`)
    ]],
    opts: [
      { t: 'I never went to see any of them.', do: S => { S.f.sabraPlain = 1; }, go: 'sabra_not_him' },
      { t: 'Leave it there.', act: 1, go: 'sabra_address' }
    ]
  }),
  sabra_shut: S => ({
    plate: 'ferry',
    beats: [[
      N(`You put the paper back. He watches your hands do it.`),
      P('TARR', `All right.`),
      V('dog', 0, `He has let you keep it.`),
      V('preacher', 2, `He has taken silence for an answer.`),
      V('ear', 0, `It was one.`)
    ]],
    opts: [{ t: 'Go on.', act: 1, go: 'sabra_address' }]
  }),
  sabra_not_him: S => ({
    plate: 'ferry',
    beats: [[
      P('TARR', `Well. I aint the one at Sabra.`),
      N(`He lays the rope across his knee and picks a loose strand out of it with his thumbnail.`),
      P('TARR', `Dont do a thing to me on their account. Nor for me neither.`),
      V('ear', 0, `He hasnt told you to leave him. He has told you who you are talking to.`)
    ]],
    opts: [{ t: 'Let him work.', act: 1, go: 'sabra_address' }]
  }),
  sabra_address: S => ({
    plate: 'ferry',
    beats: [[N(`The loose strand comes free. He lays it on the deck. He doesnt drop it in the water.`)]],
    opts: [
      { t: 'If you went to Corley, where would a letter find you.', check: { id: 'tarr_address', v: 'ear', dc: 9, red: 1, mods: [['You gave him a plain answer about Sabra', 1, !!S.f.sabraPlain]], pass: 'sabra_address_yes', fail: 'sabra_address_no' } },
      { t: 'Open the book again.', act: 1, go: 'sabra_done' }
    ]
  }),
  sabra_address_yes: S => ({
    plate: 'ferry',
    beats: [[
      P('TARR', `Ruth Bell. Behind the forge. That's the room they found for me.`),
      N(`You write it on the back of the Sabra receipt.`),
      P('TARR', `I aint said I'm going.`),
      N(`You tell him you know it.`)
    ]],
    opts: [
      { t: 'If you are ever in that room I will come and see you in it.', do: S => { S.f.tarrAddress = 1; S.f.tarrVisit = 1; }, go: 'sabra_promise' },
      { t: 'Put the address away.', act: 1, do: S => { S.f.tarrAddress = 1; }, go: 'sabra_done' }
    ]
  }),
  sabra_address_no: S => ({
    plate: 'ferry',
    beats: [[
      P('TARR', `You got me in that room already.`),
      N(`You put the pen down.`),
      V('ear', 0, `You asked him for the address before he had agreed to have one.`)
    ]],
    opts: [{ t: 'Leave the question.', act: 1, go: 'sabra_done' }]
  }),
  sabra_promise: S => ({
    plate: 'ferry',
    beats: [[
      P('TARR', `Dont say it to get me up the hill.`),
      N(`You tell him it is not for that.`),
      P('TARR', `Then we'll see.`),
      V('ledger', 0, `There is no place on the return to enter a visit.`)
    ]],
    opts: [{ t: 'Open the book again.', act: 1, go: 'sabra_done' }]
  }),
  sabra_done: S => ({
    plate: 'ferry',
    beats: [[N(`The book lies open at the line where his name would go. He waits for you to decide what to do with it.`)]],
    opts: STORY._tarrOpts(S)
  }),
  _tarrOpts: S => {
    const o = [];
    const mods = [['The girl is standing there', 1, !!S.f.wrenAlong], ['You pulled his cable with him', 1, S.f.cable === 'ok']];
    const emods = mods.concat([['The river told you what to ask', 2, S.f.ice === 1]]);
    o.push({ t: 'Write: Abel Tarr, 70.', act: 1, do: S => { write(S, 'tarr', 'Abel Tarr', 70, 'ferryman'); S.f.tarr = 'wrote'; }, go: 'ferry_wrote' });
    o.push({ t: 'Close the book. Leave him off it.', act: 1, do: S => { S.f.tarr = 'off'; }, go: 'ferry_off' });
    o.push({ t: 'Tell him why a man walks up a hill.', check: { id: 'tarr_pr', v: 'preacher', dc: 12, red: 1, mods, pass: 'ferry_walk_pr', fail: 'ferry_walk_pr_no' } });
    o.push({ t: 'Ask him about the river. Then be quiet.', check: { id: 'tarr_ear', v: 'ear', dc: 11, red: 1, mods: emods, pass: 'ferry_walk_ear', fail: 'ferry_walk_ear_no' } });
    if (!S.f.ice) o.push({ t: 'Kneel and put your hand in the river.', act: 1, check: { id: 'ice', v: 'river', dc: 9, red: 1, pass: 'ferry_ice', fail: 'ferry_ice_no' } });
    if (!S.f.crossed) o.push({ t: 'Carry me over first. I have to see the far bank.', go: 'ferry_cross' });
    return o;
  },
  ferry_wrote: S => ({
    plate: 'ferry',
    beats: [[
      ENTRY('tarr'),
      N(`He watches you write it. He cant read it from there and he doesnt need to.`),
      P('TARR', `Well.`),
      N(`He lays the rope down on the deck in a coil and squares the coil with his foot.`),
      P('TARR', `I'll still carry you over if you're going. I aint quitting work on your account.`),
      S.f.wrenAlong ? P('WREN', `Are they going to carry him.`) : null,
      S.f.wrenAlong ? N(`You tell her yes. She looks at you a good while and then she looks at the ink.`) : null
    ]],
    opts: STORY._ferryAfter(S)
  }),
  ferry_off: S => ({
    plate: 'ferry',
    beats: [[
      N(`You close the book. He nods once. There is no thanks in it. It is how a man nods at a price.`),
      P('TARR', `When they ask you, you never seen me. I was gone when you come. The chair was empty.`),
      V('ledger', 0, `One soul short and you know which. The count is the count. It's the only thing I ever asked you to keep.`),
      V('river', 2, `Third morning. It will be at the porch boards by the third morning.`),
      S.f.wrenAlong ? P('WREN', `You didnt write him.`) : null,
      S.f.wrenAlong ? P('TARR', `He wrote me, child. You never seen. Go look at the mud, there's a heron been in it.`) : null
    ]],
    opts: STORY._ferryAfter(S)
  }),
  ferry_walk_pr: S => {
    S.f.tarr = 'walk'; write(S, 'tarr', 'Abel Tarr', 70, 'ferryman. Goes on his own feet');
    return {
      plate: 'ferry',
      beats: [[
        N(`You tell him that a man who is carried has been moved and a man who walks has gone. You tell him they are going to write this valley down as empty by dark and it wont be true if he is sitting in it, and nobody will know it wasnt true. You tell him the Commission would like nothing better than for the river to have done it.`),
        V('preacher', 0, `There. I didnt lie to him once. I want that noted.`),
        N(`He is quiet a long time.`),
        P('TARR', `I aint going to be carried.`),
        N(`You tell him then he had better walk.`),
        P('TARR', `You write that. In the book. Goes on his own feet.`),
        ENTRY('tarr')
      ]],
      opts: STORY._ferryAfter(S)
    };
  },
  ferry_walk_pr_no: S => ({
    plate: 'ferry',
    beats: [[
      N(`You tell him about dignity and about the years he has left and somewhere in it you hear yourself say the word opportunity.`),
      P('TARR', `You talk like the Commission man. He had a better coat.`),
      V('preacher', 0, `It was a sound argument. The man is stone.`),
      N(`He picks the rope back up. The book is still open on your knee.`)
    ]],
    opts: STORY._tarrOpts(S)
  }),
  ferry_walk_ear: S => {
    S.f.tarr = 'walk'; write(S, 'tarr', 'Abel Tarr', 70, 'ferryman. Goes on his own feet');
    return {
      plate: 'ferry',
      beats: [[
        N(`You dont argue it. You ask him what the river did in the worst year he saw.`),
        P('TARR', `Ninety-four. The ice.`),
        N(`He tells it. The ice came down in March in pans the size of a threshing floor and took the cable and the scow and the Purdys' barn. He names the men who strung the new cable and which of them drowned after and where. He tells you where the old ford was before there was a ferry, by a rock that isnt there now. It takes a while. You dont say anything.`)
      ], [
        N(`He stops.`),
        P('TARR', `There aint nobody knows that but me.`),
        V('ear', 0, `He heard it. Dont touch it. Let him pick it up himself.`),
        P('TARR', `If I go under with it then it never was a crossing. It's a place in a lake.`),
        N(`He looks at the rope in his hands and then lays it down.`),
        P('TARR', `I aint going to be carried. You write that. Goes on his own feet.`),
        ENTRY('tarr')
      ]],
      opts: STORY._ferryAfter(S)
    };
  },
  ferry_walk_ear_no: S => ({
    plate: 'ferry',
    beats: [[
      N(`You ask him about the river. He looks at you.`),
      P('TARR', `It's wet. It goes that way.`),
      V('ear', 0, `He heard you coming. You asked it like a man reaching for a latch.`),
      N(`The book is still open on your knee.`)
    ]],
    opts: STORY._tarrOpts(S)
  }),
  ferry_ice: S => {
    S.f.ice = 1;
    return {
      plate: 'ferry',
      beats: [[
        N(`You kneel on the deck and put your hand over the side. The water is colder than the day has any right to.`),
        V('river', 0, `Ask him about the ice. Ninety-four. I took his father's cable that year and the scow and three men. He has not told it in thirty years. It's in him yet like a stone in a boot.`),
        N(`You take your hand out and dry it on your coat. The old man is watching you.`),
        P('TARR', `You wont find nothing in there. I looked.`)
      ]],
      opts: STORY._tarrOpts(S)
    };
  },
  ferry_ice_no: S => {
    S.f.ice = 2;
    return {
      plate: 'ferry',
      beats: [[
        N(`You kneel on the deck and put your hand over the side. The water is cold. It goes between your fingers and on down the valley.`),
        V('river', 0, `You want something of me. Everyone in this valley has wanted something of me. I am water.`),
        P('TARR', `You wont find nothing in there. I looked.`)
      ]],
      opts: STORY._tarrOpts(S)
    };
  },
  _ferryAfter: S => {
    const o = [];
    if (!S.f.crossed) o.push({ t: 'Carry me over.', go: 'ferry_cross' });
    o.push({ t: 'Go back up to the street.', act: 1, go: 'ferry_exit' });
    return o;
  },
  ferry_cross: S => {
    S.f.crossed = 1; S.f.knowMill = 1;
    return {
      plate: 'ferry',
      beats: [[
        N(`He casts off without getting up. The scow swings out on its traveller and the current takes the upstream corner and the cable comes taut overhead and hums.`),
        P('TARR', `She wants pulling now. They took the push out of her.`),
        S.f.wrenAlong ? N(`The girl sits in the bow with the ink between her knees and trails her free hand in the river.`) : null,
        N(`He stands and takes the cable in both hands and leans.`)
      ]],
      opts: [
        { t: 'Take hold of the cable behind him.', act: 1, check: { id: 'cable', v: 'hand', dc: 8, red: 1, pass: 'ferry_cable', fail: 'ferry_cable_no' } },
        { t: 'Stand clear and let him work.', act: 1, go: 'ferry_far' }
      ]
    };
  },
  ferry_cable: S => {
    S.f.cable = 'ok';
    return {
      plate: 'ferry', beats: [[
        N(`You take hold behind him and lean when he leans. The wire is cold and it has a grease on it older than you are. The scow walks out into the river.`),
        V('hand', 0, `Hand over hand. Dont snatch at it. There.`),
        P('TARR', `You've pulled rope.`),
        N(`It's the first thing he has said to you that was not a warning.`)
      ]], opts: [{ t: 'Land on the far bank.', act: 1, go: 'ferry_far' }]
    };
  },
  ferry_cable_no: S => {
    S.f.cable = 'bad';
    return {
      plate: 'ferry', beats: [[
        N(`You take hold behind him. There is a broken strand in the wire and it opens your palm from the heel to the first finger.`),
        V('hand', 0, `You held it like a pen.`),
        P('TARR', `There's a meathook in her about there. I'd have said.`),
        N(`You stand clear with your hand shut on your handkerchief and he takes the scow over alone as he has every other day.`)
      ]], opts: [{ t: 'Land on the far bank.', act: 1, go: 'ferry_far' }]
    };
  },
  ferry_far: S => ({
    plate: 'ferry',
    beats: [[
      N(`The scow grounds in the mud of the far landing. A path goes up through dead cane toward a stone building with a wheel.`),
      P('TARR', `I carried a man over nine nights back and I aint carried him home. Hallie sends him bread. I never asked.`),
      P('TARR', `He's got a pistol. I seen the shape of it in his coat. You do what you want with that.`),
      V('dog', 2, `There he is. That's who was watching from the grade this morning. I told you.`)
    ]],
    opts: [
      { t: 'Go up to the mill.', act: 1, go: S.f.lyle ? 'mill_back' : 'mill' },
      { t: 'Have him carry you back.', act: 1, go: 'ferry_return' }
    ]
  }),
  ferry_return: S => ({
    plate: 'ferry',
    beats: [[
      N(`He takes you back over. The cable hums. On the home bank he makes the scow fast with two turns and sits down where he was.`),
      !S.f.tarr ? P('TARR', `Well. You seen the far bank. You still got that book open.`) : null
    ]],
    opts: !S.f.tarr ? STORY._tarrOpts(S) : [{ t: 'Go back up to the street.', act: 1, go: 'ferry_exit' }]
  }),
  ferry_exit: S => {
    if (!S.f.done_ferry) { S.f.done_ferry = 1; S.t = Math.min(4, S.t + 1); if (S.f.done_church) S.f.raise = (S.f.raise || 0) + 1; }
    return STORY.hub(S);
  },
  ferry_back: S => ({
    plate: 'ferry',
    beats: [[
      S.f.tarr === 'walk' ? N(`He has the ferry bell down off its post and is wrapping it in a shirt.`) : S.f.tarr === 'off' ? N(`He is in the chair on the porch. He doesnt look at you. He never seen you.`) : N(`He is on the deck of the scow with the rope.`),
      S.f.tarr === 'walk' ? P('TARR', `Fifty-one years I rung that for fog. I aint leaving it for the carp.`) : null
    ]],
    opts: [
      (S.f.tarr !== 'off') ? { t: 'Carry me over.', go: 'ferry_cross2' } : null,
      { t: 'Go back up to the street.', act: 1, go: 'hub' }
    ].filter(Boolean)
  }),
  ferry_cross2: S => {
    S.f.crossed = 1; S.f.knowMill = 1;
    return { plate: 'ferry', beats: [[N(`He takes you over. Neither of you says anything. The cable hums.`)]], opts: [{ t: 'Go up to the mill.', act: 1, go: S.f.lyle ? 'mill_back' : 'mill' }, { t: 'Have him carry you back.', act: 1, go: 'ferry_return' }] };
  },

  /* ---------------- THE MILL ---------------- */
  mill: S => ({
    plate: 'mill',
    beats: [[
      N(`The mill is stone to the eaves. The wheel hangs in the race with weeds grown up through it. The race is dry. They turned the creek in the spring to wash gravel for the works. The door is shut. On the step is a tin plate with crumbs on it.`),
      V('dog', 2, `He's in there. He's standing just to the left of the door, where you'd stand.`)
    ]],
    opts: [
      S.f.wrenAlong ? { t: 'Let the girl call him.', act: 1, go: 'mill_wren' } : null,
      { t: 'Knock, and say what you are.', act: 1, go: 'mill_knock' },
      { t: 'Go round the back, quiet.', act: 1, check: { id: 'sneak', v: 'dog', dc: 9, red: 1, pass: 'mill_sneak', fail: 'mill_sneak_no' } },
      { t: 'Leave it. Go back to the ferry.', act: 1, go: 'mill_leave' }
    ].filter(Boolean)
  }),
  mill_leave: S => ({
    plate: 'mill',
    beats: [[N(`You stand a minute looking at the plate on the step. Then you go back down through the cane.`), V('ledger', 0, `A man is in that building or he is not. You have chosen not to know. The book cant tell the difference and neither will the water.`)]],
    opts: [{ t: 'Have him carry you back.', act: 1, go: 'ferry_return' }, { t: 'Turn around. Go up to the door.', act: 1, go: 'mill' }]
  }),
  mill_wren: S => ({
    plate: 'mill',
    beats: [[
      P('WREN', `Lyle. It's Wren. There's a man here that counts. He's all right. He aint hit nobody.`),
      N(`A while goes by. Then the bar is drawn inside.`)
    ]],
    opts: [{ t: 'Go in.', act: 1, go: 'mill_in' }]
  }),
  mill_knock: S => ({
    plate: 'mill',
    beats: [[
      N(`You knock and say you are the enumerator for the Commission and that you carry a book and nothing else.`),
      P('A VOICE', `Go on away from here.`),
      N(`You say you can go away and write what you like or he can open the door and have some say in it.`),
      N(`A while goes by. Then the bar is drawn inside.`)
    ]],
    opts: [{ t: 'Go in.', act: 1, go: 'mill_in' }]
  }),
  mill_sneak: S => {
    S.f.sawSleep = 1;
    return {
      plate: 'mill',
      beats: [[
        N(`You go round by the race, putting your feet where the stone is. There is a window at the back with the shutter hung by one hinge.`),
        N(`He is not at the door. He is asleep on the grain sacks with his mouth open and a horse pistol lying on his chest going up and down. He is younger than you thought. He has taken his boots off and set them side by side.`),
        V('dog', 0, `Nine days he's been listening for you and he slept through it. He's not what he thinks he is.`),
        N(`You go back round to the front and knock.`)
      ]],
      opts: [{ t: 'Go in when he opens.', act: 1, go: 'mill_in' }]
    };
  },
  mill_sneak_no: S => ({
    plate: 'mill',
    beats: [[
      N(`You go round by the race. There is a slat lying in the weeds and you find it with your whole weight.`),
      N(`The back door opens faster than you would have believed and there is the round cold mouth of a pistol against the bone behind your ear.`),
      V('dog', 0, `I heard that board before your foot did. You never listen in time.`),
      P('A VOICE', `Who are you. Say it quick.`),
      N(`You say it quick. The pistol stays where it is for a long breath and then it comes away.`)
    ]],
    opts: [{ t: 'Go in ahead of him.', act: 1, go: 'mill_in' }]
  }),
  mill_in: S => ({
    plate: 'mill_in',
    beats: [[
      N(`He is twenty or near it. He has not shaved, and he has not had much need to. The pistol is an old cavalry piece, somebody's grandfather's, and he holds it like a thing that was lent him.`),
      P('THE MAN', `You write names.`),
      N(`You say you do.`),
      P('THE MAN', `Then write John Sorrel. Twenty-two. Millhand.`),
      V('ledger', 0, `The mill has been shut since spring. He's a millhand at a shut mill. He hasnt thought it through to the end of the line.`)
    ]],
    opts: [
      S.f.knowLyle ? { t: 'Your aunt says your name is Lyle.', go: 'mill_in2' } : { t: `That's not your name.`, go: 'mill_in2' },
      { t: 'What happened in Ansel.', go: 'mill_in2' }
    ]
  }),
  mill_in2: S => {
    S.f.knowLyle = 1;
    return {
      plate: 'mill_in',
      beats: [[
        N(`He sits down on a grain sack. The pistol hangs between his knees.`),
        S.f.wrenAlong ? P('WREN', `Granny Oake says eat the bread. Dont save it.`) : null,
        S.f.wrenAlong ? P('LYLE', `I ate it.`) : null,
        P('LYLE', `Lyle Pruett. A man named Coyle come at me behind the livery with a singletree and I had this. That's all of it.`),
        N(`He looks at the floor.`),
        P('LYLE', `He was owed money. By me. That's the rest of it.`)
      ], [
        P('LYLE', `They'll hang me in Ansel. Coyle's brother sits the grand jury. You write Pruett and Dace reads it and I'm in irons by dark.`),
        P('LYLE', `You write Sorrel and I walk up that grade with forty dollars and a paper that says who I am.`),
        P('LYLE', `Or you dont write nothing and I go out over the ridge tonight with what I got. Which is this. And it aint loaded. I shot it all at him.`),
        V('dog', 2, `He just told you the gun is empty. He's a fool or he's done with threatening. I think he's a fool. I like him.`),
        V('preacher', 2, `A man was killed. Somewhere there's a brother who would like that written down as well.`)
      ]],
      opts: STORY._lyleOpts(S)
    };
  },
  _lyleOpts: S => {
    const o = [];
    o.push({ t: 'Write: Lyle Pruett, 20.', act: 1, do: S => { write(S, 'lyle', 'Lyle Pruett', 20, S.f.venue ? 'held for the circuit at Marlow' : 'wanted, Ansel Co.'); S.f.lyle = 'pruett'; }, go: 'mill_pruett' });
    o.push({ t: 'Write: John Sorrel, 22.', act: 1, do: S => { write(S, 'lyle', 'John Sorrel', 22, 'millhand', false); S.f.lyle = 'sorrel'; }, go: 'mill_sorrel' });
    o.push({ t: 'Write nothing. Tell him to be over the ridge by dark.', act: 1, do: S => { S.f.lyle = 'none'; }, go: 'mill_none' });
    if (!S.f.heard) o.push({ t: 'Tell it again. Slower.', check: { id: 'lyle_ear', v: 'ear', dc: 9, mods: [['You saw him asleep with his boots set straight', 1, !!S.f.sawSleep]], pass: 'mill_ear', fail: 'mill_ear_no' } });
    if (S.f.heard && !S.f.gun) o.push({ t: 'Hold out your hand for the pistol.', act: 1, check: { id: 'gun', v: 'dog', dc: 10, red: 1, mods: [['You heard how tired he is', 1, S.tried.lyle_ear === 'won']], pass: 'mill_gun', fail: 'mill_gun_no' } });
    if (!S.f.venue) o.push({ t: 'Think what the law does with a man taken on State works.', act: 1, check: { id: 'venue', v: 'ledger', dc: 11, pass: 'mill_venue', fail: 'mill_venue_no' } });
    return o;
  },
  mill_ear: S => {
    S.f.heard = 1;
    return {
      plate: 'mill_in', beats: [[
        N(`He tells it again. The livery. The singletree. He gets to the money sooner this time.`),
        V('ear', 0, `He believes it. Every word. A man alone can believe a thing by the ninth day that wasnt so on the first.`)
      ]], opts: STORY._lyleOpts(S)
    };
  },
  mill_ear_no: S => {
    S.f.heard = 1;
    return {
      plate: 'mill_in', beats: [[
        N(`He tells it again. It comes out the same.`),
        V('ear', 0, `I cant tell. He's too scared. Scared sounds like lying and it sounds like the truth.`)
      ]], opts: STORY._lyleOpts(S)
    };
  },
  mill_gun: S => {
    S.f.gun = 'took';
    return {
      plate: 'mill_in', beats: [[
        N(`You hold out your hand, palm up. You dont reach.`),
        V('dog', 0, `Dont look at the iron. He is sick of the weight of it. Nine days is a long time to hold a thing up.`),
        N(`He looks at the piece in his lap. Then he lays it on the sack between you and wipes his palm on his knee.`),
        P('LYLE', `It was my granddaddy's. It never shot straight anyhow.`),
        N(`You put it in the meal bin and shut the lid on it.`)
      ]], opts: STORY._lyleOpts(S)
    };
  },
  mill_gun_no: S => {
    S.f.gun = 'kept';
    return {
      plate: 'mill_in', beats: [[
        N(`He puts the barrel down inside his coat and keeps his hand on it.`),
        P('LYLE', `I said it wasnt loaded. I never said it was yours.`),
        V('dog', 0, `Leave it. He'll bite on bad teeth the same as good.`)
      ]], opts: STORY._lyleOpts(S)
    };
  },
  mill_venue: S => {
    S.f.venue = 1;
    return {
      plate: 'mill_in', beats: [[
        V('ledger', 0, `Dace is State constabulary. This valley was condemned to the State in January. A man taken by State officers on State ground is bound over to the circuit court at Marlow. Not to the county. Not to Ansel.`),
        N(`You tell him. He doesnt follow it the first time and you tell him again.`),
        P('LYLE', `Marlow.`),
        N(`You say Marlow is ninety miles from Ansel. You say you cant tell him who sits a jury there or what twelve strangers will do with a singletree and a debt. It could be eight years. It could be the rope there too.`),
        P('LYLE', `But it aint Ansel.`),
        N(`It's not Ansel.`)
      ]], opts: STORY._lyleOpts(S)
    };
  },
  mill_venue_no: S => ({
    plate: 'mill_in', beats: [[
      V('ledger', 0, `There is something. Jurisdiction on condemned ground. I had it in the second valley and I have not got it now.`),
      N(`He watches you think. Whatever he hoped to see cross your face does not.`)
    ]], opts: STORY._lyleOpts(S)
  }),
  mill_pruett: S => ({
    plate: 'mill_in',
    beats: [[
      ENTRY('lyle'),
      N(`He doesnt raise the pistol. He looks at the page upside down as if he might read his way out of it.`),
      S.f.venue ? P('LYLE', `Marlow. You'll tell Dace it's Marlow.`) : P('LYLE', `Aunt Hallie said you had a decent face.`),
      S.f.venue ? N(`You say you will tell him, and that you will write it on the line so he cant forget he was told.`) : N(`You say nothing. There is nothing in the instructions for it.`),
      S.f.wrenAlong ? P('WREN', `What's Dace going to do to him.`) : null,
      S.f.wrenAlong ? N(`Nobody tells her.`) : null,
      S.f.venue ? null : V('ledger', 2, `It's a true line. I'd ask you to remember that later. I dont think you will find it helps.`)
    ]],
    opts: [{ t: 'Go back down to the ferry.', act: 1, go: 'ferry_return' }]
  }),
  mill_sorrel: S => ({
    plate: 'mill_in',
    beats: [[
      ENTRY('lyle'),
      N(`You write it. John Sorrel. Twenty-two. Millhand. The pen makes the same sound it makes for anyone.`),
      P('LYLE', `Does it look right.`),
      N(`You turn the book so he can see it. It looks like the others.`),
      P('LYLE', `John Sorrel.`),
      N(`He says it twice more to himself. He is already getting used to answering to it.`),
      V('dog', 2, `Dace knows this valley. He knows that mill has not turned since March. Be ready for him.`)
    ]],
    opts: [{ t: 'Go back down to the ferry.', act: 1, go: 'ferry_return' }]
  }),
  mill_none: S => ({
    plate: 'mill_in',
    beats: [[
      N(`You cork the ink without wetting the pen.`),
      P('LYLE', `That's all. You just dont.`),
      N(`You tell him the constables come down the grade at dusk and they come by the road. The ridge behind the mill has no road on it.`),
      V('ledger', 0, `One building not entered. I'll call it empty. I have called worse things empty.`)
    ]],
    opts: [
      S.money >= 30 ? { t: 'Give him your voucher. Thirty dollars, payable to bearer.', act: 1, do: S => { S.money = 0; S.f.lyleVoucher = 1; }, go: 'mill_voucher' } : null,
      { t: 'Go back down to the ferry.', act: 1, go: 'ferry_return' }
    ].filter(Boolean)
  }),
  mill_voucher: S => ({
    plate: 'mill_in',
    beats: [[
      N(`You hold out the voucher. He takes it and reads it with his lips.`),
      P('LYLE', `Bearer.`),
      N(`You tell him not to cash it in Corley and not in Ansel County.`),
      P('LYLE', `Why would you do that.`),
      N(`You dont have it worked out well enough to say.`)
    ]],
    opts: [{ t: 'Go back down to the ferry.', act: 1, go: 'ferry_return' }]
  }),
  mill_back: S => ({
    plate: 'mill',
    beats: [[N(`The door of the mill is shut. The plate is gone from the step.`)]],
    opts: [{ t: 'Go back down to the ferry.', act: 1, go: 'ferry_return' }]
  }),

  /* ---------------- THE WORKS ---------------- */
  works_visit: S => {
    S.f.worksSeen = 1;
    return {
      plate: 'works',
      beats: [[
        N(`The road climbs to the foot of the wall. Up close the dam is not white. It is the grey of a wasp nest and streaked where the forms leaked, and low down where the concrete was wet men have written their names in it with nails.`),
        N(`Below the gatehouse two men are winding cable onto a drum. One guides it with a forked stick. The other turns the handle. Neither looks up.`),
        N(`A young man in a clean collar sits at a bench with a boot between his knees, working a broken lace through an eye with a bent nail.`),
        P('WHITLOW', `If that's the count, the sergeant isnt ready for it. He's not back from the Corley road.`),
        N(`You tell him you have not finished.`),
        P('WHITLOW', `Then dont let him have it till you are.`),
        V('ledger', 2, `Sound advice from the man who wants it closed.`)
      ]],
      opts: STORY._worksOpts(S)
    };
  },
  _worksOpts: S => [
    (!S.f.metCarl && S.f.metOdile) ? { t: 'Ask for Carl Vance.', go: 'works_carl' } : null,
    (S.f.metCarl && !S.f.worksTools) ? { t: 'Ask Carl Vance for a shovel and shoe nails.', go: 'works_tools' } : null,
    !S.f.heardWhitlow ? { t: 'What happens here at dusk.', go: 'works_whitlow' } : null,
    !S.f.heardStock ? { t: 'There are no dogs down in the town.', go: 'works_stock' } : null,
    { t: 'Go back down into the valley.', act: 1, go: 'hub' },
    { t: 'Take the book to the table and hand it in.', act: 1, go: 'dam_ask' }
  ].filter(Boolean),
  works_choices: S => ({
    plate: 'works',
    beats: [[N(`The cable goes onto the drum one turn beside another. At the end of each turn the man with the stick lifts it clear of the flange.`)]],
    opts: STORY._worksOpts(S)
  }),
  works_carl: S => {
    S.f.metCarl = 1;
    return {
      plate: 'works',
      beats: [[
        N(`The engineer calls to the man turning the handle. The man sets the pawl and comes over. There is cement dust in the folds of his ears.`),
        P('CARL', `Odile send you.`),
        N(`You tell him you have been to the churchyard.`),
        P('CARL', `She wouldnt take my pay for it. Said the box was all I was to do.`),
        N(`He looks at the mule and then at the road below you.`),
        S.f.odile === 'mule' ? P('CARL', `That's him.`) : P('CARL', `She get down to him.`),
        S.f.odile === 'mule' ? N(`He puts his hand on the rope. He doesnt touch the box.`) : N(S.f.dug === 'yes' ? `You tell him the box is out of the ground. He nods.` : `You tell him not yet.`),
        V('preacher', 2, `Ask him why he is up here.`),
        V('hand', 0, `Look at his hands. He has been on that handle since before you came down the grade.`),
        (S.v.preacher >= 2) ? V('preacher', 0, `That's no answer.`) : null
      ]],
      opts: [
        { t: 'Why arent you down there with her.', go: 'works_carl_answer' },
        !S.f.worksTools ? { t: 'I could use a sound shovel. And shoe nails.', go: 'works_tools' } : null,
        { t: 'Let him go back to the drum.', act: 1, go: 'works_choices' }
      ].filter(Boolean)
    };
  },
  works_carl_answer: S => ({
    plate: 'works',
    beats: [[
      P('CARL', `I went before light. She told me go and earn it. They hold a man's time till the gates is shut.`),
      N(`He rubs the cement out of one ear with his thumb.`),
      P('CARL', `I went.`),
      N(`Low on the wall behind him among the names is one cut smaller than the rest. T. VANCE. And a year.`),
      V('preacher', 2, `A husband ought to know when not to do as he's told.`),
      V('ear', 0, `You have heard twenty words of their marriage.`)
    ]],
    opts: [
      !S.f.worksTools ? { t: 'I could use a sound shovel. And shoe nails.', go: 'works_tools' } : null,
      { t: 'Let him go back to the drum.', act: 1, go: 'works_choices' }
    ].filter(Boolean)
  }),
  works_tools: S => ({
    plate: 'works',
    beats: [[
      N(`He goes into the shed. He comes out with a shovel and a small hammer and six nails folded in a scrap of sacking.`),
      P('CARL', `Square ones is for shoes. Dont use the others.`),
      N(`He lays the shovel across your two hands.`),
      P('CARL', `Leave them at Bell's forge in Corley. Say they're from the works.`),
      V('ledger', 2, `Those are Commission property.`),
      V('hand', 0, `He told you where to leave them.`)
    ]],
    opts: [
      { t: 'Take them.', act: 1, do: S => { S.f.worksTools = 1; if (S.f.shoe === 'bad') { delete S.f.shoe; delete S.tried.shoe; } if (S.f.dug === 'broke') { S.f.brokeHers = 1; delete S.f.dug; delete S.tried.dig; } }, go: 'works_choices' },
      { t: 'Leave them with him.', act: 1, go: 'works_choices' }
    ]
  }),
  works_whitlow: S => ({
    plate: 'works',
    beats: [[
      P('WHITLOW', `The outlet gates go down. We watch the hoists until they're seated. Then I bring the men in off the staging and send for the lamps.`),
      N(`He pulls the lace too hard and the end comes off in his fingers. He looks at it.`),
      P('WHITLOW', `I want them off that staging while they can see it.`),
      N(`You ask what happens if the count is not finished.`),
      P('WHITLOW', `I wait.`),
      N(`He sets the boot on the bench.`),
      P('WHITLOW', `I dont mean I wait all night.`),
      V('ledger', 0, `Ask him how long.`),
      V('dog', 2, `He has told you as much as he means to promise. Push and you'll get less.`)
    ]],
    opts: [
      { t: 'How long.', check: { id: 'whitlow_time', v: 'ear', dc: 9, red: 1, pass: 'works_whitlow_plain', fail: 'works_whitlow_closed' } },
      { t: 'Leave it.', act: 1, do: S => { S.f.heardWhitlow = 1; }, go: 'works_choices' }
    ]
  }),
  works_whitlow_plain: S => {
    S.f.heardWhitlow = 2;
    return {
      plate: 'works',
      beats: [[
        N(`You ask him about the men and not about the gates.`),
        P('WHITLOW', `Vance is on the hoist. His wife is down there. I can put another man on it when she comes up the grade.`),
        N(`He threads what is left of the lace through the last two eyes.`),
        P('WHITLOW', `I cant send the whole shift home. Half their houses are still below the line.`),
        V('ear', 0, `He knows which houses. That's why he doesnt look.`)
      ]],
      opts: [{ t: 'Go on.', act: 1, go: 'works_choices' }]
    };
  },
  works_whitlow_closed: S => {
    S.f.heardWhitlow = 1;
    return {
      plate: 'works',
      beats: [[
        P('WHITLOW', `Until I cant.`),
        N(`He puts the boot on without tying it.`),
        V('ear', 0, `He heard a man asking for a promise. Maybe that was what you meant.`),
        V('dog', 2, `I said.`)
      ]],
      opts: [{ t: 'Go on.', act: 1, go: 'works_choices' }]
    };
  },
  works_stock: S => {
    S.f.heardStock = 1;
    return {
      plate: 'works',
      beats: [[
        P('WHITLOW', `They went out with the stock yesterday. Dogs follow cattle better than they follow wagons.`),
        N(`He takes a narrow book from under a weight on the bench. There are cattle in it and horses and nine dogs.`),
        P('WHITLOW', `The drover feeds them till their people come for them. That's what this is for.`),
        S.f.wrenAlong ? P('WREN', `Is the mule in that one.`) : N(`You ask him about your mule.`),
        P('WHITLOW', `Does he want feeding at Corley.`),
        N(`You say he will.`),
        P('WHITLOW', `Then put him down.`),
        V('ledger', 0, `An animal may draw feed. It may not draw a removal allowance.`),
        V('hand', 0, `He can eat the feed.`)
      ]],
      opts: [
        { t: 'Write in the stock book: one mule. Feed at Corley.', act: 1, do: S => { S.f.muleFeed = 1; }, go: 'works_stock_done' },
        { t: 'You will see to him yourself.', go: 'works_choices' }
      ]
    };
  },
  works_stock_done: S => ({
    plate: 'works',
    beats: [[
      N(`He tears a ticket from the back of the book and gives it to you.`),
      S.f.wrenAlong ? P('WREN', `He counts in that book.`) : N(`You put the ticket in the saddlebag. The mule counts in that book.`),
      S.f.wrenAlong ? N(`You give her the ticket to carry. She holds it against the ink bottle with her thumb.`) : null
    ]],
    opts: [{ t: 'Go on.', act: 1, go: 'works_choices' }]
  }),
  dam_ask: S => {
    const miss = [];
    if (!S.f.done_church) miss.push(S.f.metOdile ? 'the churchyard, where you said you would come back' : 'the churchyard');
    if (!S.f.done_ferry) miss.push('the ferry');
    return {
      plate: 'dam',
      beats: [[
        N(`They have set a table out below the gatehouse with a cloth on it. The sergeant is back. His horse stands by the table with its head down.`),
        miss.length ? V('ledger', 0, `You have not been to ${miss.join(' or ')}. A person not entered is not resident. That's the fourth instruction and they mean it.`) : null,
        (!miss.length && !S.f.tarr) ? V('ledger', 0, `You left the ferryman's line neither written nor closed. If you go up now it stands as it is. He is not in the book.`) : null,
        NOTE(`Once the book is on the table it is closed to the valley.`)
      ]],
      opts: [{ t: 'Carry the book to the table.', act: 1, do: S => { if (!S.f.tarr && S.f.done_ferry) S.f.tarr = 'off'; S.t = 5; }, go: 'dam' }, { t: 'Not yet.', act: 1, go: 'works_choices' }]
    };
  },
  dam: S => ({
    plate: 'dam',
    beats: [[
      N(`The table stands in the open below the gatehouse where the water will be ninety feet deep by spring. The engineer waits at it with a watch open in his hand. A sergeant of constabulary sits a bay horse beside him. Four troopers stand smoking by a wagon.`),
      S.f.wrenAlong ? N(`The girl has followed you all the way up with the ink. Nobody has told her not to. She stands by the mule.`) : null,
      S.f.odile === 'mule' ? N(`The sergeant looks at what is lashed on your mule. He looks at it for some time.`) : null,
      P('WHITLOW', `You have it finished. I had begun to worry. We lose the light at six-forty.`),
      V('ear', 2, `He has checked that watch three times. He hasnt once looked down at the store.`),
      V('river', 2, `I go through the foot of that wall by three iron doors. Tonight they shut them. I have tried the wall all month. It's a good wall.`)
    ]],
    opts: [{ t: 'Open the book on the table.', act: 1, go: 'dam2' }]
  }),
  dam2: S => ({
    plate: 'dam',
    beats: [[
      N(`You open the book on the cloth. ${count(S) === 1 ? 'One name' : NUM[count(S)] + ' names'} down the page in your hand, and under ${count(S) === 1 ? 'it' : 'them'} the ruled lines running on empty to the foot.`),
      !S.f.self ? N(`You have been in the valley since first light. You look at the next empty line.`) : null,
      !S.f.self ? V('ledger', 0, `Enumerators are not enumerated. There is no rule against it. There has never needed to be one.`) : null
    ]],
    opts: [
      !S.f.self ? { t: 'Write your own name on the next line.', act: 1, do: S => { write(S, 'self', 'your own name', '', 'enumerator'); S.f.self = 1; }, go: 'dam_self' } : null,
      { t: 'Turn the book to face the sergeant.', act: 1, go: 'dam_read' }
    ].filter(Boolean)
  }),
  dam_self: S => ({
    plate: 'dam',
    beats: [[
      ENTRY('self'),
      N(`You write it. It looks like any of the others.`),
      P('WHITLOW', `Is that in order.`),
      N(`Nobody answers him.`)
    ]],
    opts: [{ t: 'Turn the book to face the sergeant.', act: 1, go: 'dam_read' }]
  }),
  dam_read: S => {
    const L = [];
    L.push(N(`The sergeant gets down off the horse. He reads standing, slowly, with his finger under the line. He is a man who came to reading late and respects it.`));
    if (S.f.self) {
      const e = S.book.find(e => e.key === 'self'); if (e) e.struck = true;
      L.push(P('DACE', `You wrote yourself.`), N(`You say you were here.`), P('DACE', `So was my horse.`), N(`He draws a line through it and sets his initials by the line.`), P('DACE', `Here aint resident. I'd have thought you knew that better than any man living.`));
    }
    if (S.f.odile === 'mule') L.push(P('DACE', `That's the Vance boy on your mule.`), N(`You say it is.`), P('DACE', `I helped carry him up to that yard in March.`), N(`He looks at the box and then at the page. He reads the next name lower.`));
    if (S.f.lyle === 'pruett') {
      L.push(P('DACE', `Pruett. There's paper on a Pruett out of Ansel.`));
      if (S.f.venue) L.push(N(`You tell him the man was found on condemned ground and is taken by State officers. He is bound to the circuit at Marlow. You put your finger on the line where you wrote it.`), P('DACE', `I know the law.`), N(`He reads the line again.`), P('DACE', `I had forgot it. But I know it.`));
      else L.push(N(`He says two names to the troopers and they put out their cigarettes.`));
    }
    if (!S.f.metOdile) { write(S, 'odile', 'Odile Vance', '', 'entered by Sgt. Dace'); L.push(P('DACE', `I dont see the Vance woman. She's been in that churchyard since before light. I seen her from the road.`), N(`You say you never went up there. He looks at you and wets the pen and writes her in himself.`)); }
    if (!S.f.done_ferry && !S.f.tarr) { write(S, 'tarr', 'Abel Tarr', 70, 'entered by Sgt. Dace'); S.f.tarr = 'taken'; L.push(P('DACE', `Nor Abel Tarr.`), N(`You say you never went down to the ferry.`), P('DACE', `Then what did they send you for.`), N(`He writes Abel Tarr under the rest.`)); }
    if (!S.f.q) S.f.q = [S.f.wren === 'oake' ? 'wren' : 0, S.f.odile === 'wrote' ? 'thomas' : 0, S.f.tarr === 'off' ? 'tarr' : 0, S.f.lyle === 'sorrel' ? 'sorrel' : 0].filter(Boolean);
    if (!S.f.qd) S.f.qd = {};
    const tol = S.f.wren === 'tolliver';
    if (!S.f.q.length && !tol) {
      L.push(P('DACE', `It's a clean book.`), N(`He signs under your count and blots it with his sleeve.`));
      S.f.inspect = 'clean';
      return { plate: 'dam', beats: [L], opts: [{ t: 'Sign it.', act: 1, go: 'dam_signed' }] };
    }
    L.push(N(`Then his finger stops.`));
    return { plate: 'dam', beats: [L], opts: [{ t: 'Wait.', act: 1, go: tol ? 'dam_tol' : 'dam_q' }] };
  },
  dam_tol: S => ({
    plate: 'dam',
    beats: [[
      P('DACE', `Wren Tolliver. No kin present.`),
      N(`He taps the line.`),
      P('DACE', `That's the child they left. Who has the keeping of her.`),
      N(`You say Hallie Oake has fed her since April.`),
      P('DACE', `Fed aint kept. I can take an undertaking from Hallie Oake if it's wrote right. If it aint the county has the girl till a magistrate sits.`),
      V('ledger', 0, `An undertaking. Section nine. The form of words matters and he knows the form.`),
      V('ear', 2, `He is telling you how to do it. He'd as soon not be the one who takes her to Ansel.`),
      V('dog', 2, `Or he is telling you so it's your hand on it and not his.`)
    ]],
    opts: [
      { t: 'Write the undertaking on the facing page.', act: 1, check: { id: 'tol_care', v: 'ledger', dc: 9, red: 1, mods: [['The girl told you herself she wont go', 1, S.tried.askwren === 'won'], ['The girl is standing at the table', 1, !!S.f.wrenAlong]], pass: 'dam_tol_yes', fail: 'dam_tol_no' } },
      { t: 'She is with Hallie Oake. Leave the rest with him.', go: 'dam_tol_leave' }
    ]
  }),
  dam_tol_yes: S => {
    const e = S.book.find(e => e.key === 'wren'); e.note = `in H. Oake's care pending county hearing`; S.f.wren = 'ward';
    return {
      plate: 'dam',
      beats: [[
        N(`You write it narrow. That Hallie Oake undertakes to keep the child and to produce her when called. No more than that. He reads it before the ink has dried.`),
        P('DACE', `Hallie signs that. Not you.`),
        N(`You leave a space. He sets his initials by it and calls a trooper to the table.`),
        P('DACE', `Get her hand on this before you load them.`),
        S.f.wrenAlong ? P('WREN', `Read that bit.`) : null,
        S.f.wrenAlong ? N(`You read it. In Hallie Oake's care pending county hearing.`) : null,
        S.f.wrenAlong ? P('WREN', `All right.`) : null
      ]],
      opts: [{ t: S.f.q.length ? 'Let him read on.' : 'Wait for him to finish.', act: 1, go: 'dam_q' }]
    };
  },
  dam_tol_no: S => {
    S.f.wren = 'county';
    return {
      plate: 'dam',
      beats: [[
        N(`You write that Hallie Oake is the child's guardian. He stops you at the word.`),
        P('DACE', `I said I'd take her undertaking. I never said I could appoint her.`),
        N(`He draws the book back across the cloth.`),
        V('ledger', 0, `You made it broader than his authority. He will not sign past what he's allowed.`),
        S.f.wrenAlong ? P('WREN', `Can she still sign.`) : null,
        S.f.wrenAlong ? P('DACE', `She can put it to the county.`) : null,
        N(`He doesnt turn back to the facing page.`)
      ]],
      opts: [{ t: S.f.q.length ? 'Let him read on.' : 'Wait for him to finish.', act: 1, go: 'dam_q' }]
    };
  },
  dam_tol_leave: S => {
    S.f.wren = 'county';
    return {
      plate: 'dam',
      beats: [[
        P('DACE', `Then the county has her till it's heard.`),
        N(`He writes a word in the margin by her name. You can read it upside down. Ansel.`),
        S.f.wrenAlong ? N(`The girl can read it too. She learned her letters off newspaper.`) : null
      ]],
      opts: [{ t: S.f.q.length ? 'Let him read on.' : 'Wait for him to finish.', act: 1, go: 'dam_q' }]
    };
  },
  _Q: {
    wren: {
      ask: S => [P('DACE', `Wren Oake. Granddaughter.`), N(`He looks down at the store, small in the valley, and back at the page.`), P('DACE', `Hallie Oake never had a child. I've known her thirty years.`), V('ledger', 0, `You wrote granddaughter. That is the word he can strike.`), V('ear', 0, `Then let him strike the word. Not the woman who feeds her.`), V('dog', 2, `He has a pen and four men. Mind which correction you ask him for.`)],
      dc: 9,
      a: { v: 'ear', t: 'Thirty years. Then you know whose child that is now.', win: S => [N(`You say thirty years is long enough to know what Hallie Oake would do and what she would not. You say he knew whose child that was before he ever read the line.`), P('DACE', `I know where the Tollivers went. I know they aint coming back.`), N(`He moves his finger down the page.`)] },
      b: { v: 'preacher', t: 'A name is what a child answers to. Call her and see.', win: S => [N(S.f.wrenAlong ? `You tell him a name is what a child answers to. She is standing right there by the mule. He is welcome to call her by the other one and see does she come.` : `You tell him a name is what a child answers to. He is welcome to ride down there and call her by the other one and see who comes.`), P('DACE', `I aint in the business of calling children.`), N(`He moves his finger down the page.`)] },
      lose: S => [P('DACE', `That's a Tolliver. They left her in April and the whole county knows it. I'd be wrote up myself.`), N(`He strikes Oake and writes Tolliver above it in a square hand like a child's.${S.f.wrenAlong ? ' The girl is watching him do it. He knows she is.' : ''}`)],
      give: S => [N(`You turn the pen around and hold it out to him. He strikes Oake and writes Tolliver above it in a square hand like a child's.`), P('DACE', `Ansel aint so bad as they say.`), N(`He doesnt sound like a man who has been there.`)],
      mods: S => [['The girl told you herself she wont go', 1, S.tried.askwren === 'won']],
      fail: S => { const e = S.book.find(e => e.key === 'wren'); e.name = 'Wren Tolliver'; e.note = 'corrected by Sgt. Dace'; e.truth = true; S.f.wren = 'corrected'; }
    },
    thomas: {
      ask: S => [P('DACE', `Thomas Vance. Four.`), N(`He keeps his finger on it.`), P('DACE', `I carried the fever returns out of this valley in March. There was a Vance on it.`)],
      dc: 10,
      a: { v: 'river', t: 'Tell him how deep the churchyard will lie.', win: S => [N(`You tell him the churchyard will lie under ninety feet. You tell him what the silt will do. You say the boy is in this valley tonight and the book is a list of who is in this valley.`), V('river', 0, `Ninety-one. I would not have rounded it.`), N(`He is quiet a while.`), P('DACE', `I got one in the ground at Marlow. I know right where she is.`), N(`He lifts his finger off the line and goes on.`)] },
      b: { v: 'ledger', t: 'The return says a Vance. It doesnt say which.', win: S => [N(`You tell him a fever return gives a surname and a count and he knows it, for he has filled them out. There is more than one Vance in this country. He is welcome to prove which from a March return in a tin box at the capital.`), P('DACE', `That's lawyer talk.`), N(`You say it is. He looks at the line a while longer and goes on.`)] },
      lose: S => [P('DACE', `I helped carry that box. I aint putting my name under a thing I carried.`), N(`He draws a line through Thomas Vance. He does it slowly and he doesnt look up after.`)],
      give: S => [N(`You hold the pen out to him. He draws a line through Thomas Vance. He does it slowly.`), P('DACE', `I'm sorry for it. It dont change it.`)],
      mods: S => [],
      fail: S => { S.book.find(e => e.key === 'thomas').struck = true; S.f.odile = 'struck'; }
    },
    tarr: {
      ask: S => [N(`He goes down the page and then he goes down it again.`), P('DACE', `I dont see Abel Tarr.`)],
      dc: 10,
      a: { v: 'dog', t: 'The ferry house was empty. Look at him when you say it.', win: S => [N(`You tell him the ferry house was empty when you came and the chair on the porch was empty. You say it flat and you look at him while you say it and you are not the first to look away.`), V('dog', 0, `Dont blink. Dont add to it. A liar always adds to it.`), P('DACE', `Abel Tarr never left that river in his life.`), N(`You say then he has left it now.`), N(`He looks down the valley toward the ferry for some time. Then he goes on down the page.`)] },
      b: { v: 'preacher', t: 'You carried the Purdys out. Ask him how that sat.', win: S => [N(`You ask him how it sat with him, carrying the Purdys up the grade. You say a man of seventy lifted off his own porch by four troopers is a thing those troopers take home with them.`), P('DACE', `That aint in the instructions.`), N(`You say no. He reads the page a third time and does not find Abel Tarr on it, and goes on.`)] },
      lose: S => [P('DACE', `He's on that porch. I can damn near see him from here.`), N(`He wets the pen and writes Abel Tarr at the foot of the page.`)],
      give: S => [N(`You say he is on his porch. The sergeant nods and wets the pen and writes Abel Tarr at the foot of the page.`), P('DACE', `He'll curse the both of us. He'll be alive to do it.`)],
      mods: S => [],
      fail: S => { write(S, 'tarr', 'Abel Tarr', 70, 'entered by Sgt. Dace'); S.f.tarr = 'dragged'; }
    },
    sorrel: {
      ask: S => [P('DACE', `John Sorrel. Millhand.`), N(`He looks across the valley to where the mill is.`), P('DACE', `That wheel aint turned since March.`)],
      dc: 11,
      a: { v: 'ledger', t: `Section two. The Enumerator's entry is conclusive as to residence.`, win: S => [N(`You tell him section two. The Enumerator's entry is conclusive as to residence. He may dispute it in writing to the Commission at the capital, and they will answer him in the spring.`), P('DACE', `In the spring.`), N(`You say that is their custom. He goes on down the page.`)] },
      b: { v: 'dog', t: 'Look at his horse. Look at the light. Wait him out.', win: S => [N(`You dont argue it. You look at the bay standing hipshot with its head down. You look at the shadow three parts up the concrete. You wait.`), V('dog', 0, `He's been in that saddle since four. The mill is across the river and the ferry is slow and there's no moon till late. Let him do the sum himself.`), N(`The bay shifts its weight and blows.`), P('DACE', `Hell with it.`), N(`He goes on down the page.`)] },
      lose: S => [P('DACE', `There aint a millhand in this valley. There's a man in that mill and I mean to see him.`), N(`He draws a line through John Sorrel and sends two troopers down the grade at a trot.`)],
      give: S => [N(`You say nothing. He draws a line through John Sorrel and sends two troopers down the grade at a trot.`)],
      mods: S => [],
      fail: S => { S.book.find(e => e.key === 'lyle').struck = true; S.f.lyle = 'fled'; }
    }
  },
  dam_q: S => {
    const key = S.f.q.find(k => !S.f.qd[k]);
    if (!key) return STORY.dam_done(S);
    S.f.qcur = key;
    const Q = STORY._Q[key];
    const caught = Object.values(S.f.qd).filter(x => x !== 'pass').length;
    const mods = [['The girl has said her own name', -1, key === 'wren' && !!S.f.wrenSpoke], ['The engineer wants his gates shut', 1, true], ['He has caught you out already', -1, caught > 0], ['The Vance boy is on your mule', 1, S.f.odile === 'mule']].concat(Q.mods(S));
    const ck = o => ({ t: o.t, check: { id: 'dace_' + key + '_' + o.v, v: o.v, dc: Q.dc, red: 1, mods, pass: 'dam_q_pass_' + (o === Q.a ? 'a' : 'b'), fail: 'dam_q_fail' } });
    return {
      plate: 'dam',
      beats: [Q.ask(S).concat([N(`He looks at you. The engineer looks at his watch.`)])],
      opts: [ck(Q.a), ck(Q.b), (key === 'wren' && S.f.wrenAlong && !S.f.wrenSpoke) ? { t: 'Ask the girl to come to the table.', act: 1, go: 'dam_wren_speak' } : null, { t: 'Say nothing. Hand him the pen.', act: 1, go: 'dam_q_give' }].filter(Boolean)
    };
  },
  _qres: (S, how) => {
    const key = S.f.qcur, Q = STORY._Q[key];
    if (!S.f.qd[key]) { S.f.qd[key] = how === 'a' || how === 'b' ? 'pass' : how; if (how === 'fail' || how === 'give') Q.fail(S); }
    const lines = how === 'a' ? Q.a.win(S) : how === 'b' ? Q.b.win(S) : how === 'fail' ? Q.lose(S) : Q.give(S);
    const more = S.f.q.find(k => !S.f.qd[k]);
    return { plate: 'dam', beats: [lines], opts: [{ t: more ? 'Wait.' : 'Wait for him to finish.', act: 1, go: more ? 'dam_q' : 'dam_done' }] };
  },
  dam_wren_speak: S => {
    S.f.wrenSpoke = 1;
    return {
      plate: 'dam',
      beats: [[
        N(`You ask the girl to come to the table. She sets the ink down beside the book.`),
        P('DACE', `Is Hallie Oake your grandmother.`),
        P('WREN', `No.`),
        N(`He looks at you.`),
        V('ledger', 0, `There. You asked for a witness.`),
        V('ear', 0, `Let her finish.`),
        P('WREN', `I told him that in the store.`),
        N(`He turns the book a little so she can see the line.`),
        P('DACE', `What's your name.`),
        P('WREN', `Wren Tolliver.`),
        P('DACE', `That's right.`),
        P('WREN', `I know it's right.`)
      ], [
        P('DACE', `Where are your people.`),
        P('WREN', `They went.`),
        P('DACE', `And Hallie took you in.`),
        P('WREN', `I was in already. She let me stay.`),
        V('preacher', 2, `Tell him that is what a mother does.`),
        V('ear', 0, `She never called her mother. Dont put another name in her mouth.`)
      ]],
      opts: [
        { t: 'Ask him to write her true name and who she lives with.', go: 'dam_wren_care' },
        { t: 'Stand on the Oake entry all the same.', act: 1, go: 'dam_q' },
        { t: 'Hand him the pen.', act: 1, go: 'dam_q_give' }
      ]
    };
  },
  dam_wren_care: S => ({
    plate: 'dam',
    beats: [[
      P('DACE', `I can take an undertaking from Hallie. I cant give her the child.`),
      N(`You ask what the undertaking does.`),
      P('DACE', `Puts Hallie's name to where the girl is kept. Till the county hears it.`),
      P('WREN', `Do I go with her.`),
      P('DACE', `Till the county hears it.`),
      P('WREN', `You said that.`),
      V('dog', 2, `And an address where they can find her.`)
    ]],
    opts: [
      { t: 'Write the undertaking on the facing page.', act: 1, check: { id: 'dace_wren_care', v: 'ledger', dc: 10, red: 1, mods: [['The girl has said where she lives', 1, true], ['She told you in the store she wont go', 1, S.tried.askwren === 'won']], pass: 'dam_wren_care_yes', fail: 'dam_wren_care_no' } },
      { t: 'Stand on the Oake entry all the same.', act: 1, go: 'dam_q' },
      { t: 'Hand him the pen.', act: 1, go: 'dam_q_give' }
    ]
  }),
  dam_wren_care_yes: S => {
    if (!S.f.qd.wren) { const e = S.book.find(e => e.key === 'wren'); e.name = 'Wren Tolliver'; e.note = `in H. Oake's care pending county hearing`; e.truth = true; S.f.wren = 'ward'; S.f.qd.wren = 'pass'; S.f.amended = 1; }
    const more = S.f.q.find(k => !S.f.qd[k]);
    return {
      plate: 'dam',
      beats: [[
        N(`You turn to the facing page and write it narrow. That Hallie Oake undertakes to keep the child and to produce her when called. He reads it before you have finished.`),
        P('DACE', `Hallie signs that. Not you.`),
        N(`You leave a space. He sets his initials by it and calls a trooper to the table.`),
        P('DACE', `Get her hand on this before you load them.`),
        N(`He strikes Oake from the girl's line and writes Tolliver. Under it he writes where she is to go.`),
        P('WREN', `Read that bit.`),
        N(`You read it. In Hallie Oake's care pending county hearing.`),
        P('WREN', `All right.`),
        N(`She takes up the ink.`)
      ]],
      opts: [{ t: more ? 'Let him read on.' : 'Wait for him to finish.', act: 1, go: 'dam_q' }]
    };
  },
  dam_wren_care_no: S => ({
    plate: 'dam',
    beats: [[
      N(`You write that Hallie Oake is the child's guardian. He stops you at the word.`),
      P('DACE', `I said I'd take her undertaking. I never said I could appoint her.`),
      N(`He draws the book back across the cloth.`),
      V('ledger', 0, `You made it broader than his authority.`),
      P('WREN', `Can she still sign.`),
      P('DACE', `She can put it to the county.`)
    ]],
    opts: [{ t: 'Give him the pen.', act: 1, go: 'dam_q_give' }]
  }),
  dam_q_pass_a: S => STORY._qres(S, 'a'),
  dam_q_pass_b: S => STORY._qres(S, 'b'),
  dam_q_fail: S => STORY._qres(S, 'fail'),
  dam_q_give: S => STORY._qres(S, 'give'),
  dam_done: S => {
    const lost = Object.values(S.f.qd).filter(x => x !== 'pass').length + (S.f.amended ? 1 : 0);
    S.f.inspect = !S.f.q.length ? 'clean' : lost ? 'mixed' : 'pass';
    if (!S.f.q.length) return { plate: 'dam', beats: [[N(`He comes to the foot of the page.`), P('DACE', `It's a clean book otherwise.`), N(`He signs under your count and blots it with his sleeve.`)]], opts: [{ t: 'Sign it.', act: 1, go: 'dam_signed' }] };
    const L = lost === 0 ? [
      N(`He comes to the foot of the page. He looks at you the way a man looks at a horse he is not going to buy.`),
      P('DACE', `I been a sergeant nineteen years. I know what a clean book looks like and I know what this is.`),
      N(`He takes the pen and signs under your count.`),
      P('DACE', `I aint riding down there to learn which of us is right. Not for the Commission. They dont pay me to know.`),
      V('ledger', 0, `His signature is under yours. The pay clerk will have both.`)
    ] : lost >= S.f.q.length ? [
      N(`He comes to the foot of the page and signs under your count.`),
      P('DACE', `Now it's a clean book.`),
      V('preacher', 0, `It's a true one. I have always held those were the same. I could not tell you now who I held it to.`)
    ] : [
      N(`He comes to the foot of the page. He signs under your count and blots it with his sleeve.`),
      P('DACE', `That's as clean as I can make it and still get down that hill by dark.`),
      V('ledger', 0, `He has signed below the changes. Those are the names they will pay for.`)
    ];
    return { plate: 'dam', beats: [L], opts: [{ t: 'Sign it.', act: 1, go: 'dam_signed' }] };
  },
  dam_signed: S => {
    const c = count(S);
    return {
      plate: 'dam',
      beats: [[
        N(`You sign under the sergeant. The engineer turns the book around and reads the one figure in it he needs.`),
        P('WHITLOW', `${['None', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'][c]}. ${['Nothing', 'Forty dollars', 'Eighty dollars', 'A hundred and twenty dollars', 'A hundred and sixty dollars', 'Two hundred dollars', 'Two hundred and forty dollars', 'Two hundred and eighty dollars', 'Three hundred and twenty dollars'][c]}. I had budgeted for nine.`),
        N(`He seems pleased. He closes the book and puts it in a tin box with a lock and the box under his arm.`),
        N(`The sergeant mounts. The wagon goes down the grade with the troopers walking behind it, and the light goes down the valley ahead of them.`)
      ]],
      opts: [{ t: 'Watch them go down.', act: 1, go: 'removal' }]
    };
  },
  removal: S => {
    const L = [];
    if (S.f.metCarl) L.push(N(`Up on the hoist a man in a cap has stopped turning. The engineer says something to him and another man takes the handle.`));
    L.push(N(`From the works you can see all of it, small. The wagon stops at the store. A crate is handed up, and a woman, and she sits on the crate.`));
    if (S.f.wren === 'oake' || S.f.wren === 'ward') L.push(N(`${S.f.wrenAlong ? 'The girl goes down the road at a run with the ink still in her hands and is lifted up beside her.' : 'A child is lifted up beside her.'}`));
    else L.push(N(`${S.f.wrenAlong ? 'A trooper comes back up the road for the girl. She gives you the ink. She has not spilled any.' : 'A child is lifted up, and set on the other bench, by the trooper.'}`));
    if (S.f.tarr === 'walk') L.push(N(`At the river a man comes up from the ferry on foot with something wrapped under his arm. The wagon waits for him. He doesnt hurry and he doesnt get in. He walks behind.`));
    else if (S.f.tarr === 'wrote' || S.f.tarr === 'dragged' || S.f.tarr === 'taken') L.push(N(`At the river four men go down to the ferry house and they are in it some time. They come out carrying a chair with a man in it. From here it looks like a courtesy.`));
    else if (S.f.tarr === 'off') L.push(N(`The wagon doesnt stop at the river. There is nobody on the book there. On the porch of the ferry house you can make out a chair, and you cant make out whether there is anyone in it, and you know.`));
    if (S.f.lyle === 'fled') L.push(N(`Across the river two troopers stand at the door of the mill. One of them picks something up off the step and looks at it and sets it down. They come back alone.`));
    else if (S.f.lyle === 'pruett') L.push(N(S.f.gun === 'took' ? `The scow crosses once more with two troopers on it and comes back with three men. The one in the middle has his hands in front of him.` : `The scow crosses once more with two troopers on it. From the mill there is one shot, flat and small at that distance. The scow comes back with three men. The one in the middle is holding his arm against his chest. He had come to the door with the pistol in his hand. Nobody had told the troopers it was empty.`));
    if (S.f.metOdile) L.push(N(S.f.odile === 'mule' ? `On the rise a woman stands by the church with her hands empty. The wagon waits for her too.` : S.f.dug === 'broke' ? `On the rise a woman kneels by the church with what is left of a shovel. The wagon waits for her too.` : `On the rise a woman stands by the church with a shovel. The wagon waits for her too.`));
    else L.push(N(`On the rise somebody is digging by the church. You never went up there. The wagon stops for her.`));
    return {
      plate: 'removal',
      beats: [L, [
        N(`At six-forty the engineer shuts his watch and lifts his hand to someone in the gatehouse.`),
        N(`It makes no sound you can hear. Somewhere in the foot of the wall three iron doors go down and the river comes to them and has nowhere to go. It stands. Then it begins to back up the way it came.`),
        N(`Beyond the wall the gorge keeps what water it has a little while, out of habit. Then that thins on the stones and stops being a river.`)
      ]],
      opts: [{ t: 'Stay on the grade until dark.', act: 1, go: 'last' }]
    };
  },

  /* ---------------- AFTER ---------------- */
  after: S => {
    const A = [], B = [], C = [];
    A.push(N(`These are the later returns, so far as anything was written.`));
    A.push(N(`Hallie Oake went to her sister's kitchen in Corley and was told where things were kept.`));
    if (S.f.wren === 'oake') A.push(N(`Wren Oake went with her and nobody asked. She learned to read off the newspapers the lamp chimneys were wrapped in. There is no paper anywhere that says whose she is.`));
    else if (S.f.wren === 'ward') A.push(N(`Hallie Oake went before the magistrate in September. Wren sat beside her. They were asked the same questions in separate rooms. The order left the girl in Hallie's care. It called her Tolliver throughout.`));
    else A.push(N(`Wren Tolliver was carried to the county home at Ansel on a Sunday. Hallie Oake put it to the magistrate in September. The return does not say how he found. Somewhere about fourteen the girl walked out of a door and nobody wrote that down either.`));
    if (S.f.muleFeed) A.push(N(`One mule drew feed at Corley for three days on a Commission ticket. It was the only one of your party the Commission fed.`));

    if (S.f.odile === 'wrote') B.push(N(`The Commission paid forty dollars for Thomas Vance, aged four, resident. The carter took thirty. There is a stone at Corley with his name cut in it and the dates are right.`));
    else if (S.f.odile === 'cert') B.push(N(`The Commission moved the grave of Thomas Vance at its own charge under section fourteen. Two men and a wagon. They were careful with the box. His mother had not expected them to be and she watched them the whole way.`));
    else if (S.f.odile === 'voucher') B.push(N(`The carter at Corley took a Commission voucher for thirty dollars and asked nothing about it. Thomas Vance lies on the hill above the waterline. There was no money over for a stone. His mother knows the place.`));
    else if (S.f.odile === 'mule') B.push(N(`You carried Thomas Vance up the grade on the mule and left him with the sexton at Corley. The sexton asked whose he was. You gave the name and the age and he wrote them in a book of his own. His mother found the place the next day.`));
    else if (S.f.metOdile && S.f.dug === 'yes') B.push(N(`Odile Vance would not get on the wagon without the box and the troopers would not load it. She carried it up the grade on her back in the night. She buried him above the waterline in ground she did not own, with no stone, and told no one where.`));
    else if (S.f.metOdile) B.push(N(`Odile Vance had not reached the box when the troopers came for her at dusk${(S.f.dug === 'broke' || S.f.brokeHers) && S.f.dug !== 'beat' ? '. She had been all afternoon on her knees with half a shovel' : ''}. They let her bring the marker. Thomas Vance lies under ninety feet of water and she can show you on the lake where.`));
    else B.push(N(`You never went up to the churchyard. Odile Vance was entered by the sergeant and taken from it at dusk. What she left in the ground there is under ninety feet of water.`));

    if (S.f.tarr === 'walk') B.push(N(`Abel Tarr walked up the grade on his own feet with the ferry bell under his arm. He would not ride the wagon. In Corley he had a room behind Bell's forge and told whoever sat still where the crossing had been and what the ice did in ninety-four. Some days he was not civil about it.`));
    else if (S.f.tarr === 'wrote') B.push(N(`Abel Tarr was carried up the grade in his chair. He did not fight them. He was put in a room behind Bell's forge in Corley with a window that looked on a wall. If he spoke of the river it was to nobody you ever found.`));
    else if (S.f.tarr === 'dragged') B.push(N(`Abel Tarr was carried up the grade in his chair. He had been told he was not in the book. In the room behind Bell's forge he asked the woman who kept the house what your name was. She did not know it.`));
    else if (S.f.tarr === 'off') B.push(N(`Abel Tarr was not in the book. The water came into his yard on the second evening and to the porch boards on the third morning. Nobody saw the rest. In October a chair was found against the face of the dam.`));
    else B.push(N(`You never went down to the ferry. The sergeant did. Abel Tarr was carried up the grade in his chair by men who had not been told to ask him anything. You never saw his face.`));
    if (S.f.tarrVisit && S.f.tarr !== 'off') B.push(N(`In October you went to the room behind Bell's forge. Tarr opened the door. You had brought tobacco. He said he had quit it and let you in.`));
    else if (S.f.tarrAddress && S.f.tarr === 'off') B.push(N(`You kept the address. It is on the back of the receipt from Sabra.`));

    if (S.f.lyle === 'pruett' && S.f.venue) C.push(N(`Lyle Pruett was tried at Marlow in October. The jury was out two days. He was given eight years. When he came out the lake was there and he stood on the dam and looked at it and then went to find work.`));
    else if (S.f.lyle === 'pruett') C.push(N(`Lyle Pruett was given over to the sheriff of Ansel County. He was hanged in November. Coyle's brother was present. Hallie Oake was told after.`));
    else if (S.f.lyle === 'sorrel') C.push(N(`John Sorrel drew forty dollars at the pay table in Corley and signed for it in a hand that had practised. The next spring a man was shot dead in a town called Varney over a debt. The name given was neither Sorrel nor Pruett. You read the notice twice.`));
    else if (S.f.lyle === 'none' || S.f.lyle === 'fled') C.push(N(`The man at the mill went out over the ridge in the dark with ${S.f.gun === 'took' ? (S.f.lyleVoucher ? 'a voucher for thirty dollars and nothing else' : 'nothing in his coat') : 'an empty pistol' + (S.f.lyleVoucher ? ' and a voucher for thirty dollars' : '')}. There is no record of him after. That is what he asked for.`));
    else C.push(N(`You did not go up to the mill. Whoever was in it was there when the water came or he was not. The book is silent on it and so are you.`));

    if (S.f.self) C.push(N(`Your own name is in the Tenmile book with a line through it and a sergeant's initials. It is the only one of the five books that has it at all.`));
    if (S.money) C.push(N(`You cashed your voucher at Corley. Thirty dollars. You bought a set of shoes for the mule and nails to go with them.`));
    else C.push(N(`At Corley you reached into the back of the book for the voucher. Then you remembered.`));

    const c = count(S);
    C.push(FORM(`TENMILE. SOULS ENUMERATED: ${c}.\nREMOVAL ALLOWANCE PAID: $${c * 40}.\nVALLEY CERTIFIED VACANT.`));
    return { plate: 'night', beats: [A, B, C], opts: [{ t: 'Close the returns.', act: 1, silent: 1, do: S => { S.f.returns = 1; }, go: 'fin' }] };
  },
  last: S => {
    const rank = k => S.v[k] * 10 + (k === S.f.pick1 ? 2 : k === S.f.pick2 ? 1 : 0);
    const top = Object.keys(VOICES).sort((a, b) => rank(b) - rank(a))[0];
    const close = {
      ledger: `The total agrees with the entries. I have checked it twice.`,
      hand: S.f.shoe === 'ok' ? `The shoe's holding. Corley by noon if you start now.` : `That shoe wont see Corley. Get down and do it right this time. It's not too dark for hands.`,
      ear: `Listen. No. There's nothing. You have heard that four times before and called it quiet.`,
      dog: `Nobody's watching us now. First time all day. Go on.`,
      preacher: `I had something ready to say over it. I find I dont want to say it.`,
      river: `The cable will go slack. Mud will fill the hole in the churchyard. The floors will lift from their joists.`
    }[top];
    return {
      plate: 'night',
      beats: [[
        N(`You sit on the grade with the mule through the first of the dark. The water comes up the valley the way a shadow does. You cant see it move and each time you look it has.`),
        N(`It takes the upper landing first, and the cane. Then the ferry road. It is in no hurry.`),
        S.f.tarr === 'off' ? N(`There is a light on the porch of the ferry house. Somebody has lit a lamp to see it by.`) : null
      ], [
        N(S.f.odile === 'mule' ? `You go up to Corley in the dark with the box and leave it with the sexton. Then you come back down the grade. You could not say why.` : `You had not meant to stay.`),
        N(`You stay three nights. On the second day it goes in at the open doors of the street. On the third night the moon is in it and there are roofs yet, and the church on its rise, standing in a thing that was not there when you came down with a book.`),
        N(`${['None', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'][count(S)]} in the ledger. The Commission will call that the number of people who lived at Tenmile.`),
        { k: 'v', v: top, min: 0, t: close },
        N(`The mule gets up when it is ready. You go with it.`)
      ]],
      opts: [{ t: 'The end.', act: 1, silent: 1, go: 'fin' }]
    };
  },
  fin: S => ({
    plate: 'night',
    fin: true,
    beats: [[]],
    opts: []
  })
};
