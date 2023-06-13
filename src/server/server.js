require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const app = express();

app.use(express.json()); // for parsing application/json
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.post("/api/chat", async (req, res) => {
  const messages = req.body.messages;
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.7,
      },
      { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
    );

    // Log the response data from OpenAI API
    console.log("OpenAI API Response Data:", response.data);

    // Assuming the response.data is always an object
    if (typeof response.data !== "object") {
      throw new Error("Invalid data received from OpenAI API");
    }

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error:
        "An error occurred while trying to get chat completion from OpenAI API.",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
