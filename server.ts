import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check API
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Welleni" });
  });

  // AI Support & Symptom Assistant Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        // Fallback response if GEMINI_API_KEY is not set yet
        const fallbackText = "Hello! I am Sri Sankalpa Hospital's AI Health & Support Assistant. Sri Sankalpa Hospitals Pvt. Ltd. in Kodad offers comprehensive Obstetrics & Gynecology (Dr. Adapa Sandhya), General & Laparoscopic Surgery, and 24/7 General Physician & Emergency Care (Dr. Vishwa Kiran Sai). We are located on Huzurnagar Road, beside TTD Kalyana Mandapam, Kodad. Emergency contact numbers: 7095330066, 7095330077, 8500139123. How can I assist you today?";
        return res.json({ text: fallbackText });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = `You are the empathetic, knowledgeable AI Health & Support Assistant for Sri Sankalpa Hospital (Sri Sankalpa Hospitals Pvt. Ltd.).
Sri Sankalpa Hospital is located on Huzurnagar Road, beside TTD Kalyana Mandapam, opp. santha (pasuvula santha), Kodad, Telangana 508206.
Contact / Emergency Phone Numbers: 7095330066, 7095330077, 8500139123.

DOCTORS & SPECIALTIES:
1. Dr. Adapa Sandhya (M.B.B.S., DNB (OBGY) Yashoda, FMAS | Reg No: TSMC/FMR/44255)
   - Specialty: Obstetrics & Gynecology Specialist
   - Services: Period-related problems, hormonal disorders, PCOD / PCOS treatment, infertility / difficulty in conceiving, endometriosis, tubectomy, pregnancy care, gynecological diseases, fibroids, ectopic pregnancy, abnormal/heavy bleeding, uterine conditions, and laparoscopic gynecological surgery.
   - Consultation Fee: ₹400

2. Dr. Vishwa Kiran Sai (M.B.B.S., FMG | Reg No: TSMC/FMR/42614)
   - Specialty: General Physician & Emergency Specialist
   - Services: 24/7 Emergency & Poisoning cases, Snake bites, Scorpion bites, Blood Pressure (BP), Diabetes/Sugar, Thyroid, Malaria, Dengue, Jaundice, Filariasis, Fits/Seizures, Paralysis, Ulcers, Gastric problems, Breathing difficulty, Cough, UTI, Kidney stones, and Elderly/Geriatric care.
   - Consultation Fee: ₹350

SURGICAL SERVICES:
- General & Laparoscopic Surgery: Hernia (intestinal displacement/protrusion), 24-hour emergency abdominal surgical services, Piles, fissures & fistula operations, Gallbladder operations, Abdominal lumps/masses, Diabetic wounds care & surgery.

FACILITY HIGHLIGHTS:
- Open 24/7 with round-the-clock emergency, casualty & surgical response.
- Online appointment booking available with instant slot confirmation.

Guidance Guidelines:
- Provide clear, compassionate, and reassuring answers regarding medical specialties, treatments available at Sri Sankalpa Hospital, appointment bookings, doctor qualifications, and hospital address/directions.
- Always include a reminder that in case of acute medical emergencies, poisonings, or bites, patients should immediately visit the 24/7 casualty at Sri Sankalpa Hospital or call 7095330066 / 7095330077.`;

      const contents = history && Array.isArray(history) && history.length > 0
        ? [
            ...history.map((h: { role: string; content: string }) => ({
              role: h.role === "assistant" ? "model" : "user",
              parts: [{ text: h.content }],
            })),
            { role: "user", parts: [{ text: message }] },
          ]
        : message;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({ text: response.text });
    } catch (error: unknown) {
      console.error("Error in /api/chat:", error);
      const errorMessage = error instanceof Error ? error.message : "Internal server error";
      return res.status(500).json({ error: errorMessage });
    }
  });

  // Vite middleware in dev, static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Welleni Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
