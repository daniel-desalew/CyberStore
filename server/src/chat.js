import { WebSocketServer, WebSocket } from "ws";

/**
 * Real-time chat WebSocket server.
 *
 * URL: ws://host/ws/chat
 * Query params:
 *   ?role=support  →  marks the connection as a support agent
 *   (default)      →  regular customer
 *
 * Message protocol (JSON):
 *   client → server  { type: "join",    name: string }
 *   client → server  { type: "message", text: string }
 *   client → server  { type: "typing" }
 *
 *   server → client  { type: "welcome",  text: string }
 *   server → client  { type: "message",  from: "user"|"support", name, text, time, id }
 *   server → client  { type: "typing",   from: "support" }
 *   server → client  { type: "agent_status", online: boolean }
 */

const BOT_NAME = "CyberStore Assistant";

const AUTO_REPLIES = [
  "Hi there! 👋 Thanks for reaching out to CyberStore. How can I help you today?",
  "I'd be happy to assist! Could you tell me more about your question?",
  "Great question! Our support team will get back to you shortly. In the meantime, you can browse our FAQ.",
  "We typically respond within a few minutes during business hours (Mon–Fri, 9am–6pm).",
  "Is there anything else I can help you with?",
  "Thank you for your patience! A live agent will be with you soon.",
];
let autoIndex = 0;

const now = () =>
  new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function setupChat(httpServer) {
  const wss = new WebSocketServer({
    server: httpServer,
    path: "/ws/chat",
  });

  // Map: ws → { name, role }
  const clients = new Map();

  const send = (ws, payload) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  };

  const broadcast = (payload, filterFn = () => true) => {
    wss.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN && filterFn(ws)) {
        ws.send(JSON.stringify(payload));
      }
    });
  };

  const supportOnline = () =>
    [...clients.values()].some((c) => c.role === "support");

  const notifyAllUsers = (online) => {
    broadcast({ type: "agent_status", online }, (ws) => clients.get(ws)?.role === "user");
  };

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url, "http://localhost");
    const role = url.searchParams.get("role") === "support" ? "support" : "user";
    const meta = { name: role === "support" ? "Support Agent" : "Guest", role };
    clients.set(ws, meta);

    // Welcome message
    send(ws, {
      type: "welcome",
      text: role === "support"
        ? "Connected as support agent. Waiting for customers…"
        : supportOnline()
          ? "A support agent is online and ready to help!"
          : "Hi! Our team is currently away. Leave a message and we'll get back to you.",
      agentOnline: role === "user" ? supportOnline() : undefined,
    });

    // Tell all users if a support agent just came online
    if (role === "support") {
      notifyAllUsers(true);
    }

    ws.on("message", (raw) => {
      let msg;
      try { msg = JSON.parse(raw.toString()); } catch { return; }
      const info = clients.get(ws);

      // ── join ────────────────────────────────────────────────
      if (msg.type === "join" && msg.name?.trim()) {
        info.name = msg.name.trim().slice(0, 40);
        clients.set(ws, info);
        send(ws, {
          type: "message",
          from: "support",
          name: BOT_NAME,
          text: `Welcome, ${info.name}! 😊 How can we help you today?`,
          time: now(),
          id: uid(),
        });
        return;
      }

      // ── typing indicator ────────────────────────────────────
      if (msg.type === "typing") {
        if (info.role === "user") {
          broadcast({ type: "typing", from: "user", name: info.name },
            (c) => clients.get(c)?.role === "support");
        } else {
          broadcast({ type: "typing", from: "support" },
            (c) => clients.get(c)?.role === "user");
        }
        return;
      }

      // ── message ─────────────────────────────────────────────
      if (msg.type === "message" && msg.text?.trim()) {
        const payload = {
          type: "message",
          from: info.role,
          name: info.name,
          text: msg.text.trim().slice(0, 1000),
          time: now(),
          id: uid(),
        };

        if (info.role === "user") {
          // Echo to sender
          send(ws, payload);
          // Forward to support agents
          broadcast(payload, (c) => clients.get(c)?.role === "support");

          // Auto-reply if no support agent online
          if (!supportOnline()) {
            setTimeout(() => {
              send(ws, {
                type: "message",
                from: "support",
                name: BOT_NAME,
                text: AUTO_REPLIES[autoIndex % AUTO_REPLIES.length],
                time: now(),
                id: uid(),
              });
              autoIndex++;
            }, 900);
          }
        } else {
          // Support → all users + echo
          broadcast(payload, (c) => clients.get(c)?.role === "user");
          send(ws, payload);
        }
      }
    });

    ws.on("close", () => {
      const info = clients.get(ws);
      clients.delete(ws);
      // If a support agent disconnected, notify users
      if (info?.role === "support") {
        notifyAllUsers(supportOnline());
      }
    });

    ws.on("error", () => ws.close());
  });

  console.log("💬  Chat WebSocket ready at /ws/chat");
  return wss;
}
