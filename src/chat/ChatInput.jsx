import { useState, useRef, forwardRef } from "react";
import { SendHorizonal, Loader2 } from "lucide-react";

const MAX_LEN = 500;
const HINT_THRESHOLD = 400;

/**
 * Chat input — textarea with Enter-to-send (Shift+Enter = newline),
 * character count, send button with spinner when thinking.
 */
export const ChatInput = forwardRef(function ChatInput(
  { onSend, disabled },
  ref
) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  // Merge forwarded ref
  const setRef = (el) => {
    textareaRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value.slice(0, MAX_LEN));
    // Auto-grow
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const remaining = MAX_LEN - value.length;
  const showHint = value.length >= HINT_THRESHOLD;

  return (
    <div
      className="px-3 pb-3 pt-2 border-t border-[var(--color-border)] flex-shrink-0"
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-end gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-2 focus-within:border-primary/60 transition-colors">
        <textarea
          ref={setRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          maxLength={MAX_LEN}
          placeholder="Ask me anything…"
          rows={1}
          aria-label="Chat message input"
          style={{
            fontSize: "16px", // ≥16px prevents iOS zoom
            resize: "none",
            minHeight: "24px",
            maxHeight: "120px",
            overflowY: "auto",
          }}
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none border-none disabled:opacity-50 disabled:cursor-not-allowed py-0.5 leading-relaxed"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 min-w-[44px] min-h-[44px]"
        >
          {disabled ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <SendHorizonal className="w-4 h-4" />
          )}
        </button>
      </div>
      {showHint && (
        <p
          className={`text-[10px] text-right mt-1 px-1 ${
            remaining <= 20 ? "text-red-400" : "text-muted-foreground"
          }`}
        >
          {remaining} characters remaining
        </p>
      )}
    </div>
  );
});
