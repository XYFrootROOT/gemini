import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy Gemini client helper
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Multi-turn chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const {
      messages,
      systemInstruction,
      model = "gemini-3.5-flash",
      temperature = 0.7,
      stream = true,
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Invalid or empty messages array." });
    }

    const ai = getGeminiClient();

    // Map conversation messages to GenAI contents format
    // role: 'user' | 'model'
    const contents = messages.map((msg: { role: string; text: string }) => ({
      role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.text || "" }],
    }));

    const config: Record<string, any> = {
      temperature: typeof temperature === "number" ? temperature : 0.7,
    };

    if (systemInstruction && typeof systemInstruction === "string" && systemInstruction.trim()) {
      config.systemInstruction = systemInstruction.trim();
    }

    if (stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const responseStream = await ai.models.generateContentStream({
        model,
        contents,
        config,
      });

      for await (const chunk of responseStream) {
        const text = chunk.text || "";
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }

      res.write("data: [DONE]\n\n");
      res.end();
    } else {
      const response = await ai.models.generateContent({
        model,
        contents,
        config,
      });

      res.json({
        text: response.text || "",
      });
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const errorMessage = error?.message || "Internal server error during AI generation.";
    const status = error?.status || 500;

    if (!res.headersSent) {
      res.status(status).json({ error: errorMessage });
    } else {
      res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
      res.end();
    }
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Gemini Chatbot server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
