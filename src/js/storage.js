// GitHub Contents API storage layer
class GitHubStorage {
  constructor() {
    this.token = localStorage.getItem('wt_gh_token');
    this.owner = localStorage.getItem('wt_gh_owner');
    this.repo = localStorage.getItem('wt_gh_repo');
    // Data repo: separate private repo for user data
    this.dataOwner = localStorage.getItem('wt_gh_data_owner') || this.owner;
    this.dataRepo = localStorage.getItem('wt_gh_data_repo') || this.repo;
    this.filePath = 'user-data.json';
    this.sha = null;
    this.saveTimer = null;
    this.pendingData = null; // Track unsaved data
    this.syncStatus = 'unknown'; // 'synced' | 'syncing' | 'error'
    this.LOCAL_CACHE_KEY = 'wt_data_cache';

    // Flush pending saves when tab closes
    window.addEventListener('beforeunload', () => {
      if (this.pendingData) {
        // Write to localStorage immediately as safety net
        this._cacheLocally(this.pendingData);
        // Try to send via beacon (fire-and-forget)
        if (this.saveTimer) clearTimeout(this.saveTimer);
        this._doSave(this.pendingData);
      }
    });

    // Also flush on visibility change (mobile: switching apps)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && this.pendingData) {
        this._cacheLocally(this.pendingData);
        if (this.saveTimer) clearTimeout(this.saveTimer);
        this._doSave(this.pendingData);
      }
    });
  }

  isConfigured() {
    return !!(this.token && this.dataOwner && this.dataRepo);
  }

  setConfig(token, owner, repo, dataOwner, dataRepo, userInfo) {
    this.token = token;
    this.owner = owner;
    this.repo = repo;
    this.dataOwner = dataOwner || owner;
    this.dataRepo = dataRepo || repo;
    localStorage.setItem('wt_gh_token', token);
    localStorage.setItem('wt_gh_owner', owner);
    localStorage.setItem('wt_gh_repo', repo);
    localStorage.setItem('wt_gh_data_owner', this.dataOwner);
    localStorage.setItem('wt_gh_data_repo', this.dataRepo);
    if (userInfo) {
      localStorage.setItem('wt_gh_user', JSON.stringify(userInfo));
    }
  }

  clearConfig() {
    this.token = null;
    this.owner = null;
    this.repo = null;
    this.dataOwner = null;
    this.dataRepo = null;
    this.sha = null;
    localStorage.removeItem('wt_gh_token');
    localStorage.removeItem('wt_gh_owner');
    localStorage.removeItem('wt_gh_repo');
    localStorage.removeItem('wt_gh_data_owner');
    localStorage.removeItem('wt_gh_data_repo');
    localStorage.removeItem('wt_gh_user');
    localStorage.removeItem(this.LOCAL_CACHE_KEY);
  }

  getUserInfo() {
    try {
      return JSON.parse(localStorage.getItem('wt_gh_user'));
    } catch (e) {
      return null;
    }
  }

  // Write-through cache to localStorage
  _cacheLocally(data) {
    try {
      localStorage.setItem(this.LOCAL_CACHE_KEY, JSON.stringify({
        data: data,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('localStorage cache write failed:', e);
    }
  }

  // Read from localStorage cache
  _readLocalCache() {
    try {
      const raw = localStorage.getItem(this.LOCAL_CACHE_KEY);
      if (!raw) return null;
      const cached = JSON.parse(raw);
      return cached.data || null;
    } catch (e) {
      return null;
    }
  }

  async _api(method, path, body) {
    const opts = {
      method,
      headers: {
        'Authorization': 'Bearer ' + this.token,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    };
    if (body) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    return fetch('https://api.github.com' + path, opts);
  }

  async load() {
    if (!this.isConfigured()) return null;
    this.syncStatus = 'syncing';
    updateSyncUI();
    try {
      const res = await this._api('GET',
        '/repos/' + this.dataOwner + '/' + this.dataRepo + '/contents/' + this.filePath);
      if (res.status === 404) {
        // File doesn't exist yet — check local cache
        this.sha = null;
        const cached = this._readLocalCache();
        if (cached) {
          this.syncStatus = 'synced';
          updateSyncUI();
          return cached;
        }
        this.syncStatus = 'synced';
        updateSyncUI();
        return {};
      }
      if (!res.ok) {
        throw new Error('GitHub API error: ' + res.status);
      }
      const json = await res.json();
      this.sha = json.sha;
      // Proper Unicode decode: base64 → bytes → UTF-8
      const content = decodeURIComponent(escape(atob(json.content.replace(/\n/g, ''))));
      const data = JSON.parse(content);
      // Update local cache with latest from GitHub
      this._cacheLocally(data);
      this.pendingData = null; // No unsaved changes
      this.syncStatus = 'synced';
      updateSyncUI();
      return data;
    } catch (e) {
      console.error('Load failed:', e);
      // Fall back to localStorage cache
      const cached = this._readLocalCache();
      if (cached) {
        console.warn('Using cached local data');
        this.syncStatus = 'error';
        updateSyncUI();
        return cached;
      }
      this.syncStatus = 'error';
      updateSyncUI();
      return null;
    }
  }

  async save(data) {
    if (!this.isConfigured()) return;
    // Immediately cache locally (never lose data)
    this._cacheLocally(data);
    this.pendingData = data;
    // Debounce GitHub write: clear pending, wait 2s
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this._doSave(data), 2000);
  }

  async saveImmediate(data) {
    if (!this.isConfigured()) return;
    this._cacheLocally(data);
    this.pendingData = data;
    if (this.saveTimer) clearTimeout(this.saveTimer);
    await this._doSave(data);
  }

  async _doSave(data) {
    this.syncStatus = 'syncing';
    updateSyncUI();
    try {
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
      const body = {
        message: 'Update wellness data ' + new Date().toISOString().slice(0, 10),
        content: content
      };
      if (this.sha) {
        body.sha = this.sha;
      }
      const res = await this._api('PUT',
        '/repos/' + this.dataOwner + '/' + this.dataRepo + '/contents/' + this.filePath, body);

      if (res.status === 409) {
        // SHA conflict - fetch latest SHA and retry
        console.warn('SHA conflict, fetching latest...');
        const latestRes = await this._api('GET',
          '/repos/' + this.dataOwner + '/' + this.dataRepo + '/contents/' + this.filePath);
        if (latestRes.ok) {
          const latestJson = await latestRes.json();
          this.sha = latestJson.sha;
          return this._doSave(data);
        }
      }
      if (!res.ok) {
        const errText = await res.text();
        throw new Error('Save failed: ' + res.status + ' ' + errText);
      }
      const json = await res.json();
      this.sha = json.content.sha;
      this.pendingData = null; // Successfully saved
      this.syncStatus = 'synced';
      updateSyncUI();
    } catch (e) {
      console.error('Save failed:', e);
      this.syncStatus = 'error';
      updateSyncUI();
      // Data is safe in localStorage cache — will sync on next save
    }
  }

  async createFileIfNeeded() {
    if (!this.isConfigured()) return;
    try {
      const res = await this._api('GET',
        '/repos/' + this.dataOwner + '/' + this.dataRepo + '/contents/' + this.filePath);
      if (res.status === 404) {
        // Create the file — use local cache if available
        const cached = this._readLocalCache();
        const initData = cached || {};
        const body = {
          message: 'Initialize wellness tracker data',
          content: btoa(unescape(encodeURIComponent(JSON.stringify(initData, null, 2))))
        };
        const createRes = await this._api('PUT',
          '/repos/' + this.dataOwner + '/' + this.dataRepo + '/contents/' + this.filePath, body);
        if (createRes.ok) {
          const json = await createRes.json();
          this.sha = json.content.sha;
        }
      } else if (res.ok) {
        const json = await res.json();
        this.sha = json.sha;
      }
    } catch (e) {
      console.error('createFileIfNeeded failed:', e);
    }
  }
}

// Global sync UI updater (defined in render.js, stub here)
function updateSyncUI() {
  const el = document.getElementById('sync-status');
  if (el && typeof storage !== 'undefined') {
    const s = storage.syncStatus;
    el.innerHTML = '<span class="sync-dot ' + s + '"></span> ' +
      (s === 'synced' ? 'Synced' : s === 'syncing' ? 'Saving...' : s === 'error' ? 'Error' : '');
  }
}
