const express = require("express");
const generateNotes = require("./openrouter");
require("dotenv").config();
const app = express();

app.use(express.static("public"));

app.get("/api/notes", async (req, res) => {
  const notes = await generateNotes();
  res.send(notes);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));
