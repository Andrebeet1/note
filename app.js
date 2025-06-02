const express = require("express");
const generateNotes = require("./openrouter");
require("dotenv").config();

const app = express();

// CORS (utile si frontend séparé)
const cors = require("cors");
app.use(cors());

// Fichiers statiques (HTML, JS, CSS dans "public")
app.use(express.static("public"));

// Route API : /api/notes
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await generateNotes();

    if (
      typeof notes !== "string" ||
      notes.includes("Erreur") ||
      notes.trim() === ""
    ) {
      return res.status(502).json({ error: "Contenu invalide ou vide." });
    }

    res.status(200).json({ content: notes }); // ⬅ On renvoie un objet { content: ... }
  } catch (error) {
    console.error("Erreur lors de la génération des notes :", error.message);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
