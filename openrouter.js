const axios = require('axios');
require('dotenv').config();

const prompt = `Génère 20 notes chrétiennes inspirantes dans ce format strict :

🌿 1. Verset + Prière : [Thème inspirant ou mot-clé]

📖 Verset du jour  
> "[Texte du verset]" — Référence biblique

🙏 Prière : [Une prière simple de l' inspirée du verset]

Respecte exactement ce format pour chaque note.  
Ne donne aucun autre texte que ce qui est demandé.  
N’ajoute ni introduction, ni résumé, ni numérotation globale, ni séparation décorative.  
Sépare chaque note par deux sauts de ligne (\\n\\n).`;

async function generateNotes() {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4000,
        temperature: 1.0,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://note-ohr8.onrender.com",
          "X-Title": "Générateur de notes spirituelles",
        },
      }
    );

    if (
      response.data &&
      response.data.choices &&
      response.data.choices[0] &&
      response.data.choices[0].message &&
      response.data.choices[0].message.content
    ) {
      return response.data.choices[0].message.content.trim();
    } else {
      return "Réponse vide ou inattendue de l'API.";
    }
  } catch (error) {
    console.error("Erreur OpenRouter:", error.response?.data || error.message);
    return `Erreur API : ${JSON.stringify(error.response?.data || error.message)}`;
  }
}

module.exports = generateNotes;