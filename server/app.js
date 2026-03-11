//Code libraries needed for this script to work
// In order to install, use the following command on
// the cmd terminal: npm install {library} 
// {library} is the word after "from" in no quotes
// e.g., from "openai" = npm install openai
import OpenAI from "openai";
import express from 'express';
import multer from 'multer';

// ~!~!~!~ DO NOT TOUCH ~!~!~!~
// Default settings for the script; 
const app = express();
const hostname = '127.0.0.1';
const port = 3000;
const upload = multer({ dest: 'uploads/' })
app.listen(port, hostname, () => {

    console.log(`Server running at http://${hostname}:${port}/`);
});

const client = new OpenAI({
    apiKey: "nice-try" //secret key from ChatGPT goes here in quotes
});

app.post(
    '/',
    upload.none(),
    async (request, response) => {
        const style = request.body["Style-Select"];
        const scale = request.body["scale-button"];
        const time = request.body["time-button"];
        const bpm = request.body["bpm-control"];

        const aiPrompt = `
Generate a chord progression for a ${style} song.
It should be in the ${scale} scale, at ${bpm} BPM, and in ${time} time signature.
Return ONLY as JSON in this format:

[
  { "chord": "Cmaj7", "duration": "4n" },
  { "chord": "Am", "duration": "4n" }
]

Do not include any text outside the JSON array.
`;

        const chatGPTResponse = await client.responses.create({
            model: "gpt-5",
            input: aiPrompt
        });

        let progression;
        try {
            progression = JSON.parse(chatGPTResponse.output_text); // parse JSON from GPT
        } catch (err) {
            console.error("Failed to parse JSON:", err);
            progression = [];
        }

        // Send the parsed array to the frontend
        response.status(200)
            .setHeader('Access-Control-Allow-Origin', '*')
            .setHeader('Content-Type', 'application/json')
            .json({ progression });
    }
);
