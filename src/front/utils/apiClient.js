const normalize = (u) => (u ? u.replace(/\/$/, "") : u);

const getBackendUrlCandidates = () => {
  const out = [];
  const envUrl = import.meta.env.VITE_BACKEND_URL || "";
  if (envUrl && envUrl.trim() !== "") out.push(normalize(envUrl));

  if (import.meta.env.DEV) {
    // Try hostname-based backend first (works when frontend accessed as localhost or remote host)
    try {
      const loc = window && window.location;
      if (loc && loc.hostname) {
        out.push(`${loc.protocol}//${loc.hostname}:3001`);
      }
    } catch (e) {
      // ignore
    }
    // Common developer fallbacks
    out.push("http://localhost:3001");
    out.push("http://127.0.0.1:3001");
  }

  // Final fallback: empty (will build relative URL)
  out.push("");
  // Deduplicate while preserving order
  return Array.from(new Set(out.map(normalize)));
};

async function request(
  path,
  { method = "GET", headers = {}, body = null } = {}
) {
  const candidates = getBackendUrlCandidates();
  let lastErr = null;

  // Try candidates in order until one succeeds or all fail.
  for (const base of candidates) {
    const url = `${base}${path.startsWith("/") ? "" : "/"}${path}`.replace(
      "//api",
      "/api"
    );

    // Build headers and body for attempt
    const token = (() => {
      try {
        return localStorage.getItem("token");
      } catch (e) {
        return null;
      }
    })();

    const defaultHeaders = {
      "Content-Type": "application/json",
    };
    if (token) defaultHeaders["Authorization"] = `Bearer ${token}`;

    // Try fetch and return on success
    try {
      console.debug(`apiClient: attempting ${url}`);
      let res = await fetch(url, {
        method,
        headers: { ...defaultHeaders, ...headers },
        body: body
          ? typeof body === "string"
            ? body
            : JSON.stringify(body)
          : null,
      });

      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (e) {
        data = text;
      }

      if (!res.ok) {
        // HTTP error received from server — do NOT try other candidates.
        const err = new Error(data?.message || res.statusText || "API Error");
        err.status = res.status;
        err.response = data;
        // annotate which base produced the HTTP error for debugging
        err.triedBase = base;
        throw err;
      }

      // success — annotate and log the successful base for diagnostics
      try {
        console.info(
          `apiClient: request succeeded using base='${
            base || "(relative)"
          }' url='${url}'`
        );
      } catch (e) {
        // ignore logging failures
      }
      return data;
    } catch (fetchErr) {
      // Distinguish between network errors (where fetch throws) and our
      // HTTP errors (which we created above and rethrown). If this is an
      // HTTP error (has status or response) rethrow immediately; otherwise
      // it's a network/error-level issue and we can try the next candidate.
      if (fetchErr && (fetchErr.status || fetchErr.response)) {
        // Server returned a valid HTTP error, do not retry other hosts.
        throw fetchErr;
      }

      // network error; record and try next candidate
      lastErr = fetchErr;
      console.warn(
        `apiClient: attempt failed for ${base} -> ${fetchErr.message}`
      );
      continue;
    }
  }

  // All candidates failed
  if (lastErr) {
    const e = new Error(`Network error: ${lastErr.message}`);
    e.cause = lastErr;
    e.isNetworkError = true;
    throw e;
  }
  // If we reach here it means all network attempts failed
  // (lastErr is already set above). Throw a network error.
  const e = new Error(`Network error: ${lastErr?.message || "Unknown host"}`);
  e.cause = lastErr;
  e.isNetworkError = true;
  throw e;
}

export default {
  request,
  get: (path, opts) => request(path, { method: "GET", ...opts }),
  post: (path, body, opts) => request(path, { method: "POST", body, ...opts }),
  put: (path, body, opts) => request(path, { method: "PUT", body, ...opts }),
  del: (path, opts) => request(path, { method: "DELETE", ...opts }),
};
