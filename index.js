import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { generateQRCode } from "./utils/qrGenerator.js";
import qrRoutes from "./routes/qrRoutes.js";
import path,{dirname} from "path";
import { fileURLToPath } from 'url';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use('/assets', express.static(path.join(__dirname, 'assets')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// API to generate QR code
app.get("/generate-qr", async (req, res) => {
    try {
        const qrCode = await generateQRCode(`${process.env.BACKEND_URL}/api/scan`);
        res.send(`<img src="${qrCode}" alt="QR Code"/>`);
    } catch (error) {
        console.error("QR Code generation failed:", error);
        res.status(500).send("Error generating QR Code");
    }
});

// Routes
app.use("/api", qrRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
