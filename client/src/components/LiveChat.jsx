import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageCircle, X, Send, ChevronDown,
  WifiOff, Smile, Paperclip,
} from "lucide-react";

/* ─── WebSocket URL ────────────────────────────────────────────────────────
   In dev, Vite proxies /ws → ws://localhost:5001 so we always
   connect to the same origin — no CORS issues.
   In production, set VITE_WS_URL explicitly.
──────────────────────────────────────────────────────────────────────────── */
const WS_URL = (() => {
  if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL;
  const proto = window.location.protocol === "https:" ? "wss" : "ws";
  return `${proto}://${window.location.host}/ws/chat`;
})();

const STATUS = { IDLE: "idle", CONNECTING: "connecting", OPEN: "open", CLOSED: "closed" };
const MAX_RECONNECT_DELAY = 16000; // cap exponential back-off

const BOT_AVATAR = (
  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-xs font-bold select-none">
    CS
  </span>
);

// ── Quick reply suggestions shown before user sends first message ──────────
const QUICK_REPLIES = [
  "Track my order",
  "Return / refund policy",
  "Product availability",
  "Payment methods",
];

export default function LiveChat() {
  /* ── UI state ───────────────────────────────────────────────────────── */
  const [open, setOpen]                   = useState(false);
  const [minimized, setMinimized]         = useState(false);
  const [nameScreen, setNameScreen]       = useState(true); // show name gate first
  const [name, setName]                   = useState("");
  const [input, setInput]                 = useState("");
  const [messages, setMessages]           = useState([]);
  const [unread, setUnread]               = useState(0);
  const [agentOnline, setAgentOnline]     = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [connStatus, setConnStatus]       = useState(STATUS.IDLE);

  /* ── WebSocket refs ──────────────────────────────────────────────────── */
  const wsRef           = useRef(null);
  const reconnectDelay  = useRef(1000);
  const reconnectTimer  = useRef(null);
  const typingTimer     = useRef(null);     // debounce our own typing indicator
  const partnerTypingT  = useRef(null);     // clear partner typing after 3 s
  const bottomRef       = useRef(null);
  const inputRef        = useRef(null);
  const hasSentMsg      = useRef(false);    // track if user already chatted

  /* ── helpers ─────────────────────────────────────────────────────────── */
  const addMsg = useCallback((msg) => {
    setMessages((prev) => {
      // de-duplicate by id
      if (msg.id && prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, { ...msg, key: msg.id ?? Date.now() + Math.random() }];
    });
  }, []);

  const scrollBottom = () =>
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 30);

  /* ── WebSocket connection ────────────────────────────────────────────── */
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN ||
        wsRef.current?.readyState === WebSocket.CONNECTING) return;

    setConnStatus(STATUS.CONNECTING);
    let ws;
    try {
      ws = new WebSocket(WS_URL);
    } catch {
      setConnStatus(STATUS.CLOSED);
      return;
    }
    wsRef.current = ws;

    ws.onopen = () => {
      setConnStatus(STATUS.OPEN);
      reconnectDelay.current = 1000;
      clearTimeout(reconnectTimer.current);
    };

    ws.onmessage = ({ data }) => {
      let msg;
      try { msg = JSON.parse(data); } catch { return; }

      if (msg.type === "welcome") {
        if (typeof msg.agentOnline === "boolean") setAgentOnline(msg.agentOnline);
        addMsg({ id: `w-${Date.now()}`, type: "status", text: msg.text });
        scrollBottom();
        return;
      }

      if (msg.type === "agent_status") {
        setAgentOnline(msg.online);
        addMsg({
          id: `as-${Date.now()}`,
          type: "status",
          text: msg.online ? "A support agent has joined the chat." : "Support agent disconnected.",
        });
        scrollBottom();
        return;
      }

      if (msg.type === "typing") {
        setPartnerTyping(true);
        clearTimeout(partnerTypingT.current);
        partnerTypingT.current = setTimeout(() => setPartnerTyping(false), 3000);
        scrollBottom();
        return;
      }

      if (msg.type === "message") {
        setPartnerTyping(false);
        addMsg(msg);
        scrollBottom();
        if (!open || minimized) setUnread((n) => n + 1);
      }
    };

    ws.onclose = () => {
      setConnStatus(STATUS.CLOSED);
      reconnectTimer.current = setTimeout(() => {
        reconnectDelay.current = Math.min(reconnectDelay.current * 2, MAX_RECONNECT_DELAY);
        connect();
      }, reconnectDelay.current);
    };

    ws.onerror = () => ws.close();
  }, [addMsg, open, minimized]);

  /* ── Mount / unmount ─────────────────────────────────────────────────── */
  useEffect(() => {
    connect();
    const openHandler = () => { setOpen(true); setMinimized(false); };
    window.addEventListener("open-live-chat", openHandler);
    return () => {
      window.removeEventListener("open-live-chat", openHandler);
      clearTimeout(reconnectTimer.current);
      clearTimeout(typingTimer.current);
      clearTimeout(partnerTypingT.current);
      wsRef.current?.close();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Clear unread when panel is visible ─────────────────────────────── */
  useEffect(() => {
    if (open && !minimized) setUnread(0);
  }, [open, minimized, messages]);

  /* ── Focus input when chat is ready ─────────────────────────────────── */
  useEffect(() => {
    if (open && !minimized && !nameScreen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open, minimized, nameScreen]);

  /* ── Submit name ─────────────────────────────────────────────────────── */
  const submitName = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setNameScreen(false);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "join", name: trimmed }));
    }
  };

  /* ── Send message ────────────────────────────────────────────────────── */
  const sendMessage = (text = input) => {
    const trimmed = typeof text === "string" ? text.trim() : "";
    if (!trimmed) return;
    setInput("");
    hasSentMsg.current = true;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "message", text: trimmed }));
    } else {
      // Offline — show optimistic message + warning
      addMsg({
        id: `opt-${Date.now()}`,
        type: "message",
        from: "user",
        name: name.trim() || "You",
        text: trimmed,
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        offline: true,
      });
    }
    scrollBottom();
  };

  const handleSubmit = (e) => { e.preventDefault(); sendMessage(); };

  /* ── Typing indicator ───────────────────────────────────────────────── */
  const handleTyping = (e) => {
    setInput(e.target.value);
    if (wsRef.current?.readyState !== WebSocket.OPEN) return;
    clearTimeout(typingTimer.current);
    wsRef.current.send(JSON.stringify({ type: "typing" }));
    typingTimer.current = setTimeout(() => {}, 2000);
  };

  /* ── Derived ─────────────────────────────────────────────────────────── */
  const isOnline   = connStatus === STATUS.OPEN;
  const isVisible  = open && !minimized;

  const dotColor = {
    [STATUS.OPEN]:       "bg-emerald-400",
    [STATUS.CONNECTING]: "bg-amber-400 animate-pulse",
    [STATUS.IDLE]:       "bg-slate-400",
    [STATUS.CLOSED]:     "bg-rose-500 animate-pulse",
  }[connStatus];

  const subLine = {
    [STATUS.OPEN]:       agentOnline ? "Agent online · replies instantly" : "Bot support active",
    [STATUS.CONNECTING]: "Connecting…",
    [STATUS.IDLE]:       "Initializing…",
    [STATUS.CLOSED]:     "Reconnecting…",
  }[connStatus];

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <>
      {/* ══════════════════════════════════════════════════════
          CHAT PANEL
      ══════════════════════════════════════════════════════ */}
      <div
        role="dialog"
        aria-label="Live chat support"
        aria-modal="true"
        className={[
          "fixed bottom-24 right-4 z-50",
          "flex flex-col",
          "w-[22rem] max-w-[calc(100vw-2rem)]",
          "rounded-2xl border border-slate-200 bg-white",
          "shadow-2xl shadow-violet-900/20",
          "overflow-hidden",
          "transition-all duration-300 origin-bottom-right",
          open
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-90 opacity-0 pointer-events-none",
        ].join(" ")}
      >
        {/* ── Header ────────────────────────────────────────── */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-violet-600 to-indigo-700 px-4 py-3 shrink-0">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white font-bold text-sm select-none">
              CS
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-indigo-700 ${dotColor}`}
            />
          </div>

          {/* Title */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white leading-tight">CyberStore Support</p>
            <p className="text-[11px] text-white/70 leading-tight mt-0.5 truncate">{subLine}</p>
          </div>

          {/* Minimise */}
          <button
            onClick={() => setMinimized((m) => !m)}
            aria-label={minimized ? "Expand chat" : "Minimise chat"}
            className="p-1 text-white/60 hover:text-white transition rounded-lg hover:bg-white/10"
          >
            <ChevronDown
              size={17}
              className={`transition-transform duration-300 ${minimized ? "rotate-180" : ""}`}
            />
          </button>

          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="p-1 text-white/60 hover:text-white transition rounded-lg hover:bg-white/10"
          >
            <X size={17} />
          </button>
        </div>

        {/* ── Collapsible body ──────────────────────────────── */}
        <div
          className={`flex flex-col overflow-hidden transition-all duration-300 ${
            minimized ? "max-h-0" : "max-h-[480px]"
          }`}
        >
          {/* ── Name gate ─────────────────────────────────── */}
          {nameScreen ? (
            <form
              onSubmit={submitName}
              className="flex flex-col items-center gap-4 px-6 py-8"
            >
              {/* Icon */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100">
                <MessageCircle size={30} className="text-violet-600" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-800">Chat with us</p>
                <p className="mt-1 text-xs text-slate-500">
                  We usually reply within a few minutes.
                </p>
              </div>

              {/* Status pill */}
              <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                agentOnline
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}>
                <span className={`h-2 w-2 rounded-full ${agentOnline ? "bg-emerald-500" : "bg-slate-400"}`} />
                {agentOnline ? "Agent online" : "Bot support active"}
              </div>

              <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name…"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition"
                maxLength={40}
              />

              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40 transition"
              >
                Start chatting
              </button>
            </form>
          ) : (
            <>
              {/* ── Message list ──────────────────────────── */}
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-[220px] max-h-[300px] scroll-smooth">

                {messages.length === 0 && (
                  <p className="text-center text-xs text-slate-400 pt-4">
                    No messages yet. Say hi! 👋
                  </p>
                )}

                {messages.map((msg) => {
                  /* status pill */
                  if (msg.type === "status") {
                    return (
                      <div key={msg.key} className="flex justify-center">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-500 text-center max-w-[90%]">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  const isUser = msg.from === "user";
                  return (
                    <div
                      key={msg.key}
                      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {/* Avatar */}
                      {!isUser && BOT_AVATAR}

                      <div className={`flex flex-col gap-0.5 max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
                        <span className="text-[10px] text-slate-400 px-1">
                          {isUser ? "You" : msg.name} · {msg.time}
                        </span>
                        <div
                          className={[
                            "rounded-2xl px-3.5 py-2 text-sm leading-snug break-words",
                            isUser
                              ? "rounded-br-sm bg-gradient-to-br from-violet-600 to-indigo-600 text-white"
                              : "rounded-bl-sm bg-slate-100 text-slate-800",
                            msg.offline ? "opacity-60" : "",
                          ].join(" ")}
                        >
                          {msg.text}
                          {msg.offline && (
                            <span className="block text-[9px] mt-0.5 opacity-70">
                              ⚠ Not sent — offline
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {partnerTyping && (
                  <div className="flex items-end gap-2">
                    {BOT_AVATAR}
                    <div className="rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3">
                      <span className="flex gap-1 items-center h-4">
                        <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
                        <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:160ms]" />
                        <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:320ms]" />
                      </span>
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* ── Quick replies (before first message) ──── */}
              {!hasSentMsg.current && (
                <div className="flex flex-wrap gap-2 px-3 pb-2">
                  {QUICK_REPLIES.map((qr) => (
                    <button
                      key={qr}
                      type="button"
                      onClick={() => sendMessage(qr)}
                      className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs text-violet-700 hover:bg-violet-100 transition"
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              )}

              {/* ── Input bar ─────────────────────────────── */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 border-t border-slate-100 bg-white px-3 py-2.5 shrink-0"
              >
                {!isOnline && (
                  <WifiOff size={15} className="shrink-0 text-rose-400" aria-hidden="true" />
                )}

                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleTyping}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={isOnline ? "Type a message…" : "Reconnecting…"}
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-100 transition"
                  maxLength={1000}
                  aria-label="Chat message"
                />

                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Send message"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white transition hover:opacity-90 active:scale-95 disabled:opacity-35"
                >
                  <Send size={15} />
                </button>
              </form>

              {/* ── Footer note ──────────────────────────── */}
              <p className="shrink-0 bg-white pb-2 text-center text-[10px] text-slate-400">
                CyberStore Support · Mon–Fri 9am–6pm
              </p>
            </>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          FLOATING ACTION BUTTON
      ══════════════════════════════════════════════════════ */}
      <button
        onClick={() => { setOpen((o) => !o); setMinimized(false); }}
        aria-label={open ? "Close chat" : "Open live chat"}
        className={[
          "fixed bottom-5 right-4 z-50",
          "flex h-14 w-14 items-center justify-center rounded-full",
          "bg-gradient-to-br from-violet-600 to-indigo-600",
          "shadow-lg shadow-violet-600/40",
          "transition-all duration-300",
          "hover:scale-110 active:scale-95",
          open ? "rotate-[360deg]" : "",
        ].join(" ")}
      >
        {open
          ? <X size={22} className="text-white" />
          : <MessageCircle size={22} className="text-white" />
        }

        {/* Unread badge */}
        {!open && unread > 0 && (
          <span
            aria-label={`${unread} unread messages`}
            className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white"
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}

        {/* Pulse ring when connecting */}
        {!open && connStatus === STATUS.CONNECTING && (
          <span className="absolute inset-0 rounded-full bg-violet-500 animate-ping opacity-30 pointer-events-none" />
        )}
      </button>
    </>
  );
}
