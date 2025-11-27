// Keep empty string as a valid candidate so relative paths ("/api/...") are
// tried first. filter(Boolean) would remove empty string, so only filter
// out null/undefined here.
const DEFAULT_CANDIDATES = [
  '',
  import.meta.env.VITE_BACKEND_URL || '',
  'http://localhost:3001',
  'http://127.0.0.1:3001'
].filter((c) => c !== null && c !== undefined);

function unique(arr) {
  return Array.from(new Set(arr));
}

function buildUrl(base, path) {
  if (!base) return path; // relative
  const b = base.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return b + p;
}

async function tryFetch(url, opts) {
  return fetch(url, opts);
}

async function request(method, path, body = null, opts = {}) {
  const candidates = unique([...(opts.candidates || DEFAULT_CANDIDATES)]);
  // Debug: show which bases we'll try (helps diagnose ERR_CONNECTION_REFUSED)
  try {
    // eslint-disable-next-line no-console
    console.debug('apiClient: candidates', candidates);
  } catch (e) {}

  let lastNetworkError = null;

  for (let i = 0; i < candidates.length; i++) {
    const base = candidates[i];
    const url = buildUrl(base, path);

    const fetchOpts = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(opts.headers || {})
      },
      ...opts.fetchOptions
    };

    if (body != null) {
      fetchOpts.body = JSON.stringify(body);
    }

    try {
      const res = await tryFetch(url, fetchOpts);

      // Network-level success; now interpret HTTP status
      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (e) {
        data = text;
      }

      if (!res.ok) {
        const err = new Error(data?.message || res.statusText || `HTTP ${res.status}`);
        err.response = data || { status: res.status };
        err.status = res.status;
        err.triedBase = base;
        throw err;
      }

      // ok
      if (data === null) return {};
      return data;
    } catch (err) {
      // Distinguish network errors (fetch failed) vs HTTP errors (we threw above)
      const isNetwork = err instanceof TypeError || err.name === 'TypeError' || /Failed to fetch/i.test(err.message || '');
      if (isNetwork) {
        lastNetworkError = err;
        // try next candidate
        continue;
      }
      // HTTP error or other -> rethrow
      throw err;
    }
  }

  const netErr = new Error('Network error: no backend candidates reachable');
  netErr.isNetworkError = true;
  netErr.cause = lastNetworkError;
  throw netErr;
}

export default {
  get: (path, opts) => request('GET', path, null, opts),
  post: (path, body, opts) => request('POST', path, body, opts),
  put: (path, body, opts) => request('PUT', path, body, opts),
  delete: (path, body, opts) => request('DELETE', path, body, opts),
  // expose low-level request for tests or advanced usage
  request
};
