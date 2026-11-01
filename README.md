# 👻 GhostChat AI — Conversations Beyond the Veil

GhostChat AI is a spooky, browser-based chatbot powered by an open-weight language model. Ask it for eerie stories, strange riddles, and mysterious answers.

## Features
- Dark, responsive Halloween-inspired interface.
- Uses **SmolLM2-360M-Instruct**, an open-weight language model.
- Runs inference in the browser using Hugging Face Transformers.js and WebAssembly.
- No API key and no application backend required.
- Conversation reset, prompt suggestions, loading status, and error feedback.

## Tech stack
- HTML5
- CSS3
- JavaScript ES modules
- [Hugging Face Transformers.js](https://huggingface.co/docs/transformers.js)
- [SmolLM2-360M-Instruct ONNX model](https://huggingface.co/onnx-community/SmolLM2-360M-Instruct)

## Run locally
A local web server is required because the app uses JavaScript modules.

### Option 1: VS Code
1. Extract this ZIP.
2. Open the `GhostChat-AI` folder in VS Code.
3. Install the **Live Server** extension.
4. Right-click `index.html` and select **Open with Live Server**.
5. Click **Summon the spirit** and wait for the model to load.
6. Start chatting.

### Option 2: Python
From this folder, run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## First-run notes
- The browser downloads the model files from Hugging Face the first time you summon the spirit. This can take a few minutes and requires an internet connection.
- Transformers.js uses browser caching, so repeat visits may reuse downloaded files.
- Model inference is configured to use WebAssembly (`wasm`) for broad browser compatibility. Generation speed depends on your device.
- The app does not send chat messages to a custom server. The model files are fetched from the Hugging Face CDN; generation takes place locally in the browser after loading.
- For the best experience, use a recent version of Chrome or Edge.

## Project structure

```text
GhostChat-AI/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Open innovation
GhostChat demonstrates how open-weight models and open-source browser tooling can make AI experimentation more accessible. Developers can inspect the implementation, replace the model, adjust generation settings, and build on the project without relying on a paid proprietary AI API.

## Limitations
This is a student demo, not a production chatbot. The model can produce inaccurate, repetitive, or unexpected text. Do not use it for medical, legal, emergency, or other high-stakes advice.

## License
The project source code is provided under the MIT License. The model has its own license and terms; check the model card before redistributing model files.
