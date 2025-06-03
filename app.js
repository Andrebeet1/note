const express = require("express");
const cors = require("cors");
require("dotenv").config();
const generateNotes = require("./openrouter");

const app = express();
app.use(cors());
app.use(express.static("public")); // Dossier contenant index.html, JS, CSS

// API route
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await generateNotes();

    if (!notes || typeof notes !== "string" || notes.includes("Erreur")) {
      return res.status(502).json({ error: "Contenu vide ou invalide." });
    }

    res.status(200).json({ content: notes });
  } catch (err) {
    console.error("Erreur API :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Serveur lancé sur http://localhost:${PORT}`));