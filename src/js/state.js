// Global state and data management
const storage = new GitHubStorage();

// Mutable data stores (populated from GitHub on load)
let db = {};
let mealSel = {};
let customMeals = {};
let mealEdits = {};
let hiddenMeals = [];

// UI state
let S = {
  tab: "today", day: ti(), sched: null, meal: null, swapSlot: null,
  swapTab: "today", browseDay: null, exO: null, wOff: 0, searchQ: "",
  mealMgr: false, editKey: null, addSlot: null, mealView: "daily",
  libSlot: "b", libTag: null, libSort: "default", libExpand: null,
  libAddTarget: null, libEdit: null, showHidden: false
};

// Load all data from GitHub (falls back to localStorage cache)
async function loadAllData() {
  const data = await storage.load();
  if (data && typeof data === 'object') {
    db = data.tracker || {};
    mealSel = data.meals || {};
    customMeals = data.customMeals || {};
    mealEdits = data.mealEdits || {};
    hiddenMeals = data.hiddenMeals || [];
  }
  // Re-init day index after load
  S.day = ti();

  // If GitHub load failed but we have local cache, retry sync in background
  if (storage.syncStatus === 'error' && Object.keys(db).length > 0) {
    setTimeout(() => {
      console.log('Retrying GitHub sync...');
      storage.save(getAllData());
    }, 5000);
  }
}

// Get combined data object for saving
function getAllData() {
  return {
    tracker: db,
    meals: mealSel,
    customMeals: customMeals,
    mealEdits: mealEdits,
    hiddenMeals: hiddenMeals
  };
}

// Save functions - each triggers a debounced GitHub commit
function saveDB() {
  storage.save(getAllData());
}

function saveMealDB() {
  storage.save(getAllData());
}

function saveCustomDB() {
  storage.save(getAllData());
}

function saveEditDB() {
  storage.save(getAllData());
}

function saveHideDB() {
  storage.save(getAllData());
}
