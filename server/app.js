// Imports
import OpenAI from "openai";
import express from "express";
import multer from "multer";
import mysql from "mysql2/promise";
import { body, validationResult } from "express-validator";
import dotenv from "dotenv";
import cors from "cors";

// Path Finding
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDirectory = path.join(__dirname, "public");

dotenv.config({ path: path.join(__dirname, ".env") });

// Defaults for script
const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ dest: "uploads/" });

app.use(cors());

// Stylesheet
app.use(express.static(publicDirectory));

// Webpage
app.get("/", (request, response) => {
    response.sendFile(path.join(publicDirectory, "main.html"));
});

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

let connection = null;

export async function query(sql, params = []) {
    if (connection === null) {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
    }

    const [results] = await connection.execute(sql, params);
    return results;
}

const validateForm = [
    body("bpm")
        .notEmpty()
        .isInt({ min: 40, max: 300 })
        .withMessage("BPM must be between 40 and 300!"),

    body("style")
        .notEmpty().withMessage("Please select a style.")
        .isIn(["Pop", "Rock", "Jazz", "Blues", "Ballad"])
        .withMessage("Invalid style selected."),

    body("scale")
        .notEmpty().withMessage("Please select a scale.")
        .isIn([
            "Major",
            "Natural Minor",
            "Harmonic Minor",
            "Melodic Minor",
            "Whole Tone",
            "Chromatic",
            "Diminished"
        ])
        .withMessage("Invalid scale selected."),

    body("time")
        .notEmpty().withMessage("Please select a time signature.")
        .isIn(["4/4", "3/4", "2/4", "6/8"])
        .withMessage("Invalid time signature selected.")
];

app.get("/chord_gen/", async (request, response) => {
    try {
        let selectSql = `
            SELECT
                chords,
                bpm,
                scale,
                style,
                time_signature,
                created_at
            FROM chord_gen
        `;

        const whereStatements = [];
        const queryParameters = [];

        if (request.query.bpm) {
            whereStatements.push("bpm = ?");
            queryParameters.push(request.query.bpm);
        }

        if (request.query.scale) {
            whereStatements.push("scale = ?");
            queryParameters.push(request.query.scale);
        }

        if (request.query.style) {
            whereStatements.push("style = ?");
            queryParameters.push(request.query.style);
        }

        if (request.query.time_signature) {
            whereStatements.push("time_signature = ?");
            queryParameters.push(request.query.time_signature);
        }

        if (whereStatements.length > 0) {
            selectSql += " WHERE " + whereStatements.join(" AND ");
        }

        const allowedSortColumns = [
            "bpm",
            "scale",
            "style",
            "time_signature",
            "created_at"
        ];

        const allowedSortOrders = ["ASC", "DESC"];

        if (allowedSortColumns.includes(request.query.sort_by)) {
            const sortOrder = allowedSortOrders.includes(request.query.sort_order)
                ? request.query.sort_order
                : "ASC";

            selectSql += ` ORDER BY ${request.query.sort_by} ${sortOrder}`;
        }

        let limit = parseInt(request.query.limit);

        if (isNaN(limit) || limit < 1 || limit > 10) {
            limit = 10;
        }

        if (!Number.isInteger(limit) || limit < 1 || limit > 10) {
            limit = 10;
        }

        selectSql += ` LIMIT ${limit}`;

        const result = await query(selectSql, queryParameters);

        response.json({ data: result });

    } catch (error) {
        console.log(error);
        response.status(500).json({
            message: "Something went wrong with the server."
        });
    }
});

app.post(
    "/",
    upload.none(),
    validateForm,
    async (request, response) => {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.status(400).json({
                errors: errors.array()
            });
        }

        const style = request.body.style;
        const scale = request.body.scale;
        const time = request.body.time;
        const bpm = request.body.bpm;

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
            progression = JSON.parse(chatGPTResponse.output_text);
        } catch (error) {
            console.error("Failed to parse JSON:", error);
            progression = [];
        }

        try {
            await query(
                `
                INSERT INTO chord_gen
                    (chords, style, scale, time_signature, bpm)
                VALUES
                    (?, ?, ?, ?, ?)
                `,
                [
                    JSON.stringify(progression),
                    style,
                    scale,
                    time,
                    bpm
                ]
            );
        } catch (dbError) {
            console.error("Database insert error:", dbError);
        }

        response.status(200).json({ progression });
    }
);

app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
});
