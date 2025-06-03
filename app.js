const express = require("express");
const cors = require("cors");
require("dotenv").config();
const generateNotes = require("./openrouter");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Sert index.html, JS, CSS, etc.

// API Route
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await generateNotes();

    if (!notes || typeof notes !== "string" || notes.trim() === "" || notes.toLowerCase().includes("erreur")) {
      return res.status(502).json({ error: "Contenu vide ou invalide." });
    }

    res.status(200).json({ content: notes });
  } catch (err) {
    console.error("❌ Erreur API :", err.message || err);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});