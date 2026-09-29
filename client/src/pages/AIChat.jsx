import { useState, useRef, useEffect } from "react";

const GOLD = "#d4af37";
const CARD = "#111111";
const BORDER = "#2a2a2a";

const SUGGESTIONS = [
  "Enakku weak topic-a explain pannunga",
  "Oru practice question kudunga",
  "Fraction addition epdi seyyanum?",
];

export default function AIChat() {
  const [msgs, setMsgs] = useState([
    { role: "ai", text: "Hi! Naan unga AI Chatbot. Enna doubt irukku? " },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  const send = async (text) => {
    const message = (text ?? input).trim();
    if (!message || loading) return;
    setMsgs((m) => [...m, { role: "user", text: message }]);
    setInput("");
    setLoading(true);
    try {
      const r = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.token || "",
        },
        body: JSON.stringify({ message }),
      });
      const data = await r.json();
      const reply = r.status === 401 ? "Login session mudinjiduchu, thirumba login pannunga." : data.reply || data.error || "No reply";
      setMsgs((m) => [...m, { role: "ai", text: reply }]);
    } catch {
      setMsgs((m) => [...m, { role: "ai", text: "Server-ku connect aagala. Backend run aagudhaanu paarunga." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 24, color: "#fff" }}>
      <h1 style={{ margin: 0, fontSize: 28 }}>
        AI <span style={{ color: GOLD }}>Chatbot</span>
      </h1>
      <p style={{ color: "#999", marginTop: 4 }}>
        Unga doubts-a kelunga, personalised help vaanginga.
      </p>

      <div style={{
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16,
        display: "flex", flexDirection: "column", height: "62vh", marginTop: 16,
      }}>
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{
              display: "flex", gap: 10, margin: "12px 0",
              flexDirection: m.role === "user" ? "row-reverse" : "row",
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                background: m.role === "user" ? "#333" : GOLD,
                color: m.role === "user" ? "#fff" : "#000",
                display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12,
              }}>{m.role === "user" ? "U" : "AI"}</div>
              <div style={{
                padding: "10px 14px", borderRadius: 14, maxWidth: "70%",
                whiteSpace: "pre-wrap", lineHeight: 1.5,
                background: m.role === "user" ? GOLD : "#1c1c1c",
                color: m.role === "user" ? "#000" : "#fff",
                border: m.role === "user" ? "none" : `1px solid ${BORDER}`,
              }}>{m.text}</div>
            </div>
          ))}
          {loading && <div style={{ color: GOLD }}>Typing...</div>}
          <div ref={endRef} />
        </div>

        <div style={{ display: "flex", gap: 8, padding: "0 20px 12px", flexWrap: "wrap" }}>
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => send(s)} style={{
              background: "transparent", color: GOLD, border: `1px solid ${GOLD}`,
              borderRadius: 20, padding: "6px 12px", cursor: "pointer", fontSize: 13,
            }}>{s}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, padding: 16, borderTop: `1px solid ${BORDER}` }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask anything..."
            style={{
              flex: 1, padding: "12px 14px", borderRadius: 10, outline: "none",
              background: "#0a0a0a", color: "#fff", border: `1px solid ${BORDER}`,
            }}
          />
          <button onClick={() => send()} style={{
            background: GOLD, color: "#000", border: "none", borderRadius: 10,
            padding: "0 22px", fontWeight: 700, cursor: "pointer",
          }}>Send</button>
        </div>
      </div>
    </div>
  );
}