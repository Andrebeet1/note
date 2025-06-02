// app.js
const express = require("express");
const generateNotes = require("./openrouter");
require("dotenv").config();

const app = express();

// Servir les fichiers statiques dans le dossier "public"
app.use(express.static("public"));

// API pour obtenir les notes spirituelles
app.get("/api/notes", async (req, res) => {
try {
const notes = await generateNotes();
res.status(200).send(notes);
} catch (error) {
console.error("Erreur lors de la génération des notes :", error.message);
res.status(500).send("Erreur interne du serveur.");
}
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
console.log(✅ Serveur lancé sur http://localhost:${PORT})
);
