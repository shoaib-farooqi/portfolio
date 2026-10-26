import { useState, useRef, useCallback } from "react";
import { sendMessage } from "./api";

/**
 * @typedef {{ id: string, role: 'user'|'assistant'|'error', text: string, sources?: Array<{source:string,heading:string}>, grounded?: boolean }} Message
 */

/**
 * Returns a user-friendly error message for a given error.
 * @param {Error & { status?: number }} err
 * @returns {string}
 */
function friendlyError(err) {
  if (err.name === "AbortError") {
    return "I couldn't reach the server. Please check your connection and try again.";
  }
  if (!navigator.onLine || err.message?.toLowerCase().includes("network")) {
    return "I couldn't reach the server. Please check your connection and try again.";
  }
  if (err.status === 429) {
    return "Too many questions in a short time. Please wait a minute and try again.";
  }
  if (err.status === 503) {
    return "The assistant is busy right now. Please try again in a moment.";
  }
  if (err.status === 400) {
    return "That message couldn't be sent. Please shorten it and try again.";
  }
  return "Something went wrong. Please try again.";
}

let _msgId = 0;
const newId = () => String(++_msgId);

export function useChat() {
  /** @type {[Message[], React.Dispatch<React.SetStateAction<Message[]>>]} */
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | thinking | answered | failed
  const [slowIndicator, setSlowIndicator] = useState(false);

  const abortRef = useRef(null);
  const slowTimerRef = useRef(null);
  // Track the last user message text for retry
  const lastUserMsgRef = useRef("");

  const clearSlowTimer = () => {
    if (slowTimerRef.current) {
      clearTimeout(slowTimerRef.current);
      slowTimerRef.current = null;
    }
  };

  const send = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > 500) return;

    // Abort any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    // 30-second timeout
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    lastUserMsgRef.current = trimmed;

    setMessages((prev) => [
      ...prev,
      { id: newId(), role: "user", text: trimmed },
    ]);
    setStatus("thinking");
    setSlowIndicator(false);

    // Start slow indicator after 6s
    slowTimerRef.current = setTimeout(() => {
      setSlowIndicator(true);
    }, 6_000);

    try {
      const data = await sendMessage(trimmed, controller.signal);
      clearTimeout(timeoutId);
      clearSlowTimer();

      // Only update if this request is still the active one
      if (abortRef.current === controller) {
        setMessages((prev) => [
          ...prev,
          {
            id: newId(),
            role: "assistant",
            text: data.answer,
            sources: data.sources,
            grounded: data.grounded,
          },
        ]);
        setStatus("answered");
        setSlowIndicator(false);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      clearSlowTimer();

      // Ignore superseded requests
      if (err.name === "AbortError" && abortRef.current !== controller) return;

      if (abortRef.current === controller) {
        setMessages((prev) => [
          ...prev,
          {
            id: newId(),
            role: "error",
            text: friendlyError(err),
          },
        ]);
        setStatus("failed");
        setSlowIndicator(false);
      }
    }
  }, []);

  const retry = useCallback(() => {
    if (lastUserMsgRef.current) {
      // Remove the last error bubble before retrying
      setMessages((prev) => {
        const lastIdx = [...prev].reverse().findIndex((m) => m.role === "error");
        if (lastIdx === -1) return prev;
        const idx = prev.length - 1 - lastIdx;
        return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
      });
      send(lastUserMsgRef.current);
    }
  }, [send]);

  const abort = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    clearSlowTimer();
  }, []);

  return { messages, status, slowIndicator, send, retry, abort };
}
