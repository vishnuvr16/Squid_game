import express from "express";
import crypto from "crypto";
import Key from "../models/Key.js";
import path from "path";

const router = express.Router();

router.get("/scan", async (req, res) => {
    try {
        const userAgent = req.headers["user-agent"] || "unknown";
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const deviceId = crypto.createHash("sha256").update(ip + userAgent).digest("hex");
        let key = await Key.findOne({ deviceId });

        if (!key) {
            const lastEntry = await Key.findOne().sort({ uniqueNumber: -1 });
            const nextNumber = lastEntry ? lastEntry.uniqueNumber + 1 : 1;
            key = new Key({ deviceId, uniqueNumber: nextNumber });
            await key.save();
        }

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Squid Game Registration</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@300;500;700&family=Bebas+Neue&family=Montserrat:wght@300;400;700&display=swap');
                    
                    :root {
                        --primary-color: #ff0055;
                        --bg-color: #1a1a1a;
                        --text-color: #ffffff;
                        --card-bg: rgba(26, 26, 26, 0.95);
                    }

                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    body {
                        font-family: 'Montserrat', sans-serif;
                        background-color: var(--bg-color);
                        color: var(--text-color);
                        min-height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        position: relative;
                        overflow: hidden;
                    }

                    .background {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: var(--card-bg);
                        filter: blur(8px);
                        z-index: 1;
                    }

                    .container {
                        position: relative;
                        z-index: 2;
                        padding: 3rem;
                        border-radius: 20px;
                        box-shadow: 0 8px 32px rgba(255, 0, 85, 0.2);
                        width: 90%;
                        max-width: 500px;
                        transition: transform 0.3s ease;
                        overflow: hidden;
                    }

                    .container::before {
                        content: "";
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: url('../assets/squid_game.jpeg') no-repeat center center;
                        background-size: cover;
                        opacity: 0.2;
                        z-index: -1;
                    }

                    .container:hover {
                        transform: translateY(-5px);
                    }

                    h1 {
                        font-family: 'Bebas Neue', cursive;
                        font-size: 3.5rem;
                        letter-spacing: 2px;
                        margin-bottom: 2rem;
                        background: linear-gradient(45deg, var(--primary-color), #ff6b6b);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        text-align: center;
                    }

                    .status {
                        font-family: 'Rajdhani', sans-serif;
                        text-align: center;
                        font-size: 1.4rem;
                        font-weight: 500;
                        margin-bottom: 1rem;
                        opacity: 0;
                        animation: fadeIn 1s forwards;
                        letter-spacing: 1px;
                    }

                    .player-label {
                        font-family: 'Montserrat', sans-serif;
                        text-transform: uppercase;
                        font-size: 1rem;
                        letter-spacing: 3px;
                        font-weight: 300;
                        color: white;
                        text-align: center;
                        margin-bottom: 0.5rem;
                    }

                    .player-number {
                        font-family: 'Orbitron', sans-serif;
                        text-align: center;
                        font-size: 3.5rem;
                        font-weight: 700;
                        color: var(--primary-color);
                        margin: 1.5rem 0;
                        position: relative;
                        text-shadow: 0 0 20px rgba(255, 0, 85, 0.5);
                        opacity: 0;
                        animation: numberReveal 1.5s forwards;
                        letter-spacing: 4px;
                    }

                    .message {
                        font-family: 'Rajdhani', sans-serif;
                        text-align: center;
                        font-size: 1.4rem;
                        font-weight: 300;
                        margin-top: 2rem;
                        color: #a0a0a0;
                        opacity: 0;
                        animation: fadeIn 2s 1s forwards;
                        letter-spacing: 2px;
                    }

                    .decoration {
                        position: absolute;
                        width: 150px;
                        height: 150px;
                        border: 2px solid var(--primary-color);
                        border-radius: 50%;
                        opacity: 0.1;
                    }

                    .decoration-1 {
                        top: -75px;
                        left: -75px;
                    }

                    .decoration-2 {
                        bottom: -75px;
                        right: -75px;
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    @keyframes numberReveal {
                        0% { opacity: 0; transform: scale(0.5); }
                        50% { opacity: 0.5; transform: scale(1.1); }
                        100% { opacity: 1; transform: scale(1); }
                    }

                    @media (max-width: 600px) {
                        .container {
                            padding: 2rem;
                        }

                        h1 {
                            font-size: 2.5rem;
                        }

                        .player-number {
                            font-size: 3.5rem;
                        }

                        .status {
                            font-size: 1.2rem;
                        }

                        .message {
                            font-size: 1.2rem;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="background"></div>
                <div class="container">
                    <div class="decoration decoration-1"></div>
                    <div class="decoration decoration-2"></div>
                    <h1>Squid Game Registration</h1>
                    <div class="status">Registration Complete</div>
                    <div class="player-label">Player Number</div>
                    <div class="player-number">
                        #${key.uniqueNumber.toString().padStart(3, '0')}
                    </div>
                    <div class="message">Your fate awaits...</div>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error("Error generating response:", error);
        res.status(500).send("<h1>Server Error. Please try again.</h1>");
    }
});

export default router;