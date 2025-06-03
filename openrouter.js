const axios = require('axios');
require('dotenv').config();

const prompt = `Génère 20 notes spirituelles chrétiennes inspirantes, courtes (100 mots max), aléatoires, chacune avec :
- un verset biblique,
- une courte méditation (3-5 lignes),
- et une prière (1-2 lignes).
Retourne-les séparées par deux sauts de ligne (\n\n).`;

async function generateNotes() {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
        temperature: 1.0
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
      response.data.choices[0] &&
      response.data.choices[0].message &&
      response.data.choices[0].message.content
    ) {
      return response.data.choices[0].message.content;
    } else {
      return "Réponse vide ou inattendue de l'API.";
    }
  } catch (error) {
    console.error("Erreur OpenRouter:", error.response?.data || error.message);
    return `Erreur API : ${JSON.stringify(error.response?.data || error.message)}`;
  }
}

module.exports = generateNotes;