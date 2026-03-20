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
    this.syncStatus = 'unknown'; // 'synced' | 'syncing' | 'error'
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
  }

  getUserInfo() {
    try {
      return JSON.parse(localStorage.getItem('wt_gh_user'));
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
        // File doesn't exist yet
        this.sha = null;
        this.syncStatus = 'synced';
        updateSyncUI();
        return {};
      }
      if (!res.ok) {
        throw new Error('GitHub API error: ' + res.status);
      }
      const json = await res.json();
      this.sha = json.sha;
      const content = atob(json.content.replace(/\n/g, ''));
      const data = JSON.parse(content);
      this.syncStatus = 'synced';
      updateSyncUI();
      return data;
    } catch (e) {
      console.error('Load failed:', e);
      this.syncStatus = 'error';
      updateSyncUI();
      return null;
    }
  }

  async save(data) {
    if (!this.isConfigured()) return;
    // Debounce: clear pending, wait 2s
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this._doSave(data), 2000);
  }

  async saveImmediate(data) {
    if (!this.isConfigured()) return;
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
        // SHA conflict - fetch latest and retry
        console.warn('SHA conflict, fetching latest...');
        const latest = await this.load();
        // Retry with fresh SHA
        if (latest !== null) {
          return this._doSave(data);
        }
      }
      if (!res.ok) {
        const errText = await res.text();
        throw new Error('Save failed: ' + res.status + ' ' + errText);
      }
      const json = await res.json();
      this.sha = json.content.sha;
      this.syncStatus = 'synced';
      updateSyncUI();
    } catch (e) {
      console.error('Save failed:', e);
      this.syncStatus = 'error';
      updateSyncUI();
    }
  }

  async createFileIfNeeded() {
    if (!this.isConfigured()) return;
    try {
      const res = await this._api('GET',
        '/repos/' + this.dataOwner + '/' + this.dataRepo + '/contents/' + this.filePath);
      if (res.status === 404) {
        // Create the file
        const body = {
          message: 'Initialize wellness tracker data',
          content: btoa('{}')
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
