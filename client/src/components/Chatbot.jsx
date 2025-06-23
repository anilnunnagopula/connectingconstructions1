import React, { useState } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

      console.log("🔐 API KEY:", apiKey); // For debugging

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: input }],
        }),
      });

      const data = await res.json();
      console.log("📦 OpenAI Response:", data);

      if (data?.choices && data.choices.length > 0) {
        const reply = data.choices[0].message.content;
        setMessages([...newMessages, { role: "assistant", content: reply }]);
      } else if (data?.error) {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content:
              "⚠️ OpenAI says: " +
              (data.error.message || "Too many requests. Try again later."),
          },
        ]);
      } else {
        setMessages([
          ...newMessages,
          { role: "assistant", content: "No response from AI 🫠" },
        ]);
      }
    } catch (err) {
      console.error("🔥 Error caught in chatbot:", err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Oops! Something went wrong." },
      ]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-white rounded-xl shadow-lg flex flex-col">
          <div className="bg-blue-600 text-white p-3 rounded-t-xl flex justify-between items-center">
            <h4 className="font-semibold">AI Assistant</h4>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.role === "user"
                    ? "text-right text-blue-600"
                    : "text-left text-gray-700"
                }`}
              >
                <p className="bg-gray-100 px-3 py-1 rounded">{msg.content}</p>
              </div>
            ))}
          </div>

          <div className="flex p-2 border-t">
            <input
              className="flex-1 p-2 border rounded-l outline-none"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition"
          onClick={() => setIsOpen(true)}
        >
          💬
        </button>
      )}
    </div>
  );
};

export default Chatbot;
