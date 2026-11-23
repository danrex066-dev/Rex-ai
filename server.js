import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const here = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(here, "public")));

app.post("/api/chat", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: "REX AI needs an API key configured on its server first." });
    }
    const { messages = [], personality = "Helpful, clear, creative" } = req.body ?? {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Send a message first." });
    }
    const safeMessages = messages.slice(-12).map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content ?? "").slice(0, 4000)
    }));
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions: `You are REX AI, a capable conversational assistant. Personality: ${String(personality).slice(0, 300)}. Be direct, useful, and honest. Follow applicable safety rules.`,
      input: safeMessages
    });
    res.json({ reply: response.output_text || "I couldn't form a response. Try again." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "REX AI couldn't reach its AI service. Check the server configuration and try again." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`REX AI running on port ${port}`));
