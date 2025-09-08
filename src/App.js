// App.js
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Lottie from "lottie-react";
import loadingAnimation from "./assets/loading.json";
import about_me_pic from "./assets/about_me_pic.png";
import bot_icon from "./assets/bot_icon.jpg";
import TermsOfUse from "./TermsOfUse";
import PrivacyPolicy from "./PrivacyPolicy";

const API_URL = "AWS_API_URL"; // Replace with your actual API URL

// -------- Styles --------
const staticStyles = {
  container: { textAlign: "center", fontFamily: "Arial", margin: "auto", position: "relative" },
  aboutMe: { position: "absolute", top: "10px", left: "10px", textDecoration: "none", fontSize: "14px", color: "#007bff", fontWeight: "bold", display: "flex", alignItems: "center" },
  aboutMeIcon: { width: "24px", height: "24px", borderRadius: "50%", marginLeft: "8px" },
  chatWindow: { display: "flex", flexDirection: "column", alignItems: "flex-start", border: "1px solid #ccc", padding: "10px", overflowY: "auto", background: "#f9f9f9", borderRadius: "10px", marginBottom: "10px" },
  userBubbleContainer: { display: "flex", justifyContent: "flex-end", width: "100%", marginBottom: "5px" },
  // Top-align bot content to avoid awkward center alignment for lists
  botBubbleContainer: { display: "flex", justifyContent: "flex-start", alignItems: "flex-start", width: "100%", marginBottom: "5px" },
  messageBubble: {
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "75%",
    // IMPORTANT: do NOT force pre-wrap here (it creates big gaps for bot text)
    // whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    overflowWrap: "anywhere"
  },
  userBubble: { backgroundColor: "#009DB4", color: "white", textAlign: "right" },
  botBubble: { backgroundColor: "#e5e5ea", color: "black", textAlign: "left" },
  botAvatar: { width: "60px", height: "60px", borderRadius: "50%", marginRight: "10px" },
  chatbox: { display: "flex", flexDirection: "column", alignItems: "center" },
  input: { fontSize: "16px", padding: "10px", resize: "none", border: "2px solid #ccc", borderRadius: "5px", outline: "none" },
  button: { fontSize: "16px", cursor: "pointer", backgroundColor: "#009DB4", color: "white", border: "none", borderRadius: "5px" },
  loadingAnimation: { width: 50, height: 50 },
  // Footer styles (were referenced but not defined originally)
  footer: { marginTop: "10px" },
  footerLink: { color: "#007bff", textDecoration: "none" }
};

// Responsive hook (compute from staticStyles every time to avoid stale closures)
function useResponsiveStyles() {
  const [styles, setStyles] = useState(staticStyles);

  useEffect(() => {
    function handleResize() {
      const isMobile = window.innerWidth < 768;
      setStyles({
        ...staticStyles,
        container: {
          ...staticStyles.container,
          padding: isMobile ? "10px" : "20px",
          maxWidth: isMobile ? "100%" : "1200px"
        },
        chatWindow: {
          ...staticStyles.chatWindow,
          height: isMobile ? "400px" : "500px"
        },
        input: {
          ...staticStyles.input,
          width: isMobile ? "90%" : "80%",
          height: isMobile ? "40px" : "50px",
          margin: "0 0 10px 0"
        },
        button: {
          ...staticStyles.button,
          padding: isMobile ? "10px 15px" : "10px 20px",
          margin: "0 0 10px 0"
        },
        aboutMeIcon: {
          ...staticStyles.aboutMeIcon,
          width: isMobile ? "20px" : "24px",
          height: isMobile ? "20px" : "24px"
        }
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return styles;
}

// Normalize bot markdown to avoid giant gaps / broken lists
const normalizeMarkdown = (s) =>
  (s ?? "")
    .replace(/\r\n/g, "\n")          // Windows to Unix newlines
    .replace(/\u00A0/g, " ")         // nbsp → normal space
    .replace(/\n{3,}/g, "\n\n")      // collapse 3+ newlines to double
    // Ensure numbered lists start at column 0 (no leading spaces before "1. ")
    .replace(/(^|\n)\s+(\d+)\.\s/g, "$1$2. ");

function ChatApp() {
  const responsiveStyles = useResponsiveStyles();
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    {
        text: `Hi there! Welcome to Ask Me Bot! \n I'm an AI assistant created by Shusei Yokoi to help you learn more about his career and experience! You can ask me anything related to his professional background—like "Does he have leadership experience?" or "What kind of Data Science experience does he have?" Feel free to ask me!`,
        sender: "bot"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage = { text: prompt, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    const thinkingMessage = { text: "Thinking...", sender: "bot", isThinking: true };
    setMessages((prev) => [...prev, thinkingMessage]);

    try {
      const res = await axios.post(
        API_URL,
        { prompt },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessages((prev) => prev.filter((msg) => !msg.isThinking));

      const clean = normalizeMarkdown(res.data?.response);
      const botMessage = { text: clean, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error calling API:", error);
      setMessages((prev) => prev.filter((msg) => !msg.isThinking));
      const errorMessage = { text: "Sorry, something went wrong. Reporting to Shusei.", sender: "bot" };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={responsiveStyles.container}>
      <a
        href="https://shuseiyokoi.notion.site/about-me"
        target="_blank"
        rel="noopener noreferrer"
        style={responsiveStyles.aboutMe}
      >
        About Me
        <img src={about_me_pic} alt="About Me" style={responsiveStyles.aboutMeIcon} />
      </a>

      <h2>Ask Me</h2>

      <div style={responsiveStyles.chatWindow}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={msg.sender === "user" ? responsiveStyles.userBubbleContainer : responsiveStyles.botBubbleContainer}
          >
            {msg.sender === "bot" && <img src={bot_icon} alt="Bot" style={responsiveStyles.botAvatar} />}

            <div
              style={{
                ...responsiveStyles.messageBubble,
                ...(msg.sender === "user" ? responsiveStyles.userBubble : responsiveStyles.botBubble),
                // Only preserve newlines for user-typed text
                whiteSpace: msg.sender === "user" ? "pre-wrap" : "normal"
              }}
            >
              {msg.isThinking ? (
                <Lottie animationData={loadingAnimation} style={responsiveStyles.loadingAnimation} />
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ node, ...props }) => <p style={{ margin: 0 }} {...props} />,
                    ol: ({ node, ...props }) => (
                      <ol style={{ margin: 0, paddingLeft: 24, listStylePosition: "outside" }} {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul style={{ margin: 0, paddingLeft: 24, listStylePosition: "outside" }} {...props} />
                    ),
                    li: ({ node, ...props }) => <li style={{ margin: "0.25rem 0" }} {...props} />,
                    a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />
                  }}
                  // Root container styles for the rendered markdown
                  style={{
                    lineHeight: 1.4,
                    margin: 0,
                    padding: 0,
                    display: "block"
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div style={responsiveStyles.chatbox}>
        <textarea
          style={responsiveStyles.input}
          placeholder="Ask me anything about Shusei Yokoi!"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
        />
        <button style={responsiveStyles.button} onClick={handleSend} disabled={loading}>
          {loading ? "Thinking..." : "Send"}
        </button>

        {/* Footer Links */}
        <div style={staticStyles.footer}>
          <Link to="/terms" style={{ ...staticStyles.footerLink, marginRight: "15px" }}>
            Terms of Use
          </Link>
          <Link to="/privacy" style={staticStyles.footerLink}>
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatApp />} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  );
}

export default App;
