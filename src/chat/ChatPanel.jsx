import { useEffect, useRef } from "react";
import { Bot, X } from "lucide-react";
import { useChat } from "./useChat";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

/**
 * @param {{ isOpen: boolean, onClose: () => void }} props
 */
export function ChatPanel({ isOpen, onClose }) {
  const { messages, status, slowIndicator, send, retry, abort } = useChat();
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to let animation settle before focusing
      const t = setTimeout(() => {
        inputRef.current?.focus();
      }, 80);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Esc closes the panel
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Abort in-flight request when panel unmounts
  useEffect(() => {
    return () => abort();
  }, [abort]);

  const isThinking = status === "thinking";

  return (
    <>
      {/* Backdrop (mobile only, invisible — keeps page scrollable above) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9998] sm:hidden"
          aria-hidden="true"
          onClick={onClose}
          style={{ background: "transparent" }}
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Talk to Abdul"
        className={[
          // Base
          "fixed z-[9999] flex flex-col overflow-hidden",
          // Mobile: bottom sheet
          "left-0 right-0 bottom-0 rounded-t-2xl",
          // Desktop: floating card bottom-right
          "sm:left-auto sm:right-4 sm:bottom-[5.5rem] sm:rounded-2xl sm:w-[380px]",
          // Height
          "h-[75dvh] sm:h-auto sm:max-h-[560px] sm:min-h-[300px]",
          // Visual
          "glass-strong border border-[var(--color-border)] shadow-2xl",
          // Animation
          "chat-panel-animate",
          isOpen ? "chat-panel-open" : "chat-panel-closed",
        ].join(" ")}
        style={{
          // Ensure right aligns with safe-area on desktop
          "--panel-right": "calc(16px + env(safe-area-inset-right))",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-4 py-3 border-b border-[var(--color-border)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground leading-tight">
                Talk to Abdul
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                Answers come from Abdul's own documents
              </p>
            </div>
          </div>
          <button
            aria-label="Close chat"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--color-muted)] text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message list */}
        <MessageList
          messages={messages}
          status={status}
          slowIndicator={slowIndicator}
          onStarter={send}
          onRetry={retry}
        />

        {/* Input */}
        <ChatInput
          ref={inputRef}
          onSend={send}
          disabled={isThinking}
          status={status}
        />
      </div>
    </>
  );
}
