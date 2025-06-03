const axios = require('axios');
require('dotenv').config();

const prompt = `
Génère 20 notes chrétiennes inspirantes, chacune respectant strictement le format suivant :

🌿 [numéro]. Verset + Prière : [Thème inspirant ou mot-clé]

📖 Verset du jour  
[Texte exact du verset] — [Référence biblique]

🙏 Prière :  
[Une prière développée, sincère et profondément inspirée par le verset, suffisamment riche pour nourrir la méditation]

💬 Citation :  
[Une citation inspirante en lien avec le thème, sans mention d’auteur]

Consignes impératives :  
- Respecte précisément ce format pour chaque note, sans aucune variation.  
- Ne fournis aucun contenu supplémentaire : pas d’introduction, de résumé ou de séparateur.  
- Numérote les notes de 1 à 20 dans la ligne "🌿 [numéro]. Verset + Prière :".  
- Sépare chaque note par exactement deux retours à la ligne (\\n\\n).  
- Veille à ce que la prière soit complète et suffisamment longue pour inspirer.

Merci de suivre ces instructions à la lettre.
`;

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

    const messageContent = response?.data?.choices?.[0]?.message?.content;
    if (messageContent) {
      return messageContent.trim();
    } else {
      return "Réponse vide ou inattendue de l'API.";
    }
  } catch (error) {
    console.error("Erreur OpenRouter:", error.response?.data || error.message);
    return `Erreur API : ${JSON.stringify(error.response?.data || error.message)}`;
  }
}

module.exports = generateNotes;