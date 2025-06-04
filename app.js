const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Chargement sécurisé de generateNotes
let generateNotes;
try {
  generateNotes = require("./openrouter");
} catch (error) {
  console.error("❌ Impossible de charger le module openrouter.js :", error.message);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Sert les fichiers statiques de /public

// Route API : Génère et renvoie les notes
app.get("/api/notes", async (req, res) => {
  if (typeof generateNotes !== "function") {
    return res.status(500).json({ error: "La fonction generateNotes est indisponible." });
  }

  try {
    const notes = await generateNotes();

    if (
      !notes ||
      typeof notes !== "string" ||
      notes.trim() === "" ||
      notes.toLowerCase().includes("erreur")
    ) {
      return res.status(502).json({ error: "Contenu vide ou invalide retourné." });
    }

    res.setHeader("Cache-Control", "no-store"); // Empêche la mise en cache
    return res.status(200).json({ content: notes });
  } catch (err) {
    console.error("❌ Erreur lors de la génération des notes :", err.message || err);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
