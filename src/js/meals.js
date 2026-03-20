// Meal-related functions

// Apply overrides to a meal object
function applyEdits(m) {
  const ov = mealEdits[m.t];
  if (!ov) return m;
  return { ...m, ...ov, tags: m.tags };
}

// Get all meals for a day+slot (built-in + custom, with overrides applied, hidden filtered)
function getSlotMeals(day, slot) {
  const built = (MEALS[day] && MEALS[day][slot]) || [];
  const ck = day + "_" + slot;
  const cust = (customMeals[ck] || []).map(m => ({ ...m, custom: true }));
  return [...built, ...cust].filter(m => !hiddenMeals.includes(m.t)).map(applyEdits);
}

function getMealChoice(day, slot) {
  const k = day + "_" + slot;
  return mealSel[k] !== undefined ? mealSel[k] : 0;
}

function setMealChoice(day, slot, idx) {
  mealSel[day + "_" + slot] = idx;
  saveMealDB();
  S.swapSlot = null; S.swapTab = "today"; S.browseDay = null;
  R();
}

// Add custom meal to a day+slot
function addCustomMeal(day, slot) {
  const n = document.getElementById("cm_name");
  const d = document.getElementById("cm_desc");
  const p = document.getElementById("cm_p");
  const c = document.getElementById("cm_c");
  const f = document.getElementById("cm_f");
  const cal = document.getElementById("cm_cal");
  if (!n || !n.value.trim()) { alert("Enter a meal name"); return }
  const meal = {
    t: n.value.trim(),
    d: d.value.trim() || "Custom meal",
    p: parseInt(p.value) || 0,
    c: parseInt(c.value) || 0,
    f: parseInt(f.value) || 0,
    cal: parseInt(cal.value) || 0,
    tags: ["custom"]
  };
  const ck = day + "_" + slot;
  if (!customMeals[ck]) customMeals[ck] = [];
  customMeals[ck].push(meal);
  saveCustomDB();
  const allOpts = getSlotMeals(day, slot);
  setMealChoice(day, slot, allOpts.length - 1);
}

// Delete a custom meal
function delCustomMeal(day, slot, custIdx) {
  const ck = day + "_" + slot;
  if (!customMeals[ck]) return;
  if (!confirm("Delete this custom meal?")) return;
  customMeals[ck].splice(custIdx, 1);
  if (customMeals[ck].length === 0) delete customMeals[ck];
  saveCustomDB();
  const allOpts = getSlotMeals(day, slot);
  const cur = getMealChoice(day, slot);
  if (cur >= allOpts.length) setMealChoice(day, slot, 0);
  else R();
}

// Pick a meal from another day
function pickFromDay(srcDay, srcSlot, tgtDay, tgtSlot, srcIdx) {
  const srcMeals = getSlotMeals(srcDay, srcSlot);
  const meal = srcMeals[srcIdx];
  if (!meal) return;
  const ck = tgtDay + "_" + tgtSlot;
  if (!customMeals[ck]) customMeals[ck] = [];
  const allOpts = getSlotMeals(tgtDay, tgtSlot);
  const exists = allOpts.findIndex(m => m.t === meal.t);
  if (exists >= 0) { setMealChoice(tgtDay, tgtSlot, exists); return }
  customMeals[ck].push({ t: meal.t, d: meal.d, p: meal.p, c: meal.c, f: meal.f, cal: meal.cal, tags: [...(meal.tags || []).filter(t => t !== "custom"), "picked"] });
  saveCustomDB();
  const newAll = getSlotMeals(tgtDay, tgtSlot);
  setMealChoice(tgtDay, tgtSlot, newAll.length - 1);
}

// Build unique meal library grouped by slot
function getMealLibrary(slot, tagFilter, sortBy) {
  const seen = new Set();
  const list = [];
  DAYS.forEach(day => {
    const all = getSlotMeals(day, slot);
    all.forEach((m, i) => {
      const key = m.t;
      if (seen.has(key)) return;
      seen.add(key);
      const onDays = [];
      DAYS.forEach(d2 => {
        const a2 = getSlotMeals(d2, slot);
        if (a2.some(x => x.t === key)) onDays.push(d2);
      });
      list.push({ ...m, onDays, srcDay: day, srcSlot: slot, srcIdx: i });
    });
  });
  let filtered = list;
  if (tagFilter) { filtered = list.filter(m => (m.tags || []).includes(tagFilter)) }
  if (sortBy === "protein") filtered.sort((a, b) => b.p - a.p);
  else if (sortBy === "carbs") filtered.sort((a, b) => a.c - b.c);
  else if (sortBy === "fiber") filtered.sort((a, b) => b.f - a.f);
  else if (sortBy === "cal_low") filtered.sort((a, b) => a.cal - b.cal);
  else if (sortBy === "cal_high") filtered.sort((a, b) => b.cal - a.cal);
  return filtered;
}

// Get all unique tags across a slot
function getSlotTags(slot) {
  const tags = new Set();
  DAYS.forEach(day => {
    getSlotMeals(day, slot).forEach(m => {
      (m.tags || []).forEach(t => { if (t !== "custom" && t !== "picked") tags.add(t) });
    });
  });
  return [...tags].sort();
}

// Add from library to a target day+slot
function libAddTo(srcDay, srcSlot, srcIdx, tgtDay) {
  addSearchResult(srcDay, srcSlot, srcIdx, tgtDay, srcSlot);
  S.libAddTarget = null;
}

// Edit any meal from library
function libSaveEdit(mealName) {
  const n = document.getElementById("le_name"), d = document.getElementById("le_desc"),
    p = document.getElementById("le_p"), c = document.getElementById("le_c"),
    f = document.getElementById("le_f"), cal = document.getElementById("le_cal");
  if (!n || !n.value.trim()) { alert("Enter a meal name"); return }
  const newName = n.value.trim();
  if (newName !== mealName) delete mealEdits[mealName];
  mealEdits[newName] = { t: newName, d: d.value.trim(), p: parseInt(p.value) || 0, c: parseInt(c.value) || 0, f: parseInt(f.value) || 0, cal: parseInt(cal.value) || 0 };
  if (newName !== mealName) {
    Object.keys(customMeals).forEach(ck => {
      customMeals[ck].forEach(cm => { if (cm.t === mealName) cm.t = newName });
    });
    saveCustomDB();
    const hi = hiddenMeals.indexOf(mealName);
    if (hi >= 0) { hiddenMeals[hi] = newName; saveHideDB() }
  }
  saveEditDB();
  S.libEdit = null; R();
}

// Delete/hide a meal from library
function libDeleteMeal(mealName, isCustom) {
  if (isCustom) {
    if (!confirm("Delete '" + mealName + "' from all days?")) return;
    Object.keys(customMeals).forEach(ck => {
      customMeals[ck] = customMeals[ck].filter(m => m.t !== mealName);
      if (customMeals[ck].length === 0) delete customMeals[ck];
    });
    saveCustomDB();
    delete mealEdits[mealName]; saveEditDB();
    DAYS.forEach(day => {
      ["b", "l", "d", "s"].forEach(slot => {
        const all = getSlotMeals(day, slot);
        const cur = getMealChoice(day, slot);
        if (cur >= all.length) setMealChoice(day, slot, 0);
      })
    });
  } else {
    if (!confirm("Hide '" + mealName + "' from all days? You can restore it later.")) return;
    if (!hiddenMeals.includes(mealName)) { hiddenMeals.push(mealName); saveHideDB() }
    delete mealEdits[mealName]; saveEditDB();
    DAYS.forEach(day => {
      ["b", "l", "d", "s"].forEach(slot => {
        const all = getSlotMeals(day, slot);
        const cur = getMealChoice(day, slot);
        if (cur >= all.length) { mealSel[day + "_" + slot] = 0; saveMealDB() }
      })
    });
  }
  S.libExpand = null; R();
}

// Restore a hidden meal
function restoreHidden(name) {
  hiddenMeals = hiddenMeals.filter(n => n !== name);
  saveHideDB(); R();
}

// Restore all hidden meals
function restoreAllHidden() {
  if (!confirm("Restore all " + hiddenMeals.length + " hidden meals?")) return;
  hiddenMeals = []; saveHideDB(); R();
}

// Search across all meals
function searchMeals(q) {
  if (!q || q.length < 2) return [];
  const lq = q.toLowerCase();
  const results = [];
  const seen = new Set();
  DAYS.forEach(day => {
    ["b", "l", "d", "s"].forEach(slot => {
      const all = getSlotMeals(day, slot);
      all.forEach((m, i) => {
        const key = m.t.toLowerCase();
        if (seen.has(key)) return;
        const match = m.t.toLowerCase().includes(lq) || m.d.toLowerCase().includes(lq) || (m.tags || []).some(t => t.includes(lq));
        if (match) { seen.add(key); results.push({ ...m, srcDay: day, srcSlot: slot, srcIdx: i }) }
      });
    });
  });
  return results;
}

// Edit a custom meal in-place
function saveEditMeal(day, slot, custIdx) {
  const ck = day + "_" + slot;
  if (!customMeals[ck] || !customMeals[ck][custIdx]) return;
  const n = document.getElementById("em_name"), d = document.getElementById("em_desc"),
    p = document.getElementById("em_p"), c = document.getElementById("em_c"),
    f = document.getElementById("em_f"), cal = document.getElementById("em_cal");
  if (!n || !n.value.trim()) { alert("Enter a meal name"); return }
  customMeals[ck][custIdx].t = n.value.trim();
  customMeals[ck][custIdx].d = d.value.trim() || "Custom meal";
  customMeals[ck][custIdx].p = parseInt(p.value) || 0;
  customMeals[ck][custIdx].c = parseInt(c.value) || 0;
  customMeals[ck][custIdx].f = parseInt(f.value) || 0;
  customMeals[ck][custIdx].cal = parseInt(cal.value) || 0;
  saveCustomDB(); S.editKey = null; R();
}

// Add a search result to a specific day+slot
function addSearchResult(srcDay, srcSlot, srcIdx, tgtDay, tgtSlot) {
  const srcMeals = getSlotMeals(srcDay, srcSlot);
  const meal = srcMeals[srcIdx];
  if (!meal) return;
  const ck = tgtDay + "_" + tgtSlot;
  const existing = getSlotMeals(tgtDay, tgtSlot);
  const dup = existing.findIndex(m => m.t === meal.t);
  if (dup >= 0) { setMealChoice(tgtDay, tgtSlot, dup); S.addSlot = null; return }
  if (!customMeals[ck]) customMeals[ck] = [];
  customMeals[ck].push({ t: meal.t, d: meal.d, p: meal.p, c: meal.c, f: meal.f, cal: meal.cal, tags: [...(meal.tags || []).filter(t => t !== "custom" && t !== "picked"), "picked"] });
  saveCustomDB();
  const newAll = getSlotMeals(tgtDay, tgtSlot);
  setMealChoice(tgtDay, tgtSlot, newAll.length - 1);
  S.addSlot = null;
}

// Get all unique custom meals across every day+slot (deduplicated by name)
function getAllCustomMeals() {
  const seen = new Set();
  const list = [];
  Object.keys(customMeals).forEach(ck => {
    customMeals[ck].forEach(m => {
      if (seen.has(m.t)) return;
      seen.add(m.t);
      list.push(applyEdits({ ...m, custom: true }));
    });
  });
  return list;
}

// Add a custom meal (by index in _myMealsCache) to a target day+slot
function addFromMyMeals(idx, tgtDay, tgtSlot) {
  if (!window._myMealsCache || !window._myMealsCache[idx]) return;
  const meal = window._myMealsCache[idx];
  const ck = tgtDay + "_" + tgtSlot;
  const existing = getSlotMeals(tgtDay, tgtSlot);
  const dup = existing.findIndex(m => m.t === meal.t);
  if (dup >= 0) { setMealChoice(tgtDay, tgtSlot, dup); return; }
  if (!customMeals[ck]) customMeals[ck] = [];
  customMeals[ck].push({ t: meal.t, d: meal.d, p: meal.p, c: meal.c, f: meal.f, cal: meal.cal, tags: [...(meal.tags || []).filter(t => t !== "picked"), "custom"] });
  saveCustomDB();
  const newAll = getSlotMeals(tgtDay, tgtSlot);
  setMealChoice(tgtDay, tgtSlot, newAll.length - 1);
}

function getDayMacros(dk) {
  let tp = 0, tc = 0, tf = 0, tcal = 0;
  ["b", "l", "d", "s"].forEach(slot => {
    const opts = getSlotMeals(dk, slot);
    const idx = getMealChoice(dk, slot);
    const m = opts[idx] || opts[0];
    tp += m.p; tc += m.c; tf += m.f; tcal += m.cal;
  });
  return { p: tp, c: tc, f: tf, cal: tcal };
}
