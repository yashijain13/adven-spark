import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

const OPENAI_API_KEY = "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";
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

app.post('/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || messages.length === 0) {
    return res.status(400).send({ error: 'Messages array is required.' });
  }

  try {
    // Make a POST request to the OpenAI API
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo', // or 'gpt-4o', etc.
        messages: messages, // pass user-provided messages
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Send the AI's reply back
    res.send(response.data.choices[0].message);
  } catch (error) {
    console.error('Error from OpenAI API:', error.response?.data || error.message);
    res.status(500).send({ error: 'Failed to fetch response from OpenAI API.' });
  }
});

// Start server
app.listen(4002, () => {
  console.log('Server running on http://localhost:4002');
});
