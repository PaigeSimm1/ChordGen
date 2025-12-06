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
    apiKey: "top-secret"
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
Generate a random chord progression for a ${style} song.

Choose a RANDOM root note from:
C, C#, D, Eb, E, F, F#, G, Ab, A, Bb, or B.

Use that root to build a ${scale} scale
(Example: If the root is F and scale = Major → F major scale).

The progression must be at ${bpm} BPM and in ${time} time signature.

Follow these harmonic rules:

1. Generate ONLY 4 chords.
2. Use ONLY diatonic chords from the chosen scale.
3. AVOID diminished chords (replace them with another diatonic chord).
4. ALWAYS end the progression on the tonic chord (I or i).
5. Match the style genre (${style}) more closely:
   - Pop/Rock: use mostly triads, 6/9, add9, maj7, m7. Avoid overly jazzy chords. Should be simple.
   - Jazz: use 7th, maj7, m7, m9, 9, 11, 13 chords.
   - Blues: dominant 7th chords are OK if scale allows.
   - Ballad: softer chords like maj7, m7, add9.
6. Prefer extended chords (maj7, m7, 9, 11, 6) when appropriate for the style.
7. Keep the voicing simple enough for Midi playback.

Return ONLY as JSON in this format:

[
  { "chord": "Cmaj7", "duration": "4n" },
  { "chord": "Am", "duration": "4n" }
]

Do NOT include any text outside the JSON array.
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
