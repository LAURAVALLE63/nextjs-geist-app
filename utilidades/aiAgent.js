/**
 * AI Agent instructions and helper functions for analyzing manuscript content
 * and generating design elements and cover page info.
 * 
 * This module can be integrated with an AI API like OpenAI to send prompts and receive responses.
 */

const aiInstructions = `
Eres un asistente que analiza manuscritos para convertirlos en libros profesionales.
1. Detecta el tipo de libro: desarrollo personal, espiritualidad, negocios, etc.
2. Sugiere frases destacadas, espacios para ejercicios y llamadas a la acción según el tipo.
3. Genera un título, subtítulo y nombre del autor para la portada.
4. Devuelve un resumen estructurado con:
   - tipoLibro
   - frasesDestacadas
   - espaciosEjercicios
   - llamadasAccion
   - titulo
   - subtitulo
   - autor
`;

async function analyzeManuscriptContent(openaiClient, manuscriptText) {
  const prompt = `${aiInstructions}

Manuscrito:
${manuscriptText}

Devuelve un JSON con la estructura solicitada.`;

  const response = await openaiClient.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const content = response.data.choices[0].message.content;
  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error("Error parsing AI response: " + error.message);
  }
}

export { analyzeManuscriptContent };
