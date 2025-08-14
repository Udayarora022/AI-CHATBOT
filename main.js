const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // parses JSON body

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

// Function to get Gemini's response
const generate = async (question) => {
  try {
    const result = await geminiModel.generateContent(question);
    return result.response.text();
  } catch (error) {
    console.error("response error", error);
    return "Error generating content";
  }
};

// POST route to handle question from request body
app.post("/api/content", async (req, res) => {
  const question = req.body.question;
  if (!question) {
    return res.status(400).json({ error: "Please provide a question in the body" });
  }
  const result = await generate(question);
  res.json({ result });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});


