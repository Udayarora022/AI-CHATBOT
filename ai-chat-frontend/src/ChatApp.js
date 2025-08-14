import React, { useState, useEffect, useRef } from "react";

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await res.json();
      setMessages([...newMessages, { sender: "bot", text: data.result }]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { sender: "bot", text: "Error: " + error.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Auto scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>🤖 AI Q&A Chat</h2>
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                ...styles.message,
                background:
                  msg.sender === "user"
                    ? "linear-gradient(135deg, #4CAF50, #45A049)"
                    : "rgba(255,255,255,0.2)",
                color: msg.sender === "user" ? "#fff" : "#000",
                borderBottomRightRadius:
                  msg.sender === "user" ? 0 : styles.message.borderRadius,
                borderBottomLeftRadius:
                  msg.sender === "bot" ? 0 : styles.message.borderRadius,
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={styles.typingDot}></span>
            <span style={styles.typingDot}></span>
            <span style={styles.typingDot}></span>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={styles.input}
          placeholder="Type your question..."
        />
        <button onClick={sendMessage} style={styles.button}>
          ➤
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "auto",
    padding: 20,
    fontFamily: "Segoe UI, sans-serif",
    background: "linear-gradient(135deg, #ECE9E6, #FFFFFF)",
    height: "100vh",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  chatBox: {
    flex: 1,
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(10px)",
    borderRadius: 12,
    padding: "15px",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
    overflowY: "auto",
    marginBottom: 10,
  },
  message: {
    padding: "10px 14px",
    borderRadius: 18,
    maxWidth: "75%",
    boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
    animation: "fadeIn 0.3s ease",
  },
  inputArea: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    fontSize: "14px",
    borderRadius: 20,
    border: "1px solid #ccc",
    outline: "none",
    boxShadow: "inset 0px 2px 4px rgba(0,0,0,0.05)",
  },
  button: {
    padding: "10px 16px",
    background: "linear-gradient(135deg,#4CAF50,#45A049)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "0.2s ease",
    fontSize: "16px",
  },
  typingDot: {
    width: 8,
    height: 8,
    background: "#999",
    borderRadius: "50%",
    animation: "bounce 0.6s infinite alternate",
  },
};
