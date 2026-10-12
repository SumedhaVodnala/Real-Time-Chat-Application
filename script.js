// ---------- JavaScript ----------
const messagesEl = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");
const statusEl = document.getElementById("status");
const headerAvatar = document.getElementById("headerAvatar");

const replies = [
  "Hi,Hello, Haha, that's great!", "Okay, sounds good 👍", "Can you tell me more?",
  "Let's watch movie", "Let's meet after class.",
  "Sure, I'll send you the notes later.",
  "Thanks for telling me 😊"
];


function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}


function addMessage(text, type) {
  const row = document.createElement("div");
  row.className = "row " + type;

  const avatar = document.createElement("div");
  avatar.className = "avatar " + (type === "in" ? "friend" : "me");
  avatar.textContent = type === "in" ? "PS" : "Me";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;           

  const time = document.createElement("span");
  time.className = "time";
  time.textContent = timeNow();
  bubble.appendChild(time);

  row.append(avatar, bubble);
  messagesEl.appendChild(row);
  scrollDown();
}

function scrollDown() { messagesEl.scrollTop = messagesEl.scrollHeight; }

// "Typing…" dots shown while the friend is replying
function showTyping() {
  const row = document.createElement("div");
  row.className = "row in typing";
  row.id = "typing";
  row.innerHTML = '<div class="avatar friend">PS</div><div class="bubble"><i></i><i></i><i></i></div>';
  messagesEl.appendChild(row);
  scrollDown();
}
function hideTyping() {
  const t = document.getElementById("typing");
  if (t) t.remove();
}

// Header status: "Online" or "Last seen today at …"
function setOnline(isOnline) {
  headerAvatar.classList.toggle("online", isOnline);
  statusEl.textContent = isOnline ? "Online" : "Last seen today at " + timeNow();
}

let awayTimer;
function friendReply() {
  clearTimeout(awayTimer);
  setOnline(true);
  statusEl.textContent = "typing…";
  showTyping();
  setTimeout(() => {
    hideTyping();
    addMessage(replies[Math.floor(Math.random() * replies.length)], "in");
    setOnline(true);
    // After 15 seconds of silence the friend goes "offline"
    awayTimer = setTimeout(() => setOnline(false), 15000);
  }, 1200 + Math.random() * 1200);
}

// Enable the Send button only when there is text
input.addEventListener("input", () => {
  sendBtn.disabled = input.value.trim() === "";
});

// Send on button click or Enter key (the form handles both)
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, "out");
  input.value = "";
  sendBtn.disabled = true;
  input.focus();
  friendReply();
});

// Starter message
addMessage("Hi! 👋 Type a message below to start chatting.", "in");
awayTimer = setTimeout(() => setOnline(false), 15000);