// ✅ groqApi.js
import axios from 'axios';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const getTiptapJsonFromText = async (rawText) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: `You are a document formatter. Convert plain text into valid Tiptap JSON.
Infer headings based on font size or content patterns.
Structure the content with paragraphs, headings, and emphasis.
Do not include explanations, markdown, or anything other than the JSON.`
          },
          {
            role: 'user',
            content: `Convert this plain text to Tiptap JSON. Respond ONLY with the JSON:\n\n${rawText}`,
          }
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let content = response.data.choices[0].message.content.trim();
    const match = content.match(/\{[\s\S]*\}/);
    if (match) content = match[0];
    return content;
  } catch (err) {
    console.error('Groq API error:', err?.response?.data || err);
    alert(JSON.stringify(err?.response?.data || err, null, 2));
    throw err;
  }
};
