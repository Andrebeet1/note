const axios = require('axios');
require('dotenv').config();

const prompt = `Génère 20 notes chrétiennes inspirantes. Pour chaque note, suis exactement ce format :

1. Commence par un **verset biblique** (1 ligne), comme une citation (ex : Jean 3:16 - "Car Dieu a tant aimé le monde...").

2. Ensuite, saute une ligne puis écris une **méditation courte** de 3 à 5 lignes (maximum 80 mots).

3. Ensuite, saute une ligne et écris une **prière simple d'une ou deux lignes**, en citant le verset ou son idée principale.

Sépare chaque note par deux sauts de ligne (\n\n). N'utilise pas de titre ni de numérotation. N’ajoute rien d’autre.`;

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