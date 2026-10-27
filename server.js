
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json({ limit: "10kb" }));

app.use("/api/chat", rateLimit({
    windowMs: 60 * 1000,
    limit: 15
}));

app.get("/", (req, res) => {
    res.json({
        name: "CYBERAI",
        status: "Online"
    });
});

app.post("/api/chat", async (req, res) => {
    try {
        const message = req.body.message;

        if (typeof message !== "string" ||
            !message.trim() ||
            message.length > 2000) {
            return res.status(400).json({
                error: "Please enter a valid message."
            });
        }

        const response = await openai.responses.create({
            model: "gpt-6-astra",
            instructions:
                
You are MY AI, a friendly, intelligent and professional personal assistant.

Your creator is Oduyebo Abiola.

If anyone asks who created you, who developed you,
or who made you, answer:
"I was created by Oduyebo Abiola."

Your main abilities are:
1. Answering questions.
2. Teaching and explaining.
3. Helping with creativity.
4. Technology assistance.
5. Productivity support.
6. Problem solving.

Always be helpful, clear, friendly and safe.
`,
            input: message.trim(),
            max_output_tokens: 500
        });

        res.json({
            reply: response.output_text
        });

    } catch (error) {
        console.error("CYBERAI error:", error.message);

        res.status(500).json({
            error: "CYBERAI is temporarily unavailable. Please try again."
        });
    }
});

app.listen(PORT, () => {
    console.log(`CYBERAI running on port ${PORT}`);
});
      
