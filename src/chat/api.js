/**
 * API helper for the RAG chat backend.
 * Reads VITE_API_URL, strips trailing slashes, sends { message },
 * and returns a typed response or throws a typed error.
 */

const RAW_API_URL = import.meta.env.VITE_API_URL;

if (import.meta.env.DEV && !RAW_API_URL) {
  console.error(
    "[ChatWidget] VITE_API_URL is not set. " +
      "Add it to your .env file: VITE_API_URL=https://your-api-url"
  );
}

const API_BASE = RAW_API_URL ? RAW_API_URL.replace(/\/+$/, "") : "";

/**
 * @typedef {{ answer: string, sources: Array<{ source: string, heading: string }>, grounded: boolean }} ChatResponse
 */

/**
 * Send a chat message to the backend.
 * @param {string} message
 * @param {AbortSignal} signal
 * @returns {Promise<ChatResponse>}
 */
export async function sendMessage(message, signal) {
  const res = await fetch(`${API_BASE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
    signal,
  });

  if (!res.ok) {
    let errorBody = {};
    try {
      errorBody = await res.json();
    } catch {
      // ignore parse error
    }
    const err = new Error(errorBody.error || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }

  return await res.json();
}
