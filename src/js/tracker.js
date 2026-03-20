// Habit tracking and workout functions

function getWID(off) {
  off = off || 0;
  const d = new Date();
  d.setDate(d.getDate() + off * 7);
  const j = new Date(d.getFullYear(), 0, 1);
  const w = Math.ceil(((d - j) / 864e5 + j.getDay() + 1) / 7);
  return d.getFullYear() + '-W' + String(w).padStart(2, '0');
}

function wkDates(wid) {
  const parts = wid.split('-W');
  const y = Number(parts[0]), w = Number(parts[1]);
  const j = new Date(y, 0, 1);
  const o = j.getDay() || 7;
  const m = new Date(y, 0, 1 + (w - 1) * 7 - o + 1);
  const s = new Date(m);
  s.setDate(m.getDate() + 6);
  return m.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ' – ' + s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function ensW(w) { if (!db[w]) db[w] = { h: {}, e: {}, s: {} }; }
function ti() { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; }
function cw() { return getWID(0); }

function isH(w, id, d) { ensW(w); return !!db[w].h[id + "_" + d]; }
function togH(w, id, d) { ensW(w); const k = id + "_" + d; db[w].h[k] = !db[w].h[k]; saveDB(); R(); }
function cnt(w, d) { return HABITS.filter(h => isH(w, h.id, d)).length; }
function wsc(w) {
  let t = 0, c = 0;
  const mx = w === cw() ? ti() : 6;
  for (let d = 0; d <= mx; d++) HABITS.forEach(h => { t++; if (isH(w, h.id, d)) c++ });
  return t ? Math.round(c / t * 100) : 0;
}
function meds() { return ["med_am", "med_pm", "supplement"].filter(m => isH(cw(), m, ti())).length; }
function streak() { let s = 0; for (let d = ti(); d >= 0; d--) { if (cnt(cw(), d) >= 8) s++; else break } return s; }

function gS(w, dk, ei, si, t) { ensW(w); return db[w].s[dk + '_' + ei + '_' + si + '_' + t] || ""; }
function pS(w, dk, ei, si, t, v) { ensW(w); db[w].s[dk + '_' + ei + '_' + si + '_' + t] = v; saveDB(); }
function iSD(w, dk, ei, si) { ensW(w); return !!db[w].s[dk + '_' + ei + '_' + si + '_d']; }
function tSD(w, dk, ei, si) { ensW(w); const k = dk + '_' + ei + '_' + si + '_d'; db[w].s[k] = !db[w].s[k]; saveDB(); R(); }

function allW() { return Object.keys(db).filter(k => k.match(/^\d{4}-W\d{2}$/)).sort(); }

function setTab(t) {
  S.tab = t; S.sched = S.meal = S.exO = S.swapSlot = null;
  S.swapTab = "today"; S.browseDay = null; S.searchQ = "";
  S.mealMgr = false; S.editKey = null; S.addSlot = null;
  S.libExpand = null; S.libAddTarget = null; S.libEdit = null;
  S.showHidden = false; S.wOff = 0; R(); scrollTo(0, 0);
}

function setDay(d) { S.day = d; S.exO = null; S.swapSlot = null; S.swapTab = "today"; S.browseDay = null; S.addSlot = null; R(); }

function toggleSwap(dk, slotKey) {
  const id = dk + "_" + slotKey;
  if (S.swapSlot === id) { S.swapSlot = null } else { S.swapSlot = id; S.swapTab = "today"; S.browseDay = null }
  S.meal = null;
  R();
}
