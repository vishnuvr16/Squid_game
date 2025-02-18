import express from "express";
import crypto from "crypto";
import Key from "../models/Key.js"; 

const router = express.Router();

router.get("/scan", async (req, res) => {
    try {
        // Step 1: Extract device-specific details
        const userAgent = req.headers["user-agent"] || "unknown";
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

        // Step 2: Generate a unique ID by hashing IP + User-Agent
        const deviceId = crypto.createHash("sha256").update(ip + userAgent).digest("hex");

        // Step 3: Check if the device already has an assigned unique number
        let key = await Key.findOne({ deviceId });

        if (!key) {
            // Step 4: Generate a new unique number
            const lastEntry = await Key.findOne().sort({ uniqueNumber: -1 });
            const nextNumber = lastEntry ? lastEntry.uniqueNumber + 1 : 1;

            // Step 5: Store the new unique number for this device
            key = new Key({ deviceId, uniqueNumber: nextNumber });
            await key.save();
        }

        res.json({ message: "Thank you registering! Welcome to Squid Game 2.0 , PLAYER NO: ", uniqueNumber: key.uniqueNumber });
    } catch (error) {
        console.error("Error generating QR code response:", error);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
