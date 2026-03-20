// Authentication functions - password-based login with encrypted PAT storage

const AUTH_FILE = 'auth/credentials.json';

async function validateToken(token) {
  try {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/vnd.github+json'
      }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

async function validateRepoAccess(token, owner, repo) {
  try {
    const res = await fetch('https://api.github.com/repos/' + owner + '/' + repo, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/vnd.github+json'
      }
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.permissions && data.permissions.push;
  } catch (e) {
    return false;
  }
}

function detectRepoFromURL() {
  const host = window.location.hostname;
  const path = window.location.pathname;
  const ghMatch = host.match(/^(.+)\.github\.io$/);
  if (ghMatch) {
    const owner = ghMatch[1];
    const repo = path.split('/').filter(Boolean)[0] || '';
    if (repo) return { owner, repo };
  }
  return null;
}

// Check if credentials file exists in the public app repo (no auth needed)
async function fetchCredentials(owner, repo) {
  try {
    const res = await fetch(
      'https://api.github.com/repos/' + owner + '/' + repo + '/contents/' + AUTH_FILE,
      { headers: { 'Accept': 'application/vnd.github+json' } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const content = atob(json.content.replace(/\n/g, ''));
    return { credentials: JSON.parse(content), sha: json.sha };
  } catch (e) {
    return null;
  }
}

// Store encrypted credentials in the public app repo
async function storeCredentials(token, owner, repo, credentialData, existingSha) {
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(credentialData, null, 2))));
  const body = {
    message: 'Update auth credentials',
    content: content
  };
  if (existingSha) body.sha = existingSha;
  const res = await fetch(
    'https://api.github.com/repos/' + owner + '/' + repo + '/contents/' + AUTH_FILE,
    {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  );
  return res.ok;
}

// Check if user has a saved session (already logged in on this browser)
function isLoggedIn() {
  return !!(localStorage.getItem('wt_gh_token') &&
            (localStorage.getItem('wt_gh_data_owner') || localStorage.getItem('wt_gh_owner')) &&
            (localStorage.getItem('wt_gh_data_repo') || localStorage.getItem('wt_gh_repo')));
}

// Check if credentials have been set up (file exists in repo)
async function isSetupDone(owner, repo) {
  const result = await fetchCredentials(owner, repo);
  return result !== null;
}

function logout() {
  const s = new GitHubStorage();
  s.clearConfig();
  window.location.href = 'login.html';
}
