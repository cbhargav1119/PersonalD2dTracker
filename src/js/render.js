// Main render function
function R() {
const a = document.getElementById("app");
if (!a) return;
const t0 = ti(), CW = cw(), mt = meds(), ws = wsc(CW);
const userInfo = storage.getUserInfo();
const syncSt = storage.syncStatus;
const syncHTML = '<div id="sync-status" class="sync-indicator"><span class="sync-dot ' + syncSt + '"></span> ' +
  (syncSt === 'synced' ? 'Synced' : syncSt === 'syncing' ? 'Saving...' : syncSt === 'error' ? 'Sync error' : '') + '</div>';
const userHTML = userInfo ? '<div class="header-user">' +
  (userInfo.avatar_url ? '<img class="header-avatar" src="' + userInfo.avatar_url + '" alt="">' : '') +
  '<span style="font-size:10px;color:var(--dim)">' + (userInfo.login || '') + '</span>' +
  '<button class="header-logout" onclick="logout()">Logout</button></div>' : '';

let o = '<div class="header"><div class="header-top"><div><div class="header-tag">Wellness</div><div class="header-title">' +
  ({ today: "Today", tracker: "Tracker", workout: "Workout", meals: "Meals", targets: "Targets" }[S.tab]) +
  '</div></div><div><div class="header-date">' +
  new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) +
  '</div><div class="header-meds" style="color:' + (mt === 3 ? "var(--green)" : "var(--red)") + '">' +
  (mt === 3 ? "✓ Meds done" : "⚠ " + (3 - mt) + " meds left") +
  '</div>' + syncHTML + userHTML + '</div></div></div><div class="page">';

if (S.tab === "today") {
const dw = WK[DAYS[t0]];
o += '<div class="stats"><div class="card stat"><div class="stat-val" style="color:' + (ws >= 85 ? "var(--green)" : ws >= 60 ? "var(--orange)" : "var(--red)") + '">' + ws + '%</div><div class="stat-label">Week</div></div><div class="card stat"><div class="stat-val" style="color:var(--blue)">' + cnt(CW, t0) + '/' + HABITS.length + '</div><div class="stat-label">Today</div></div><div class="card stat"><div class="stat-val" style="color:var(--purple)">' + streak() + 'd</div><div class="stat-label">Streak</div></div></div>';
o += '<div class="card" style="border-left:3px solid ' + dw.color + ';padding:14px;cursor:pointer" onclick="setTab(\'workout\')"><div style="display:flex;justify-content:space-between;align-items:center"><div><div style="font-size:10px;color:' + dw.color + ';font-weight:700;text-transform:uppercase;letter-spacing:.5px">Today\'s Workout</div><div style="font-size:14px;font-weight:700;margin-top:2px">' + dw.title + '</div><div style="font-size:11px;color:var(--dim);margin-top:2px">⏱ ' + dw.dur + ' · ' + dw.ex.length + ' exercises</div></div><span style="color:var(--dim);font-size:18px">→</span></div></div>';
o += '<div class="card"><div style="font-size:14px;font-weight:700;margin-bottom:10px;display:flex;gap:8px;align-items:center">Checklist <span style="font-size:11px;color:var(--accent);font-family:\'Space Mono\',monospace">' + cnt(CW, t0) + '/' + HABITS.length + '</span></div>';
HABITS.forEach(h => { const c = isH(CW, h.id, t0); o += '<div class="habit ' + (c ? "checked" : "") + '" onclick="togH(\'' + CW + '\',\'' + h.id + '\',' + t0 + ')"><span class="habit-icon">' + h.icon + '</span><div class="habit-info"><div class="habit-label">' + h.label + '</div>' + (h.critical && !c ? '<div class="habit-critical">Critical — don\'t skip</div>' : '') + '</div><div class="cb"><span class="cm">✓</span></div></div>'; });
o += '</div><div class="card"><div style="font-size:14px;font-weight:700;margin-bottom:10px">📅 Schedule</div>';
SCHEDULE.forEach((s, i) => { const op = S.sched === i; o += '<div class="si ' + (op ? "open" : "") + '" onclick="S.sched=' + (op ? "null" : i) + ';R()"><div class="si-time">' + s.time + '</div><div class="si-main"><div class="si-head"><span>' + s.icon + '</span><span>' + s.act + '</span></div><div class="si-detail">' + s.det + '</div></div><div class="si-dot" style="background:' + TC[s.tag] + '"></div></div>'; });
o += '</div>';
}

else if (S.tab === "tracker") {
const sd = S.day, vw = getWID(S.wOff), isC = vw === CW;
o += '<div class="wnav"><button class="wnav-btn" onclick="S.wOff--;R()">‹</button><div><div class="wnav-label">' + (isC ? "This Week" : wkDates(vw)) + '</div><div class="wnav-sub">' + vw + '</div></div><button class="wnav-btn ' + (S.wOff >= 0 ? "disabled" : "") + '" onclick="if(S.wOff<0){S.wOff++;R()}">›</button></div>';
o += '<div class="days">'; DAYS.forEach((d, i) => { o += '<button class="dp ' + (sd === i ? "active" : isC && i === t0 ? "today" : "") + '" onclick="setDay(' + i + ')"><div>' + d + '</div><div class="dp-count">' + cnt(vw, i) + '/' + HABITS.length + '</div></button>'; }); o += '</div>';
const vws = wsc(vw);
o += '<div class="card" style="padding:14px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span style="font-size:12px;font-weight:600">Adherence</span><span style="font-size:16px;font-weight:700;color:' + (vws >= 85 ? "var(--green)" : "var(--orange)") + ';font-family:\'Space Mono\',monospace">' + vws + '%</span></div><div class="prog-bar"><div class="prog-fill" style="width:' + vws + '%;background:' + (vws >= 85 ? "linear-gradient(90deg,#10B981,#14F5C6)" : "linear-gradient(90deg,#F59E0B,#FBBF24)") + '"></div></div></div>';
o += '<div style="font-size:13px;font-weight:700;margin-bottom:8px;color:var(--muted)">' + FDAYS[sd] + '</div>';
HABITS.forEach(h => { const c = isH(vw, h.id, sd); o += '<div class="habit ' + (c ? "checked" : "") + '" onclick="togH(\'' + vw + '\',\'' + h.id + '\',' + sd + ')"><span class="habit-icon">' + h.icon + '</span><div class="habit-info"><div class="habit-label">' + h.label + '</div>' + (h.critical && !c ? '<div class="habit-critical">Critical</div>' : '') + '</div><div class="cb"><span class="cm">✓</span></div></div>'; });
o += '<div class="med-rem"><div style="font-size:13px;font-weight:700;color:var(--red);margin-bottom:6px">💊 Meds & Supps</div><div style="font-size:12px;color:var(--muted);line-height:1.6"><b style="color:var(--text)">AM:</b> Prescribed meds + supplements<br><b style="color:var(--text)">PM:</b> Prescribed meds + supplements</div></div>';
}

else if (S.tab === "workout") {
const sd = S.day, dk = DAYS[sd], w = WK[dk], VW = CW;
o += '<div class="days">'; DAYS.forEach((d, i) => { const wt = WK[d]; o += '<button class="dp" onclick="setDay(' + i + ');S.exO=null;R()" style="background:' + (sd === i ? wt.color : "rgba(255,255,255,.05)") + ';color:' + (sd === i ? "#fff" : "var(--dim)") + '">' + d + '</button>'; }); o += '</div>';
o += '<div class="card"><div style="font-size:17px;font-weight:700">' + w.title + '</div><div style="display:flex;gap:8px;margin-top:6px"><span style="font-size:10px;font-weight:700;padding:3px 8px;border-radius:6px;background:' + w.color + '22;color:' + w.color + ';text-transform:uppercase">' + w.type + '</span><span style="font-size:10px;font-weight:600;padding:3px 8px;border-radius:6px;background:rgba(255,255,255,.06);color:var(--muted)">⏱ ' + w.dur + '</span></div></div>';
w.ex.forEach((ex, ei) => {
const op = S.exO === ei, ns = ex.s;
const allD = Array.from({ length: ns }, (_, si) => iSD(VW, dk, ei, si)).every(Boolean);
o += '<div class="ex-card ' + (op ? "open" : "") + '"><div class="ex-header" onclick="S.exO=' + (op ? "null" : ei) + ';R()"><div class="ex-num" style="background:' + (allD ? "rgba(16,185,129,.2)" : "rgba(255,255,255,.06)") + ';color:' + (allD ? "var(--green)" : "var(--dim)") + '">' + (allD ? "✓" : ei + 1) + '</div><div class="ex-info"><div class="ex-name" style="color:' + (allD ? "var(--green)" : "var(--text)") + '">' + ex.n + '</div>' + (ex.m ? '<div class="ex-muscle">' + ex.m + '</div>' : '') + '</div><div class="ex-sets-badge" style="background:' + w.color + '18;color:' + w.color + '">' + ns + '×' + ex.r + '</div></div>';
if (op) {
  o += '<div class="ex-body">';
  if (ex.rest !== "—") o += '<div style="font-size:10px;color:var(--dim);margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,.04)">Rest: <b style="color:var(--muted)">' + ex.rest + '</b></div>';
  for (let si = 0; si < ns; si++) {
    const done = iSD(VW, dk, ei, si), wgt = gS(VW, dk, ei, si, "w"), rps = gS(VW, dk, ei, si, "r");
    o += '<div class="set-row"><div class="set-label">Set ' + (si + 1) + '</div><div class="set-input">';
    if (w.type === "strength") o += '<input class="set-field" type="number" inputmode="numeric" placeholder="lbs" value="' + wgt + '" onchange="pS(\'' + VW + '\',\'' + dk + '\',' + ei + ',' + si + ',\'w\',this.value)"><span class="set-x">×</span><input class="set-field" type="text" placeholder="' + ex.r + '" value="' + (rps || "") + '" onchange="pS(\'' + VW + '\',\'' + dk + '\',' + ei + ',' + si + ',\'r\',this.value)">';
    else o += '<input class="set-field" style="width:110px" type="text" placeholder="' + ex.r + '" value="' + (rps || "") + '" onchange="pS(\'' + VW + '\',\'' + dk + '\',' + ei + ',' + si + ',\'r\',this.value)">';
    o += '<div class="set-check ' + (done ? "done" : "") + '" onclick="tSD(\'' + VW + '\',\'' + dk + '\',' + ei + ',' + si + ')"><span style="color:var(--green);font-size:13px;font-weight:700;' + (done ? "" : "display:none") + '">✓</span></div></div></div>';
  }
  o += '</div>';
}
o += '</div>';
});
if (w.type === "strength") o += '<div class="ib ib-r"><b>🔥 Progression</b><span style="color:var(--muted)">Wk 1-4: Form, 12-15 reps. Wk 5+: Add 5-10% weight when easy. Your weights are saved — track your gains week over week!</span></div>';
o += '<div class="ib ib-p"><b>💡 Why Muscle Matters</b><span style="color:var(--muted)">Skeletal muscle is your biggest metabolic engine. More muscle = better metabolism, energy, and body composition. Every rep counts.</span></div>';
}

// MEALS TAB
else if (S.tab === "meals") {
const sd = S.day, dk = DAYS[sd], m = MEALS[dk];
const mv = S.mealView || "daily";

o += '<div class="view-toggle"><button class="view-btn ' + (mv === "daily" ? "active" : "") + '" onclick="S.mealView=\'daily\';R()">📅 Daily Plan</button><button class="view-btn ' + (mv === "library" ? "active" : "") + '" onclick="S.mealView=\'library\';S.libSlot=S.libSlot||\'b\';R()">📚 Meal Library</button></div>';

if (mv === "daily") {
const macros = getDayMacros(dk);
o += '<div class="days">'; DAYS.forEach((d, i) => { o += '<button class="dp" onclick="setDay(' + i + ');S.swapSlot=null;R()" style="background:' + (sd === i ? "var(--green)" : "rgba(255,255,255,.05)") + ';color:' + (sd === i ? "#fff" : "var(--dim)") + '">' + d + '</button>'; }); o += '</div>';
o += '<div class="golden"><div style="font-weight:700;color:var(--orange);margin-bottom:4px;font-size:12px">⭐ Golden Rule</div><div>Protein & veggies FIRST → fats → carbs LAST. Walk 10 min after.</div></div>';

// Search Bar
o += '<div class="search-bar"><span class="search-icon">🔍</span><input class="search-input" type="text" placeholder="Search all meals (name, ingredient, tag...)" value="' + (S.searchQ || "") + '" oninput="S.searchQ=this.value;R()" onclick="event.stopPropagation()" id="meal-search">';
if (S.searchQ) o += '<button class="search-clear" onclick="S.searchQ=\'\';S.addSlot=null;R()">✕</button>';
o += '</div>';

// Search Results
if (S.searchQ && S.searchQ.length >= 2) {
  const sResults = searchMeals(S.searchQ);
  const SLOT_NAMES = { b: "Breakfast", l: "Lunch", d: "Dinner", s: "Snack" };
  o += '<div class="search-results">';
  o += '<div style="font-size:11px;color:var(--dim);margin-bottom:8px;font-weight:600">' + sResults.length + ' result' + (sResults.length !== 1 ? "s" : "") + ' for "' + S.searchQ + '"</div>';
  if (sResults.length === 0) o += '<div style="text-align:center;padding:16px;color:var(--dim);font-size:12px">No meals found. Try a different keyword or use ＋ Add New in the swap panel to create one.</div>';
  sResults.slice(0, 12).forEach((sr, sri) => {
    const addKey = sr.srcDay + "_" + sr.srcSlot + "_" + sri;
    const showPicker = S.addSlot === addKey;
    o += '<div class="sr-item">';
    o += '<div class="sr-source">' + sr.srcDay + ' · ' + (SLOT_NAMES[sr.srcSlot] || sr.srcSlot) + '</div>';
    o += '<div class="sr-name">' + sr.t + '</div>';
    o += '<div class="sr-desc">' + sr.d + '</div>';
    o += '<div class="meal-macro-row" style="margin-top:4px"><span class="meal-macro"><b>' + sr.p + 'g</b> P</span><span class="meal-macro"><b>' + sr.c + 'g</b> C</span><span class="meal-macro"><b>' + sr.f + 'g</b> F</span><span class="meal-macro"><b>' + sr.cal + '</b> cal</span></div>';
    o += '<div class="meal-option-tags" style="margin-top:4px">' + (sr.tags || []).filter(t => t !== "custom" && t !== "picked").map(t => { const ti2 = TAG_INFO[t]; return ti2 ? '<span class="meal-tag ' + ti2.c + '">' + ti2.l + '</span>' : '' }).join('') + '</div>';
    o += '<div class="sr-actions">';
    const curSlots = getSlotMeals(dk, sr.srcSlot);
    const alreadyHere = curSlots.some(m2 => m2.t === sr.t);
    if (alreadyHere) {
      o += '<span style="font-size:10px;color:var(--green);font-weight:600;padding:5px 0">✓ Already in ' + FDAYS[sd] + '\'s ' + SLOT_NAMES[sr.srcSlot] + '</span>';
    } else {
      o += '<button class="sr-add-btn" onclick="addSearchResult(\'' + sr.srcDay + '\',\'' + sr.srcSlot + '\',' + sr.srcIdx + ',\'' + dk + '\',\'' + sr.srcSlot + '\')">+ Add to ' + DAYS[sd] + ' ' + SLOT_NAMES[sr.srcSlot] + '</button>';
    }
    o += '<button class="sr-add-btn" style="background:rgba(139,92,246,.1);border-color:rgba(139,92,246,.2);color:var(--purple)" onclick="S.addSlot=' + (showPicker ? "null" : "'" + addKey + "'") + ';R()">' + (showPicker ? "✕ Close" : "📅 Other day") + '</button>';
    o += '</div>';
    if (showPicker) {
      o += '<div class="sr-slot-picker" style="margin-top:8px"><div style="font-size:10px;color:var(--dim);width:100%;margin-bottom:4px;font-weight:600">Pick day & slot:</div>';
      DAYS.forEach(dy => {
        ["b", "l", "d", "s"].forEach(sl => {
          const has = getSlotMeals(dy, sl).some(m2 => m2.t === sr.t);
          o += '<button class="sr-slot-btn" style="' + (has ? "opacity:.4;pointer-events:none;" : "") + 'border-color:' + (has ? "var(--green)" : "var(--border)") + ';color:' + (has ? "var(--green)" : "var(--muted)") + '" onclick="addSearchResult(\'' + sr.srcDay + '\',\'' + sr.srcSlot + '\',' + sr.srcIdx + ',\'' + dy + '\',\'' + sl + '\');S.addSlot=null;R()">' + dy + ' ' + SLOT_NAMES[sl].charAt(0) + '</button>';
        });
      });
      o += '</div>';
    }
    o += '</div>';
  });
  if (sResults.length > 12) o += '<div style="text-align:center;padding:8px;color:var(--dim);font-size:11px">' + (sResults.length - 12) + ' more results — refine your search</div>';
  o += '</div>';
}

// Manage Custom Meals section
const allCustomKeys = Object.keys(customMeals).filter(k => customMeals[k] && customMeals[k].length > 0);
if (allCustomKeys.length > 0 || !S.searchQ) {
  o += '<div class="mgr-section"><div class="mgr-header" onclick="S.mealMgr=!S.mealMgr;R()"><div class="mgr-title">✏️ My Custom Meals' + (allCustomKeys.length > 0 ? " (" + allCustomKeys.reduce((n, k) => n + customMeals[k].length, 0) + ")" : "") + '</div><div class="mgr-toggle">' + (S.mealMgr ? "▲" : "▼") + '</div></div>';
  if (S.mealMgr) {
    const SLOT_N = { b: "Breakfast", l: "Lunch", d: "Dinner", s: "Snack" };
    o += '<div class="mgr-body">';
    if (allCustomKeys.length === 0) {
      o += '<div style="text-align:center;padding:14px;color:var(--dim);font-size:12px">No custom meals yet. Use ⇄ Swap → ＋ Add New to create one, or search & add meals from other days.</div>';
    }
    allCustomKeys.sort().forEach(ck => {
      const parts = ck.split("_");
      const cDay = parts[0], cSlot = parts[1];
      customMeals[ck].forEach((cm, ci) => {
        const editKey = ck + "_" + ci;
        const isEditing = S.editKey === editKey;
        o += '<div style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,.04)">';
        o += '<div style="display:flex;justify-content:space-between;align-items:flex-start">';
        o += '<div style="flex:1"><div style="font-size:12px;font-weight:600;color:var(--text)">' + cm.t + '</div>';
        o += '<div style="font-size:10px;color:var(--dim);margin-top:1px">' + cDay + ' · ' + (SLOT_N[cSlot] || cSlot) + '</div>';
        o += '<div class="meal-macro-row" style="margin-top:2px"><span class="meal-macro"><b>' + cm.p + 'g</b> P</span><span class="meal-macro"><b>' + cm.c + 'g</b> C</span><span class="meal-macro"><b>' + cm.f + 'g</b> F</span><span class="meal-macro"><b>' + cm.cal + '</b> cal</span></div>';
        o += '</div>';
        o += '<div style="display:flex;gap:6px">';
        o += '<button style="background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.2);color:var(--purple);font-size:10px;font-weight:700;padding:4px 8px;border-radius:5px;cursor:pointer;font-family:\'DM Sans\',sans-serif" onclick="S.editKey=' + (isEditing ? "null" : "'" + editKey + "'") + ';R()">✏️</button>';
        o += '<button style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);color:var(--red);font-size:10px;font-weight:700;padding:4px 8px;border-radius:5px;cursor:pointer;font-family:\'DM Sans\',sans-serif" onclick="delCustomMeal(\'' + cDay + '\',\'' + cSlot + '\',' + ci + ')">✕</button>';
        o += '</div></div>';
        if (isEditing) {
          o += '<div class="edit-form">';
          o += '<input id="em_name" class="cf-input cf-full" type="text" value="' + cm.t.replace(/"/g, '&quot;') + '" placeholder="Meal name *" onclick="event.stopPropagation()" style="margin-bottom:6px">';
          o += '<input id="em_desc" class="cf-input cf-full" type="text" value="' + cm.d.replace(/"/g, '&quot;') + '" placeholder="Description" onclick="event.stopPropagation()" style="margin-bottom:6px">';
          o += '<div class="cf-row" style="margin-bottom:6px">';
          o += '<div class="cf-field"><label class="cf-label">Protein</label><input id="em_p" class="cf-input" type="number" inputmode="numeric" value="' + cm.p + '" onclick="event.stopPropagation()"></div>';
          o += '<div class="cf-field"><label class="cf-label">Carbs</label><input id="em_c" class="cf-input" type="number" inputmode="numeric" value="' + cm.c + '" onclick="event.stopPropagation()"></div>';
          o += '</div>';
          o += '<div class="cf-row" style="margin-bottom:6px">';
          o += '<div class="cf-field"><label class="cf-label">Fiber</label><input id="em_f" class="cf-input" type="number" inputmode="numeric" value="' + cm.f + '" onclick="event.stopPropagation()"></div>';
          o += '<div class="cf-field"><label class="cf-label">Calories</label><input id="em_cal" class="cf-input" type="number" inputmode="numeric" value="' + cm.cal + '" onclick="event.stopPropagation()"></div>';
          o += '</div>';
          o += '<div class="edit-btns"><button class="edit-save" onclick="saveEditMeal(\'' + cDay + '\',\'' + cSlot + '\',' + ci + ')">✓ Save</button><button class="edit-cancel" onclick="S.editKey=null;R()">Cancel</button></div>';
          o += '</div>';
        }
        o += '</div>';
      });
    });
    o += '</div>';
  }
  o += '</div>';
}

// Daily macro summary
const carbOk = macros.c <= 150, protOk = macros.p >= 120, fibOk = macros.f >= 35;
o += '<div class="card" style="padding:12px;margin-bottom:10px;background:rgba(20,245,198,.04);border-color:rgba(20,245,198,.15)">';
o += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span style="font-size:12px;font-weight:700;color:var(--accent)">📊 Today\'s Plan</span><span style="font-size:11px;color:var(--dim);font-family:\'Space Mono\',monospace">' + macros.cal + ' cal</span></div>';
o += '<div style="display:flex;gap:8px">';
o += '<div style="flex:1;text-align:center;padding:6px;background:rgba(255,255,255,.04);border-radius:6px;border:1px solid ' + (protOk ? "rgba(16,185,129,.3)" : "rgba(245,158,11,.3)") + '"><div style="font-size:14px;font-weight:700;color:' + (protOk ? "var(--green)" : "var(--orange)") + ';font-family:\'Space Mono\',monospace">' + macros.p + 'g</div><div style="font-size:9px;color:var(--dim);margin-top:1px">PROTEIN</div></div>';
o += '<div style="flex:1;text-align:center;padding:6px;background:rgba(255,255,255,.04);border-radius:6px;border:1px solid ' + (carbOk ? "rgba(16,185,129,.3)" : "rgba(245,158,11,.3)") + '"><div style="font-size:14px;font-weight:700;color:' + (carbOk ? "var(--green)" : "var(--orange)") + ';font-family:\'Space Mono\',monospace">' + macros.c + 'g</div><div style="font-size:9px;color:var(--dim);margin-top:1px">CARBS</div></div>';
o += '<div style="flex:1;text-align:center;padding:6px;background:rgba(255,255,255,.04);border-radius:6px;border:1px solid ' + (fibOk ? "rgba(16,185,129,.3)" : "rgba(245,158,11,.3)") + '"><div style="font-size:14px;font-weight:700;color:' + (fibOk ? "var(--green)" : "var(--orange)") + ';font-family:\'Space Mono\',monospace">' + macros.f + 'g</div><div style="font-size:9px;color:var(--dim);margin-top:1px">FIBER</div></div>';
o += '</div></div>';

// Meal slots with swap
MTS.forEach(mt2 => {
  const opts = getSlotMeals(dk, mt2.k);
  const selIdx = getMealChoice(dk, mt2.k);
  const ml = opts[selIdx] || opts[0];
  const swapId = dk + "_" + mt2.k;
  const isSwapping = S.swapSlot === swapId;
  const isOpen = S.meal === swapId;

  o += '<div class="mc ' + (isSwapping ? "swapping" : isOpen ? "open" : "") + '" style="border-left-color:' + mt2.cl + '">';
  o += '<div class="meal-selected-header">';
  o += '<div style="display:flex;align-items:center;gap:8px;flex:1;cursor:pointer" onclick="S.meal=' + (isOpen ? "null" : "'" + swapId + "'") + ';S.swapSlot=null;R()"><span style="font-size:20px">' + mt2.ic + '</span><div><div class="mt" style="color:' + mt2.cl + '">' + mt2.lb + ' — ' + mt2.tm + '</div><div class="mtitle">' + ml.t + (ml.custom ? '<span style="font-size:9px;margin-left:6px;padding:1px 5px;border-radius:3px;background:rgba(139,92,246,.15);color:var(--purple);vertical-align:middle">CUSTOM</span>' : ml.tags && ml.tags.includes("picked") ? '<span style="font-size:9px;margin-left:6px;padding:1px 5px;border-radius:3px;background:rgba(59,130,246,.15);color:var(--blue);vertical-align:middle">PICKED</span>' : "") + '</div></div></div>';
  o += '<button class="meal-swap-btn" onclick="event.stopPropagation();toggleSwap(\'' + dk + '\',\'' + mt2.k + '\')">' + (isSwapping ? "✕ Close" : "⇄ Swap") + '</button>';
  o += '</div>';

  if (isOpen && !isSwapping) {
    o += '<div class="md" style="display:block;animation:fadeIn .2s">' + ml.d;
    o += '<div class="meal-macro-row"><span class="meal-macro"><b>' + ml.p + 'g</b> protein</span><span class="meal-macro"><b>' + ml.c + 'g</b> carbs</span><span class="meal-macro"><b>' + ml.f + 'g</b> fiber</span><span class="meal-macro"><b>' + ml.cal + '</b> cal</span></div>';
    o += '<div class="meal-option-tags" style="margin-top:6px">' + (ml.tags || []).map(t => { const ti2 = TAG_INFO[t]; return ti2 ? '<span class="meal-tag ' + ti2.c + '">' + ti2.l + '</span>' : '' }).join('') + '</div>';
    o += '</div>';
  }

  if (isSwapping) {
    o += '<div class="meal-options-panel" style="display:block">';
    const st = S.swapTab || "today";
    o += '<div class="swap-tabs">';
    o += '<button class="swap-tab ' + (st === "today" ? "active" : "") + '" onclick="event.stopPropagation();S.swapTab=\'today\';S.browseDay=null;R()">📋 Today</button>';
    o += '<button class="swap-tab ' + (st === "browse" ? "active" : "") + '" onclick="event.stopPropagation();S.swapTab=\'browse\';R()">📅 All Days</button>';
    o += '<button class="swap-tab ' + (st === "add" ? "active" : "") + '" onclick="event.stopPropagation();S.swapTab=\'add\';R()">＋ Add New</button>';
    o += '<button class="swap-tab ' + (st === "mymeals" ? "active" : "") + '" onclick="event.stopPropagation();S.swapTab=\'mymeals\';R()">⭐ My Meals</button>';
    o += '</div>';

    if (st === "today") {
      o += '<div style="font-size:11px;color:var(--dim);margin-bottom:8px;font-weight:600">Choose from ' + FDAYS[sd] + '\'s options:</div>';
      opts.forEach((opt, oi) => {
        const isCurrent = oi === selIdx;
        const isCust = opt.custom || false;
        const isPicked = opt.tags && opt.tags.includes("picked");
        const custIdx = isCust ? oi - MEALS[dk][mt2.k].length : -1;
        o += '<div class="meal-option ' + (isCurrent ? "current" : "") + '" onclick="event.stopPropagation();setMealChoice(\'' + dk + '\',\'' + mt2.k + '\',' + oi + ')">';
        o += '<div class="meal-option-info"><div class="meal-option-name">' + opt.t;
        if (isCust) o += '<span style="font-size:9px;margin-left:6px;padding:1px 5px;border-radius:3px;background:rgba(139,92,246,.15);color:var(--purple)">CUSTOM</span>';
        if (isPicked) o += '<span style="font-size:9px;margin-left:6px;padding:1px 5px;border-radius:3px;background:rgba(59,130,246,.15);color:var(--blue)">PICKED</span>';
        o += '</div>';
        o += '<div class="meal-option-desc">' + opt.d + '</div>';
        o += '<div class="meal-option-tags">' + (opt.tags || []).map(t => { const ti2 = TAG_INFO[t]; return ti2 ? '<span class="meal-tag ' + ti2.c + '">' + ti2.l + '</span>' : '' }).join('') + '</div>';
        o += '<div class="meal-macro-row"><span class="meal-macro"><b>' + opt.p + 'g</b> P</span><span class="meal-macro"><b>' + opt.c + 'g</b> C</span><span class="meal-macro"><b>' + opt.f + 'g</b> F</span><span class="meal-macro"><b>' + opt.cal + '</b> cal</span></div>';
        o += '</div>';
        o += '<div style="display:flex;flex-direction:column;align-items:center;gap:4px">';
        o += '<div class="meal-check">' + (isCurrent ? '<span style="color:var(--green);font-size:12px;font-weight:700">✓</span>' : '') + '</div>';
        if (isCust) o += '<div onclick="event.stopPropagation();delCustomMeal(\'' + dk + '\',\'' + mt2.k + '\',' + custIdx + ')" style="font-size:10px;color:var(--red);cursor:pointer;padding:2px">✕</div>';
        o += '</div></div>';
      });
    }

    else if (st === "browse") {
      const bd = S.browseDay;
      o += '<div style="font-size:11px;color:var(--dim);margin-bottom:8px;font-weight:600">Pick a meal from any day to add to ' + FDAYS[sd] + ':</div>';
      o += '<div style="display:flex;gap:4px;margin-bottom:10px;flex-wrap:wrap">';
      DAYS.forEach((dy, di) => {
        const isCur = dy === dk && !bd;
        const isSel = bd === dy;
        o += '<button onclick="event.stopPropagation();S.browseDay=\'' + dy + '\';R()" style="flex:1;min-width:36px;padding:5px 2px;border-radius:8px;border:1px solid ' + (isSel ? "var(--accent)" : isCur ? "rgba(16,185,129,.3)" : "var(--border)") + ';background:' + (isSel ? "rgba(20,245,198,.15)" : isCur ? "rgba(16,185,129,.06)" : "rgba(255,255,255,.03)") + ';color:' + (isSel ? "var(--accent)" : isCur ? "var(--green)" : "var(--dim)") + ';font-size:11px;font-weight:700;font-family:\'DM Sans\',sans-serif;cursor:pointer">' + dy + '</button>';
      });
      o += '</div>';
      if (bd) {
        const browseOpts = getSlotMeals(bd, mt2.k);
        o += '<div style="font-size:10px;color:var(--accent);font-weight:700;margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">' + FDAYS[DAYS.indexOf(bd)] + '\'s ' + mt2.lb + ' options</div>';
        browseOpts.forEach((opt, oi) => {
          const allCur = getSlotMeals(dk, mt2.k);
          const alreadyHere = allCur.some(m2 => m2.t === opt.t);
          o += '<div class="meal-option ' + (alreadyHere ? "current" : "") + '" onclick="event.stopPropagation();' + (alreadyHere ? "" : "pickFromDay('" + bd + "','" + mt2.k + "','" + dk + "','" + mt2.k + "'," + oi + ")") + '">';
          o += '<div class="meal-option-info"><div class="meal-option-name">' + opt.t + '</div>';
          o += '<div class="meal-option-desc">' + opt.d + '</div>';
          o += '<div class="meal-macro-row"><span class="meal-macro"><b>' + opt.p + 'g</b> P</span><span class="meal-macro"><b>' + opt.c + 'g</b> C</span><span class="meal-macro"><b>' + opt.f + 'g</b> F</span><span class="meal-macro"><b>' + opt.cal + '</b> cal</span></div>';
          o += '</div>';
          o += '<div class="meal-check">' + (alreadyHere ? '<span style="color:var(--green);font-size:10px">added</span>' : '<span style="color:var(--accent);font-size:16px">+</span>') + '</div>';
          o += '</div>';
        });
      } else {
        o += '<div style="text-align:center;padding:20px 10px;color:var(--dim);font-size:12px">👆 Tap a day above to browse its ' + mt2.lb + ' options</div>';
      }
    }

    else if (st === "add") {
      o += '<div style="font-size:11px;color:var(--dim);margin-bottom:10px;font-weight:600">Add your own meal to ' + FDAYS[sd] + '\'s ' + mt2.lb + ':</div>';
      o += '<div class="custom-form">';
      o += '<input id="cm_name" class="cf-input cf-full" type="text" placeholder="Meal name *" onclick="event.stopPropagation()">';
      o += '<input id="cm_desc" class="cf-input cf-full" type="text" placeholder="Description (ingredients, prep notes)" onclick="event.stopPropagation()">';
      o += '<div class="cf-row">';
      o += '<div class="cf-field"><label class="cf-label">Protein (g)</label><input id="cm_p" class="cf-input" type="number" inputmode="numeric" placeholder="0" onclick="event.stopPropagation()"></div>';
      o += '<div class="cf-field"><label class="cf-label">Carbs (g)</label><input id="cm_c" class="cf-input" type="number" inputmode="numeric" placeholder="0" onclick="event.stopPropagation()"></div>';
      o += '</div>';
      o += '<div class="cf-row">';
      o += '<div class="cf-field"><label class="cf-label">Fiber (g)</label><input id="cm_f" class="cf-input" type="number" inputmode="numeric" placeholder="0" onclick="event.stopPropagation()"></div>';
      o += '<div class="cf-field"><label class="cf-label">Calories</label><input id="cm_cal" class="cf-input" type="number" inputmode="numeric" placeholder="0" onclick="event.stopPropagation()"></div>';
      o += '</div>';
      o += '<button class="cf-submit" onclick="event.stopPropagation();addCustomMeal(\'' + dk + '\',\'' + mt2.k + '\')">✓ Add Meal</button>';
      o += '</div>';
    }

    else if (st === "mymeals") {
      const myMeals = getAllCustomMeals();
      window._myMealsCache = myMeals;
      if (myMeals.length === 0) {
        o += '<div style="text-align:center;padding:24px 10px;color:var(--dim);font-size:12px">';
        o += '<div style="font-size:28px;margin-bottom:8px">🍽️</div>';
        o += 'No custom meals yet.<br>Use <b>＋ Add New</b> to create your first meal!</div>';
      } else {
        o += '<div style="font-size:11px;color:var(--dim);margin-bottom:8px;font-weight:600">Your custom meals (' + myMeals.length + '):</div>';
        const curSlotMeals = getSlotMeals(dk, mt2.k);
        const curSelIdx = getMealChoice(dk, mt2.k);
        const curSelName = (curSlotMeals[curSelIdx] || curSlotMeals[0] || {}).t;
        myMeals.forEach((opt, oi) => {
          const slotIdx = curSlotMeals.findIndex(m2 => m2.t === opt.t);
          const alreadyHere = slotIdx >= 0;
          const isSelected = opt.t === curSelName;
          o += '<div class="meal-option ' + (isSelected ? "current" : "") + '" onclick="event.stopPropagation();';
          if (alreadyHere) {
            o += "setMealChoice('" + dk + "','" + mt2.k + "'," + slotIdx + ")";
          } else {
            o += "addFromMyMeals(" + oi + ",'" + dk + "','" + mt2.k + "')";
          }
          o += '">';
          o += '<div class="meal-option-info"><div class="meal-option-name">' + opt.t;
          o += '<span style="font-size:9px;margin-left:6px;padding:1px 5px;border-radius:3px;background:rgba(139,92,246,.15);color:var(--purple)">CUSTOM</span>';
          o += '</div>';
          o += '<div class="meal-option-desc">' + (opt.d || 'Custom meal') + '</div>';
          o += '<div class="meal-option-tags">' + (opt.tags || []).map(function(t) { var ti2 = TAG_INFO[t]; return ti2 ? '<span class="meal-tag ' + ti2.c + '">' + ti2.l + '</span>' : '' }).join('') + '</div>';
          o += '<div class="meal-macro-row"><span class="meal-macro"><b>' + opt.p + 'g</b> P</span><span class="meal-macro"><b>' + opt.c + 'g</b> C</span><span class="meal-macro"><b>' + opt.f + 'g</b> F</span><span class="meal-macro"><b>' + opt.cal + '</b> cal</span></div>';
          o += '</div>';
          o += '<div class="meal-check">';
          if (isSelected) {
            o += '<span style="color:var(--green);font-size:12px;font-weight:700">✓</span>';
          } else if (alreadyHere) {
            o += '<span style="color:var(--accent);font-size:10px">select</span>';
          } else {
            o += '<span style="color:var(--accent);font-size:16px">+</span>';
          }
          o += '</div></div>';
        });
      }
    }

    o += '</div>';
  }
  o += '</div>';
});

o += '<div class="card" style="background:rgba(16,185,129,.06);border-color:rgba(16,185,129,.2);margin-top:6px"><div style="font-size:12px;font-weight:700;color:var(--green);margin-bottom:6px">🎯 Daily Targets</div><div class="macro-grid"><div class="macro"><div class="macro-val">130-150g</div><div class="macro-label">Carbs</div></div><div class="macro"><div class="macro-val">120-150g</div><div class="macro-label">Protein</div></div><div class="macro"><div class="macro-val">35g+</div><div class="macro-label">Fiber</div></div><div class="macro"><div class="macro-val">2.5-3L</div><div class="macro-label">Water</div></div></div></div>';
o += '<div class="ib ib-g"><b>💡 Tips</b><span style="color:var(--muted)">⇄ Swap to browse options, pick from other days, or add your own meals with macros. The macro bar updates live so you always know where you stand.</span></div>';
} // end daily view

// LIBRARY VIEW
else {
const ls = S.libSlot || "b";
const lt = S.libTag;
const lso = S.libSort || "default";
const SLOT_NAMES = { b: "Breakfast", l: "Lunch", d: "Dinner", s: "Snack" };
const SLOT_ICONS = { b: "🍳", l: "🥗", s: "🥜", d: "🍽️" };

o += '<div class="lib-slots">';
["b", "l", "s", "d"].forEach(sl => {
  o += '<button class="lib-slot ' + (ls === sl ? "active" : "") + '" onclick="S.libSlot=\'' + sl + '\';S.libTag=null;S.libExpand=null;S.libAddTarget=null;R()"><span style="font-size:16px">' + SLOT_ICONS[sl] + '</span><br>' + SLOT_NAMES[sl] + '</button>';
});
o += '</div>';

const tags = getSlotTags(ls);
o += '<div class="lib-filters">';
o += '<button class="lib-filter ' + (!lt ? "active" : "") + '" onclick="S.libTag=null;S.libExpand=null;R()">All</button>';
tags.forEach(t => {
  const ti2 = TAG_INFO[t];
  if (ti2) o += '<button class="lib-filter ' + (lt === t ? "active" : "") + '" onclick="S.libTag=' + (lt === t ? "null" : "'" + t + "'") + ';S.libExpand=null;R()">' + ti2.l + '</button>';
});
o += '</div>';

o += '<div class="lib-sort">';
o += '<span style="font-size:9px;color:var(--dim);margin-right:2px">Sort:</span>';
[{ k: "default", l: "Default" }, { k: "protein", l: "Protein ↑" }, { k: "carbs", l: "Carbs ↓" }, { k: "fiber", l: "Fiber ↑" }, { k: "cal_low", l: "Cal ↓" }, { k: "cal_high", l: "Cal ↑" }].forEach(s => {
  o += '<button class="lib-sort-btn ' + (lso === s.k ? "active" : "") + '" onclick="S.libSort=\'' + s.k + '\';R()">' + s.l + '</button>';
});
o += '</div>';

const libMeals = getMealLibrary(ls, lt, lso);
o += '<div class="lib-count">' + libMeals.length + ' ' + SLOT_NAMES[ls].toLowerCase() + ' option' + (libMeals.length !== 1 ? "s" : "") + '</div>';

libMeals.forEach((lm, li) => {
  const isExp = S.libExpand === li;
  const showAdd = S.libAddTarget === li;
  const isEditing = S.libEdit === li;
  const carbWarn = lm.c > 30;
  const isCust = !!lm.custom;
  const isPicked = !!(lm.tags && lm.tags.includes("picked"));
  const isEdited = !!mealEdits[lm.t];
  o += '<div class="lib-card" style="' + (isEdited ? "border-color:rgba(139,92,246,.3)" : "") + '">';
  o += '<div class="lib-card-head" onclick="S.libExpand=' + (isExp ? "null" : li) + ';S.libAddTarget=null;S.libEdit=null;R()">';
  o += '<div class="lib-card-left"><div class="lib-card-name">' + lm.t;
  if (isCust) o += '<span style="font-size:8px;margin-left:5px;padding:1px 4px;border-radius:3px;background:rgba(139,92,246,.15);color:var(--purple);vertical-align:middle">C</span>';
  if (isPicked) o += '<span style="font-size:8px;margin-left:3px;padding:1px 4px;border-radius:3px;background:rgba(59,130,246,.15);color:var(--blue);vertical-align:middle">P</span>';
  if (isEdited) o += '<span style="font-size:8px;margin-left:3px;padding:1px 4px;border-radius:3px;background:rgba(245,158,11,.15);color:var(--orange);vertical-align:middle">✏</span>';
  o += '</div>';
  o += '<div class="lib-card-macros"><span class="lib-card-macro"><b>' + lm.p + 'g</b> P</span><span class="lib-card-macro" style="' + (carbWarn ? "color:var(--orange)" : "") + '"><b>' + lm.c + 'g</b> C</span><span class="lib-card-macro"><b>' + lm.f + 'g</b> F</span></div>';
  o += '</div>';
  o += '<div style="display:flex;align-items:center;gap:8px"><div class="lib-card-cal">' + lm.cal + '</div><span style="color:var(--dim);font-size:12px">' + (isExp ? "▲" : "▼") + '</span></div>';
  o += '</div>';

  if (isExp) {
    o += '<div class="lib-card-body">';
    if (isEditing) {
      o += '<div class="edit-form" style="margin-bottom:10px">';
      o += '<div style="font-size:10px;font-weight:700;color:var(--purple);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">✏️ Edit Meal</div>';
      o += '<input id="le_name" class="cf-input cf-full" type="text" value="' + lm.t.replace(/"/g, '&quot;') + '" placeholder="Meal name *" onclick="event.stopPropagation()" style="margin-bottom:6px">';
      o += '<input id="le_desc" class="cf-input cf-full" type="text" value="' + lm.d.replace(/"/g, '&quot;') + '" placeholder="Description" onclick="event.stopPropagation()" style="margin-bottom:6px">';
      o += '<div class="cf-row" style="margin-bottom:6px">';
      o += '<div class="cf-field"><label class="cf-label">Protein</label><input id="le_p" class="cf-input" type="number" inputmode="numeric" value="' + lm.p + '" onclick="event.stopPropagation()"></div>';
      o += '<div class="cf-field"><label class="cf-label">Carbs</label><input id="le_c" class="cf-input" type="number" inputmode="numeric" value="' + lm.c + '" onclick="event.stopPropagation()"></div>';
      o += '</div>';
      o += '<div class="cf-row" style="margin-bottom:6px">';
      o += '<div class="cf-field"><label class="cf-label">Fiber</label><input id="le_f" class="cf-input" type="number" inputmode="numeric" value="' + lm.f + '" onclick="event.stopPropagation()"></div>';
      o += '<div class="cf-field"><label class="cf-label">Calories</label><input id="le_cal" class="cf-input" type="number" inputmode="numeric" value="' + lm.cal + '" onclick="event.stopPropagation()"></div>';
      o += '</div>';
      o += '<div class="edit-btns"><button class="edit-save" onclick="event.stopPropagation();libSaveEdit(\'' + lm.t.replace(/'/g, "\\'") + '\')">✓ Save Changes</button><button class="edit-cancel" onclick="event.stopPropagation();S.libEdit=null;R()">Cancel</button></div>';
      if (isEdited) o += '<button style="margin-top:6px;background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.2);color:var(--orange);padding:6px 10px;border-radius:6px;font-size:10px;font-weight:700;font-family:\'DM Sans\',sans-serif;cursor:pointer;width:100%" onclick="event.stopPropagation();delete mealEdits[\'' + lm.t.replace(/'/g, "\\'") + '\'];saveEditDB();S.libEdit=null;R()">↩ Revert to original</button>';
      o += '</div>';
    } else {
      o += '<div class="lib-card-desc">' + lm.d + '</div>';
      o += '<div class="meal-option-tags" style="margin-bottom:8px">' + (lm.tags || []).filter(t => t !== "custom" && t !== "picked").map(t => { const ti2 = TAG_INFO[t]; return ti2 ? '<span class="meal-tag ' + ti2.c + '">' + ti2.l + '</span>' : '' }).join('') + '</div>';
      o += '<div style="font-size:10px;color:var(--dim);font-weight:600;margin-bottom:4px">Available on:</div>';
      o += '<div class="lib-card-days">';
      DAYS.forEach(dy => {
        const isOn = lm.onDays.includes(dy);
        o += '<span class="lib-day-chip ' + (isOn ? "on" : "") + '">' + dy + '</span>';
      });
      o += '</div>';
      o += '<div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">';
      o += '<button class="sr-add-btn" style="font-size:11px;padding:6px 12px" onclick="event.stopPropagation();S.libAddTarget=' + (showAdd ? "null" : li) + ';R()">' + (showAdd ? "✕ Cancel" : "＋ Add to a day") + '</button>';
      o += '<button class="sr-add-btn" style="font-size:11px;padding:6px 12px;background:rgba(139,92,246,.1);border-color:rgba(139,92,246,.2);color:var(--purple)" onclick="event.stopPropagation();S.libEdit=' + li + ';S.libAddTarget=null;R()">✏️ Edit</button>';
      o += '<button class="sr-add-btn" style="font-size:11px;padding:6px 12px;background:rgba(239,68,68,.08);border-color:rgba(239,68,68,.2);color:var(--red)" onclick="event.stopPropagation();libDeleteMeal(\'' + lm.t.replace(/'/g, "\\'") + '\',' + (isCust || isPicked) + ')">' + (isCust || isPicked ? "🗑 Delete" : "👁 Hide") + '</button>';
      o += '</div>';
      if (showAdd) {
        o += '<div class="lib-add-row">';
        DAYS.forEach(dy => {
          const has = getSlotMeals(dy, ls).some(x => x.t === lm.t);
          o += '<button class="lib-add-day ' + (has ? "has" : "") + '" onclick="event.stopPropagation();' + (has ? "" : "libAddTo('" + lm.srcDay + "','" + lm.srcSlot + "'," + lm.srcIdx + ",'" + dy + "')") + '">' + dy + (has ? " ✓" : "") + '</button>';
        });
        o += '</div>';
      }
    }
    o += '</div>';
  }
  o += '</div>';
});

if (libMeals.length === 0) o += '<div style="text-align:center;padding:24px;color:var(--dim);font-size:12px">No meals match this filter. Try a different tag or clear filters.</div>';

if (hiddenMeals.length > 0) {
o += '<div class="mgr-section" style="margin-top:10px"><div class="mgr-header" onclick="S.showHidden=!S.showHidden;R()"><div class="mgr-title" style="color:var(--dim)">👁 Hidden Meals (' + hiddenMeals.length + ')</div><div class="mgr-toggle">' + (S.showHidden ? "▲" : "▼") + '</div></div>';
if (S.showHidden) {
  o += '<div class="mgr-body">';
  o += '<div style="font-size:11px;color:var(--dim);margin-bottom:8px">These meals are hidden from all views. Tap to restore.</div>';
  hiddenMeals.forEach(name => {
    o += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span style="font-size:12px;color:var(--muted)">' + name + '</span><button style="background:rgba(20,245,198,.1);border:1px solid rgba(20,245,198,.2);color:var(--accent);font-size:10px;font-weight:700;padding:4px 10px;border-radius:5px;cursor:pointer;font-family:\'DM Sans\',sans-serif" onclick="restoreHidden(\'' + name.replace(/'/g, "\\'") + '\')">Restore</button></div>';
  });
  o += '<button style="margin-top:8px;background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.2);color:var(--orange);font-size:11px;font-weight:700;padding:8px;border-radius:6px;cursor:pointer;font-family:\'DM Sans\',sans-serif;width:100%" onclick="restoreAllHidden()">Restore All (' + hiddenMeals.length + ')</button>';
  o += '</div>';
}
o += '</div>';
}

o += '<div class="ib ib-p" style="margin-top:6px"><b>📚 About the Library</b><span style="color:var(--muted)">Browse all ' + ["b", "l", "d", "s"].reduce((n, sl) => n + getMealLibrary(sl, null, "default").length, 0) + ' unique meals in one place. Filter by tag, sort by macros, and add any meal to any day. Orange carb numbers mean 30g+.</span></div>';
} // end library view
} // end meals tab

else if (S.tab === "targets") {
o += '<div class="card" style="border-color:var(--accent);padding:18px"><div style="font-size:14px;font-weight:700;margin-bottom:4px">🎯 Goal: Optimal Health</div><div style="font-size:12px;color:var(--muted);line-height:1.6">Build sustainable habits with consistent nutrition, exercise, and recovery. Track your progress weekly.</div></div>';
TARGETS.forEach(t => { o += '<div class="card tr"><div class="tr-icon">' + t.i + '</div><div style="flex:1"><div style="font-size:14px;font-weight:700">' + t.l + '</div><div class="tv"><div class="tc"><div class="tl">Now</div><div class="tvl">' + t.c + '</div></div><div class="ta">→</div><div class="tg"><div class="tl">Goal</div><div class="tvl">' + t.t + '</div></div></div></div></div>'; });
const wks = allW().slice(-13).reverse();
if (wks.length > 0) {
  o += '<div class="card"><div style="font-size:13px;font-weight:700;margin-bottom:10px;color:var(--accent)">📈 History (' + wks.length + ' weeks)</div>';
  wks.forEach(w => { const sc = wsc(w), cl = sc >= 85 ? "var(--green)" : sc >= 60 ? "var(--orange)" : "var(--red)";
    o += '<div class="hw"><div class="hw-label">' + w + '</div><div class="hw-bar"><div class="hw-fill" style="width:' + sc + '%;background:' + cl + '"></div></div><div class="hw-pct" style="color:' + cl + '">' + sc + '%</div></div>'; }); o += '</div>';
}
o += '<div class="card"><div style="font-size:13px;font-weight:700;margin-bottom:10px;color:var(--purple)">📋 Labs</div>';
LABS.forEach(l => { o += '<div class="lr"><div><div class="ln">' + l.t + '</div><div class="lf">' + l.f + '</div></div><div class="lnx" style="color:' + (l.u ? "var(--red)" : "var(--accent)") + '">' + l.n + '</div></div>'; }); o += '</div>';
o += '<div class="card" style="background:rgba(239,68,68,.06);border-color:rgba(239,68,68,.2)"><div style="font-size:13px;font-weight:700;color:var(--red);margin-bottom:8px">🗣️ Doctor Visit Notes</div>';
DOC.forEach(d => { o += '<div class="di"><span>●</span><span>' + d + '</span></div>'; }); o += '</div>';
o += '<div class="card"><div style="font-size:13px;font-weight:700;margin-bottom:6px;color:var(--dim)">💾 Data (' + Object.keys(db).length + ' weeks saved)</div><div style="font-size:11px;color:var(--dim);line-height:1.8">Synced to GitHub. Accessible from any device.<br><button class="btn-sm" onclick="if(confirm(\'Copy all data to clipboard?\')){navigator.clipboard.writeText(JSON.stringify(getAllData(),null,2)).then(()=>alert(\'Copied! Save this as a backup.\')).catch(()=>{const t=document.createElement(\'textarea\');t.value=JSON.stringify(getAllData(),null,2);document.body.appendChild(t);t.select();document.execCommand(\'copy\');document.body.removeChild(t);alert(\'Copied!\')})}">📋 Export Backup</button><button class="btn-sm" onclick="const d=prompt(\'Paste backup data:\');if(d){try{const p=JSON.parse(d);db=p.tracker||{};mealSel=p.meals||{};customMeals=p.customMeals||{};mealEdits=p.mealEdits||{};hiddenMeals=p.hiddenMeals||[];storage.saveImmediate(getAllData()).then(()=>{R();alert(\'Restored & synced!\')});}catch(e){alert(\'Invalid data\')}}">📥 Import</button><button class="btn-del" onclick="if(confirm(\'DELETE all data? Cannot undo.\')){db={};mealSel={};customMeals={};mealEdits={};hiddenMeals=[];storage.saveImmediate(getAllData()).then(()=>R())}">🗑 Clear</button></div></div>';
}

o += '</div><div class="tabbar">';
[{ id: "today", ic: "📋", lb: "Today" }, { id: "tracker", ic: "✅", lb: "Tracker" }, { id: "workout", ic: "💪", lb: "Workout" }, { id: "meals", ic: "🥗", lb: "Meals" }, { id: "targets", ic: "🎯", lb: "Targets" }].forEach(t => { o += '<button class="tab ' + (S.tab === t.id ? "active" : "") + '" onclick="setTab(\'' + t.id + '\')"><span class="tab-icon">' + t.ic + '</span><span>' + t.lb + '</span><div class="tab-dot"></div></button>'; });
o += '</div>';
a.innerHTML = o;
// Preserve search focus
const si = document.getElementById("meal-search");
if (si && S.tab === "meals" && S.searchQ) { si.focus(); si.setSelectionRange(S.searchQ.length, S.searchQ.length) }
}
