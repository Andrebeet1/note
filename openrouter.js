const axios = require('axios');
require('dotenv').config();

// Prompt : ce que tu demandes à l'IA de générer
const prompt = "Génère 20 notes spirituelles chrétiennes inspirantes, courtes (100 mots max), aléatoires, avec un verset biblique et une courte prière.";

async function generateNotes() {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1',
      {
        model: "openai/gpt-3.5-turbo", // ou autre modèle autorisé sur ton compte OpenRouter
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`, // ✅ Corrigé
          "Content-Type": "application/json",
          "HTTP-Referer": "https://note-ohr8.onrender.com", // facultatif mais utile
          "X-Title": "Générateur de notes spirituelles" // facultatif
        }
      }
    );

    console.log("Réponse OpenRouter brute :", response.data); // Utile pour debug

    // Vérification et extraction de la réponse
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
    return `Erreur lors de la génération des notes : ${JSON.stringify(error.response?.data || error.message)}`;
  }
}

module.exports = generateNotes;
