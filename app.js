const express = require("express");
const generateNotes = require("./openrouter");
require("dotenv").config();

const app = express();

// Activer le CORS si tu comptes appeler cette API depuis un frontend externe
const cors = require("cors");
app.use(cors());

// Servir les fichiers statiques depuis le dossier "public"
app.use(express.static("public"));

// API REST : /api/notes génère et retourne les notes
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await generateNotes();

    // Vérifie si le contenu est une erreur retournée sous forme de texte
    if (
      typeof notes === "string" &&
      (notes.includes("Erreur") || notes.includes("erreur") || notes.includes("vide"))
    ) {
      res.status(502).send(notes);
    } else {
      res.status(200).send(notes);
    }
  } catch (error) {
    console.error("Erreur lors de la génération des notes :", error.message);
    res.status(500).send("Erreur interne du serveur.");
  }
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
