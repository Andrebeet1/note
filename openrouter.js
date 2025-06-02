const axios = require('axios');
require('dotenv').config();

const prompt = "Génère 20 notes spirituelles chrétiennes inspirantes, courtes (100 mots max), aléatoires, avec un verset biblique et une courte prière.";

async function generateNotes() {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1',
      {
        model: "openai/gpt-3.5-turbo", // ou un autre modèle supporté par OpenRouter
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://note-ohr8.onrender.com", // facultatif
          "X-Title": "Générateur de notes spirituelles"      // facultatif
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
      return response.data.choices[0].message.content;
    } else {
      return "Réponse vide ou inattendue reçue de l'API OpenRouter.";
    }

  } catch (error) {
    console.error("Erreur avec OpenRouter:", error.response?.data || error.message);
    return "Impossible de générer les notes pour le moment.";
  }
}

module.exports = generateNotes;
