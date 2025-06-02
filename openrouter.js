const axios = require('axios');
require('dotenv').config();

const prompt = Génère 20 notes spirituelles chrétiennes inspirantes, courtes (100 mots max), aléatoires, avec un verset biblique et une courte prière.;

async function generateNotes() {
try {
const response = await axios.post(
'https://openrouter.ai/api/v1/chat/completions',
{
model: 'openai/gpt-3.5-turbo',
messages: [{ role: 'user', content: prompt }],
max_tokens: 2000
},
{
headers: {
'Authorization': Bearer ${process.env.OPENROUTER_API_KEY},
'Content-Type': 'application/json',
'HTTP-Referer': 'https://note.onrender.com',
'X-Title': 'Notes spirituelles'
}
}
);

kotlin
Copy
Edit
if (
  response.data &&
  response.data.choices &&
  response.data.choices.length > 0
) {
  return response.data.choices[0].message.content;
} else {
  console.error('Réponse inattendue d’OpenRouter:', response.data);
  return 'Impossible de générer les notes pour le moment.';
}
} catch (error) {
if (error.response) {
console.error(
'Erreur OpenRouter:',
error.response.status,
error.response.data
);
} else {
console.error('Erreur inconnue:', error.message);
}
return 'Impossible de générer les notes pour le moment.';
}
}

module.exports = generateNotes;
