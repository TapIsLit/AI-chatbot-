const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");

// Load saved chat
window.onload = () => {
  const saved = localStorage.getItem("chat");
  if (saved) chatBox.innerHTML = saved;
};

// Save chat
function saveChat() {
  localStorage.setItem("chat", chatBox.innerHTML);
}

// Add message bubble
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  saveChat();
}

// Typing animation
function showTyping() {
  const typing = document.createElement("div");
  typing.classList.add("message", "bot");
  typing.id = "typing";
  typing.innerText = "Typing...";
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Remove typing
function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

// Send message
async function sendMessage() {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  addMessage(userMessage, "user");
  input.value = "";

  showTyping();

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a cool cyberpunk AI assistant." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await res.json();
    removeTyping();

    const reply = data.choices[0].message.content;
    addMessage(reply, "bot");

  } catch (err) {
    removeTyping();
    addMessage("⚠️ Error: " + err.message, "bot");
  }
}

// Enter key support
input.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});
