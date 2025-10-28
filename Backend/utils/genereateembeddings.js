// utils/embedding.js
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export const generateEmbedding = async (text) => {
  const HF_API_KEY = process.env.HF_API_KEY;
  const response = await fetch(
    "https://api-inference.huggingface.co/embeddings/sentence-transformers/all-MiniLM-L6-v2",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    }
  );
  const data = await response.json();
  return data.embedding;
};
