const axios = require('axios');
require('dotenv').config();

const prompt = "Génère 20 notes spirituelles chrétiennes inspirantes, courtes (100 mots max), aléatoires, avec un verset biblique et une courte prière. Formate les notes comme suit : \n\n1. \"Verset\" - Référence\nPrière : texte de la prière.";

async function generateNotes() {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 3000
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://note-ohr8.onrender.com",
          "X-Title": "Générateur de notes spirituelles"
        }
      }
    );

    if (
      response.data &&
      response.data.choices &&
      response.data.choices.length > 0 &&
      response.data.choices[0].message &&
      response.data.choices[0].message.content
    ) {
      const raw = response.data.choices[0].message.content;

      // Nettoyage et séparation correcte des notes
      const notesArray = raw
        .split(/\n?\d+\.\s+/) // découpe chaque note commençant par 1. 2. etc.
        .map(s => s.trim())
        .filter(Boolean)
        .map((note, index) => `Note ${index + 1}\n${note}`); // ajoute un titre "Note x" avant chaque bloc

      const cleanedContent = notesArray.join("\n\n");

      return cleanedContent; // 👉 ceci sera envoyé au frontend dans /api/notes
    } else {
      return "Réponse vide ou inattendue reçue de l'API OpenRouter.";
    }

  } catch (error) {
    console.error("Erreur avec OpenRouter:", error.response?.data || error.message);
    return `Erreur lors de la génération des notes : ${JSON.stringify(error.response?.data || error.message)}`;
  }
}

module.exports = generateNotes;