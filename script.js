// ---------- JavaScript ----------
const messagesEl = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");
const statusEl = document.getElementById("status");
const headerAvatar = document.getElementById("headerAvatar");

// Smart replies: each rule has words to look for and some answers to pick from.
// The FIRST rule that matches the user's message wins. Add your own rules here!
const rules = [
  { match: /\b(hi|hii+|hello|hey|heyy+|hola)\b/,
    say: ["Hi! 👋", "Hello! 😊", "Hey! Good to hear from you!"] },
  { match: /good morning|\bgm\b/,
    say: ["Good morning! ☀️ Hope you slept well.", "Good morning! Ready for the day?"] },
  { match: /good night|\bgn\b/,
    say: ["Good night! 🌙 Sleep well.", "Night night! See you tomorrow."] },
  { match: /good afternoon/, say: ["Good afternoon! How's your day going?"] },
  { match: /good evening/, say: ["Good evening! How was your day?"] },
  { match: /how are you|how r u|how are u|how's it going|hows it going|what's up|whats up|wassup|sup\b/,
    say: ["I'm doing great, thanks for asking! How about you? 😊", "All good here! What about you?"] },
  { match: /\b(i'm|im|i am) (fine|good|great|okay|ok|well)\b|^(fine|good|great)\b/,
    say: ["Glad to hear that! 😄", "Nice! Anything fun planned today?"] },
  { match: /\b(sad|tired|bored|stressed|sick|upset)\b/,
    say: ["Aw, I'm sorry to hear that. Want to talk about it? 💙", "Hope you feel better soon. Take a little break! 🌿"] },
  { match: /your name|who are you|who r u/,
    say: ["I'm Priya! Nice to chat with you 😊"] },
  { match: /\bwhat time\b|\btime now\b/,
    say: [() => "It's " + timeNow() + " right now. ⏰"] },
  { match: /\bwhat('s| is) (the )?(date|day)\b|\btoday's date\b/,
    say: [() => "Today is " + new Date().toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" }) + ". 📅"] },
  { match: /\bthank(s| you)|\bthx\b|\bty\b/,
    say: ["You're welcome! 😊", "No problem, happy to help!"] },
  { match: /\bsorry\b/, say: ["No worries at all!", "It's okay, don't worry about it 🙂"] },
  { match: /\b(bye|goodbye|see you|see ya|cya|ttyl)\b/,
    say: ["Bye! Take care! 👋", "See you soon! 😊"] },
  { match: /\b(lol|haha+|hehe+|lmao)\b/, say: ["Haha 😂", "Ha! That was funny 😄"] },
  { match: /\b(love you|i love)\b/, say: ["Aww, that's so sweet! ❤️"] },
  { match: /\b(exam|test|homework|assignment|study|studying|class|school|college)\b/,
    say: ["Studying is tough, but you've got this! 📚 Which subject?", "Good luck! Need a study buddy? 😄"] },
  { match: /\b(food|eat|eating|hungry|lunch|dinner|breakfast|pizza|biryani)\b/,
    say: ["Now I'm hungry too! 😋 What's your favourite food?", "Yum! What are you having?"] },
  { match: /\b(movie|film|music|song|game|cricket|football)\b/,
    say: ["Ooh, nice! What do you like most about it?", "That sounds fun! Tell me more 🎬"] },
  { match: /\b(yes|yeah|yep|sure|ok|okay)\b/, say: ["Great! 👍", "Cool, sounds good!"] },
  { match: /\b(no|nope|nah)\b/, say: ["Oh, okay. Why not?", "That's fine! 🙂"] },
  { match: /\?\s*$/, say: ["Hmm, good question! What do you think?", "I'm not sure. What's your opinion?"] }
];

// Used when no rule matches. These keep the conversation going.
const fallback = [
  "Interesting! Tell me more.",
  "Oh really? 😮 Why is that?",
  "I see! And then what happened?",
  "Hmm, that makes sense. What else is new?"
];

// "my name is Ravi" -> "Nice to meet you, Ravi!"
function getReply(text) {
  const msg = text.toLowerCase().trim();
  const nameMatch = msg.match(/(?:my name is|i am called|call me)\s+([a-z]+)/);
  if (nameMatch) {
    const n = nameMatch[1][0].toUpperCase() + nameMatch[1].slice(1);
    return "Nice to meet you, " + n + "! 😊";
  }
  for (const rule of rules) {
    if (rule.match.test(msg)) {
      const answer = rule.say[Math.floor(Math.random() * rule.say.length)];
      return typeof answer === "function" ? answer() : answer;
    }
  }
  return fallback[Math.floor(Math.random() * fallback.length)];
}

// Format the current time like "10:42 AM"
function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

// Add one message to the page. type is "in" or "out".
function addMessage(text, type) {
  const row = document.createElement("div");
  row.className = "row " + type;

  const avatar = document.createElement("div");
  avatar.className = "avatar " + (type === "in" ? "friend" : "me");
  avatar.textContent = type === "in" ? "S" : "Me";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;            // textContent keeps user text safe

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
  row.innerHTML = '<div class="avatar friend">S</div><div class="bubble"><i></i><i></i><i></i></div>';
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
function friendReply(userText) {
  const currentReply = getReply(userText);
  clearTimeout(awayTimer);
  setOnline(true);
  statusEl.textContent = "typing…";
  showTyping();
  setTimeout(() => {
    hideTyping();
    addMessage(currentReply, "in");
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
  friendReply(text);
});

// Starter message
addMessage("Hi! 👋 Type a message below to start chatting.", "in");
awayTimer = setTimeout(() => setOnline(false), 15000);