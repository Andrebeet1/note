const express = require("express");
const generateNotes = require("./openrouter");
require("dotenv").config();

const app = express();

// CORS si le frontend est séparé
const cors = require("cors");
app.use(cors());

// Fichiers statiques (HTML, JS, CSS dans "public")
app.use(express.static("public"));

// API REST : /api/notes
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await generateNotes();

    if (
      typeof notes === "string" &&
      (notes.includes("Erreur") || notes.includes("erreur") || notes.includes("vide"))
    ) {
      return res.status(502).send(notes);
    }

    res.status(200).send(notes);
  } catch (error) {
    console.error("Erreur lors de la génération des notes :", error.message);
    res.status(500).send("Erreur interne du serveur.");
  }
});

// Lancer serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
