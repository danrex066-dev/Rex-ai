# REX AI — starter web app

This is a responsive web app with:
- Chat powered by the OpenAI Responses API.
- A server-side API key (never put the key in browser code).
- Personality selector.
- Phone/browser speech input and speech output using available device voices.

## Run locally
1. Install Node.js 18 or newer.
2. Copy `.env.example` to `.env`.
3. Put your OpenAI API key in `.env`.
4. Run `npm install`, then `npm start`.
5. Open `http://localhost:3000`.

## Deploy
Deploy this folder as a Node web service on a hosting provider that supports Node.js.
Set the environment variable `OPENAI_API_KEY` in the host's private environment-variable settings.
Use `npm install` as the build/install command and `npm start` as the start command.
Do not upload `.env` or share your API key.

## Voice limitations
Voice input/output here use browser/device speech features, not OpenAI's Realtime API. The exact voices and accents depend on the Android device and browser. A later upgrade can add live speech-to-speech through a secure Realtime session endpoint.

## Important
Hosting and OpenAI API usage may incur charges. Set usage limits in your OpenAI account and hosting provider. Do not expose API keys in screenshots, chats, source control, or the browser.
