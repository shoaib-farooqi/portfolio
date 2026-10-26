import { useState, useCallback } from "react";
import { MessageCircle, X } from "lucide-react";
import { ChatPanel } from "./ChatPanel";

/**
 * ChatWidget — launcher button + floating/sheet panel.
 * Mount once at the app root. All state lives here.
 */
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return (
    <>
      {/* Chat Panel */}
      <ChatPanel isOpen={isOpen} onClose={close} />

      {/* Launcher Button */}
      <button
        onClick={toggle}
        aria-label="Talk to Abdul"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="chat-launcher fixed z-[9999] flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-primary/50 hover:shadow-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        style={{
          bottom: "calc(16px + env(safe-area-inset-bottom))",
          right: "calc(16px + env(safe-area-inset-right))",
          minHeight: "44px",
        }}
      >
        <span className="relative flex items-center justify-center w-5 h-5">
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <MessageCircle className="w-5 h-5" />
          )}
        </span>
        <span className="text-sm font-medium whitespace-nowrap leading-none">
          Talk to Abdul
        </span>
      </button>
    </>
  );
}
