import { useEffect, useRef } from "react";
import { Loader2, RefreshCw } from "lucide-react";

const STARTER_QUESTIONS = [
  "What has Abdul built?",
  "Is Abdul available for work?",
  "Have you worked at Google?",
];

/**
 * Format a source chip label from a file source string.
 * Strips ".md", replaces dashes/underscores with spaces, capitalizes each word.
 * @param {string} source
 */
function formatSource(source) {
  return source
    .replace(/\.md$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Animated typing indicator — three bouncing dots */
function TypingIndicator({ slow }) {
  return (
    <div className="flex items-start gap-2 mb-4">
      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="w-3 h-3 text-primary">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
            <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
          </svg>
        </span>
      </div>
      <div className="flex flex-col gap-1 max-w-[75%]">
        <div className="px-3 py-2 rounded-2xl rounded-tl-sm bg-[var(--color-secondary)] border border-[var(--color-border)]">
          <div className="flex gap-1 items-center h-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary typing-dot" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary typing-dot" style={{ animationDelay: "160ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary typing-dot" style={{ animationDelay: "320ms" }} />
          </div>
        </div>
        {slow && (
          <p className="text-xs text-muted-foreground px-1">
            Still working, the first answer can be slow…
          </p>
        )}
      </div>
    </div>
  );
}

/** Source chips row */
function SourceChips({ sources }) {
  // Deduplicate by source field
  const unique = [...new Map(sources.map((s) => [s.source, s])).values()];
  if (!unique.length) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-1.5">
      {unique.map((s) => (
        <span
          key={s.source}
          className="inline-block px-2 py-0.5 text-[10px] rounded-full bg-primary/10 text-primary border border-primary/20 font-medium"
        >
          {formatSource(s.source)}
        </span>
      ))}
    </div>
  );
}

/**
 * @param {{
 *   messages: import('./useChat').Message[],
 *   status: string,
 *   slowIndicator: boolean,
 *   onStarter: (text: string) => void,
 *   onRetry: () => void,
 * }} props
 */
export function MessageList({ messages, status, slowIndicator, onStarter, onRetry }) {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const isEmpty = messages.length === 0;

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
      className="flex-1 overflow-y-auto px-3 py-3 space-y-1 min-h-0"
    >
      {/* Empty state */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-5">
          <div>
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground">Hi there! 👋</p>
            <p className="text-xs text-muted-foreground mt-1">
              Ask me anything about Abdul — his work, experience, or availability.
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full">
            {STARTER_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => onStarter(q)}
                className="w-full text-left text-xs px-3 py-2.5 rounded-xl border border-[var(--color-border)] hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.map((msg) => {
        if (msg.role === "user") {
          return (
            <div key={msg.id} className="flex justify-end mb-4">
              <div
                className="max-w-[80%] px-3 py-2 rounded-2xl rounded-tr-sm bg-primary text-primary-foreground text-sm"
                style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                {msg.text}
              </div>
            </div>
          );
        }

        if (msg.role === "error") {
          return (
            <div key={msg.id} className="flex items-start gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-400 text-xs font-bold">!</span>
              </div>
              <div className="max-w-[80%] flex flex-col gap-1.5">
                <div className="px-3 py-2 rounded-2xl rounded-tl-sm bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                  <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {msg.text}
                  </span>
                </div>
                <button
                  onClick={onRetry}
                  className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded min-h-[44px]"
                >
                  <RefreshCw className="w-3 h-3" />
                  Try again
                </button>
              </div>
            </div>
          );
        }

        // assistant
        return (
          <div key={msg.id} className="flex items-start gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
              </svg>
            </div>
            <div className="max-w-[80%]">
              <div
                className="px-3 py-2 rounded-2xl rounded-tl-sm bg-[var(--color-secondary)] border border-[var(--color-border)] text-sm text-foreground"
                style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                {msg.text}
              </div>
              {msg.grounded && msg.sources?.length > 0 && (
                <SourceChips sources={msg.sources} />
              )}
            </div>
          </div>
        );
      })}

      {/* Typing indicator */}
      {status === "thinking" && (
        <TypingIndicator slow={slowIndicator} />
      )}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
