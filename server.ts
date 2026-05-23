import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client to prevent crash if key is missing on start
let globAi: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!globAi) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    globAi = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return globAi;
}

// REST API endpoints
app.get("/api/health", (_req, res) => {
  res.json({ status: "healthy", env: process.env.NODE_ENV || "development" });
});

// Endpoint to generate test cases and automation scripts
app.post("/api/qa-assistant/generate", async (req, res) => {
  try {
    const { featureName, techStack, testType, extraDetails } = req.body;

    if (!featureName || !techStack || !testType) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are an elite Staff QA Automation and Quality Architect at Ubuy. Your goal is to write perfect, production-grade test cases, cucumber scenarios, and modular automation scripts.
Always ensure your automation code follows industry best practices (e.g., Page Object Model, descriptive assertions, clean variables, and robust locators).
Return raw Markdown with elegant headers and neat syntax highlighting. Do not include introductory conversational noise; start directly with the results.`;

    const prompt = `Generate a comprehensive QA suite for the following:
Feature or Page: "${featureName}"
Technology/Framework requested: "${techStack}"
Type of Testing: "${testType}"
Additional Context or Constraints: "${extraDetails || "None provided"}"

Please include:
1. **Behavioral Scenarios (BDD/Gherkin standard)**: Detailed steps showing various user journeys (such as positive flow, field validation, and error boundaries).
2. **Modular Automation Script**: Complete, clean ${techStack} script with clear comments, assertions, and using selector patterns.
3. **Manual Verification Guidelines**: Edge-cases to inspect manually (including network performance, security traps, and device response checks).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error("Gemini QA Generation Error:", error);
    res.status(500).json({
      error: error.message || "Failed to generate QA script via Gemini API. Please make sure GEMINI_API_KEY is configured in your secrets."
    });
  }
});

// Integration script serving and Vite setups
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Started in DEVELOPMENT mode using Vite middleware.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Started in PRODUCTION mode serving static build.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ubuy QA Portfolio Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Critical error setting up the server:", err);
});
