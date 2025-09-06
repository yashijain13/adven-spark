import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/ai", async (req, res) => {
  const { prompt, context } = req.body;

const url = 'https://api.perplexity.ai/chat/completions';
const options = {
  method: 'POST',
  headers: {Authorization: 'Bearer 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', 'Content-Type': 'application/json'},
  body: `{"model":"sonar","return_images":true,"messages":[{"role":"system","content":"${context}"},{"role":"user","content":"${prompt}"}]}`
};

try {
  const response = await fetch(url, options);
  const data = await response.json();

      res.json({ result: data });

  console.log(data);
} catch (err) {
    res.status(500).json({ error: "Perplexity AI service error", details: err.message });
}
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Perplexity AI server running on port ${PORT}`);
});