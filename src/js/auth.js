// Authentication functions using GitHub PAT

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
  // Match username.github.io/repo-name pattern
  const ghMatch = host.match(/^(.+)\.github\.io$/);
  if (ghMatch) {
    const owner = ghMatch[1];
    const repo = path.split('/').filter(Boolean)[0] || '';
    if (repo) return { owner, repo };
  }
  return null;
}

function isLoggedIn() {
  return !!(localStorage.getItem('wt_gh_token') &&
            localStorage.getItem('wt_gh_owner') &&
            localStorage.getItem('wt_gh_repo'));
}

function logout() {
  const s = new GitHubStorage();
  s.clearConfig();
  window.location.href = 'login.html';
}
