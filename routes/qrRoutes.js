import express from "express";
import crypto from "crypto";
import Key from "../models/Key.js"; 

const router = express.Router();

router.get("/scan", async (req, res) => {
    try {
        // Extract device details
        const userAgent = req.headers["user-agent"] || "unknown";
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

        // Generate a unique device ID
        const deviceId = crypto.createHash("sha256").update(ip + userAgent).digest("hex");

        // Check if the device already has an assigned unique number
        let key = await Key.findOne({ deviceId });

        if (!key) {
            // Generate a new unique number
            const lastEntry = await Key.findOne().sort({ uniqueNumber: -1 });
            const nextNumber = lastEntry ? lastEntry.uniqueNumber + 1 : 1;

            // Store the new unique number for this device
            key = new Key({ deviceId, uniqueNumber: nextNumber });
            await key.save();
        }

        // Send a beautifully styled HTML response
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Squid Game Entry</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        text-align: center;
                        background-color: #000;
                        color: #fff;
                        height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                    }
                    .container {
                        padding: 20px;
                        border: 2px solid red;
                        border-radius: 10px;
                        box-shadow: 0px 0px 10px red;
                    }
                    h1 {
                        color: red;
                        font-size: 2em;
                    }
                    p {
                        font-size: 1.2em;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Welcome to Squid Game 2.0</h1>
                    <p>Thank you for registering!</p>
                    <p><strong>PLAYER NO: ${key.uniqueNumber}</strong></p>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error("Error generating QR code response:", error);
        res.status(500).send("<h1>Server Error. Please try again.</h1>");
    }
});

export default router;
