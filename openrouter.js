const axios = require('axios');
require('dotenv').config();

const BASE_PROMPT = (start, end) => `
Génère les notes chrétiennes inspirantes numéro ${start} à ${end}, chacune respectant strictement le format suivant :

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
- Numérote les notes de ${start} à ${end} dans la ligne "🌿 [numéro]. Verset + Prière :".  
- Sépare chaque note par exactement deux retours à la ligne (\\n\\n).  
- Veille à ce que la prière soit complète et suffisamment longue pour inspirer.

Merci de suivre ces instructions à la lettre.
`;

async function fetchBatch(start, end) {
  const prompt = BASE_PROMPT(start, end);

  try {
    const response = await axios.post(
      'https://api.cohere.ai/v1/chat',
      {
        model: "command-r-plus",
        temperature: 0.9,
        max_tokens: 1024,           // Réduit pour éviter dépassement
        messages: [
          { role: "user", content: prompt }
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Accès à la réponse corrigée
    const messageContent = response?.data?.generations?.[0]?.text 
      || response?.data?.choices?.[0]?.message?.content;

    if (messageContent && typeof messageContent === "string" && messageContent.trim() !== "") {
      return messageContent.trim();
    } else {
      return `⚠️ Réponse vide ou inattendue de l'API pour les notes ${start} à ${end}.`;
    }

  } catch (error) {
    console.error(`❌ Erreur lors de la génération des notes ${start} à ${end}:`, error.response?.data || error.message);
    return `Erreur API : ${JSON.stringify(error.response?.data || error.message)}`;
  }
}

async function generateAllNotes() {
  const results = [];

  for (let i = 0; i < 4; i++) {
    const start = i * 5 + 1;
    const end = start + 4;

    console.log(`⏳ Génération des notes ${start} à ${end}...`);
    const batch = await fetchBatch(start, end);
    results.push(batch);
  }

  return results.join("\n\n");
}

module.exports = generateAllNotes;