import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2";

const MODEL_ID = "onnx-community/SmolLM2-360M-Instruct";
env.allowLocalModels = false;
env.useBrowserCache = true;

const chatLog = document.querySelector("#chat-log");
const chatForm = document.querySelector("#chat-form");
const input = document.querySelector("#user-input");
const sendBtn = document.querySelector("#send-btn");
const loadBtn = document.querySelector("#load-model-btn");
const modelStatus = document.querySelector("#model-status");
const statusBox = document.querySelector(".status");
const charCount = document.querySelector("#char-count");
const suggestions = document.querySelector("#suggestions");
const clearBtn = document.querySelector("#clear-btn");
const toast = document.querySelector("#toast");

let generator = null;
let busy = false;
let conversation = [];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 3200);
}

function setStatus(state, label) {
  statusBox.className = `status ${state}`;
  modelStatus.textContent = label;
}

function addMessage(text, who = "spirit") {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${who === "user" ? "user-message" : "spirit-message"}`;
  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = who === "user" ? "✦" : "👻";
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  bubble.appendChild(paragraph);
  wrapper.append(avatar, bubble);
  chatLog.appendChild(wrapper);
  chatLog.scrollTop = chatLog.scrollHeight;
  return paragraph;
}

async function loadModel() {
  if (generator || busy) return;
  busy = true;
  loadBtn.disabled = true;
  loadBtn.textContent = "Summoning…";
  setStatus("loading", "DOWNLOADING MODEL");
  showToast("The spirit is entering… the first download may take a few minutes.");
  try {
    generator = await pipeline("text-generation", MODEL_ID, {
      device: "wasm",
      dtype: "q4",
      progress_callback: (progress) => {
        if (progress.status === "progress" && progress.total) {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          modelStatus.textContent = `LOADING ${percent}%`;
        }
      }
    });
    setStatus("ready", "SPIRIT ONLINE");
    loadBtn.textContent = "Spirit summoned ✓";
    showToast("The spirit has arrived. Ask your first question.");
  } catch (error) {
    console.error(error);
    setStatus("", "MODEL LOAD FAILED");
    loadBtn.disabled = false;
    loadBtn.textContent = "Try again";
    showToast("Could not load the model. Check your internet connection and try again.");
  } finally {
    busy = false;
  }
}

async function sendMessage(message) {
  const text = message.trim();
  if (!text || busy) return;
  if (!generator) {
    showToast("Summon the spirit first using the button below.");
    return;
  }

  addMessage(text, "user");
  conversation.push({ role: "user", content: text });
  input.value = "";
  charCount.textContent = "0 / 500";
  suggestions.hidden = true;
  busy = true;
  sendBtn.disabled = true;
  const replyNode = addMessage("The spirit is thinking…", "spirit");
  replyNode.classList.add("typing");

  const messages = [
    { role: "system", content: "You are The Spirit, a mysterious but friendly supernatural storyteller. Reply in an atmospheric, playful and concise way. You can tell spooky fictional stories, riddles, and mysteries. Keep responses suitable for a general audience. Do not claim to actually contact spirits or know the future. Usually answer in 2 to 5 sentences." },
    ...conversation.slice(-8)
  ];

  try {
    const result = await generator(messages, {
      max_new_tokens: 150,
      do_sample: true,
      temperature: 0.85,
      top_p: 0.9,
      repetition_penalty: 1.15
    });
    const output = result?.[0]?.generated_text;
    let reply = "";
    if (Array.isArray(output)) {
      const lastAssistant = [...output].reverse().find(item => item.role === "assistant");
      reply = lastAssistant?.content || "";
    } else if (typeof output === "string") {
      reply = output.slice(output.lastIndexOf("assistant") + 9).trim();
    }
    reply = reply.trim() || "The shadows swallowed my words. Ask me once more…";
    replyNode.textContent = reply;
    replyNode.classList.remove("typing");
    conversation.push({ role: "assistant", content: reply });
  } catch (error) {
    console.error(error);
    replyNode.textContent = "A strange silence has fallen. Please try again.";
    replyNode.classList.remove("typing");
    showToast("Generation failed. Please try again.");
  } finally {
    busy = false;
    sendBtn.disabled = false;
    input.focus();
    chatLog.scrollTop = chatLog.scrollHeight;
  }
}

loadBtn.addEventListener("click", loadModel);
chatForm.addEventListener("submit", event => {
  event.preventDefault();
  sendMessage(input.value);
});
input.addEventListener("input", () => {
  charCount.textContent = `${input.value.length} / 500`;
});
suggestions.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  input.value = button.textContent.trim();
  sendMessage(input.value);
});
clearBtn.addEventListener("click", () => {
  conversation = [];
  chatLog.replaceChildren();
  addMessage("The room is quiet again… What shall we uncover this time?", "spirit");
  suggestions.hidden = false;
});
