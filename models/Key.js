import mongoose from "mongoose";

const KeySchema = new mongoose.Schema({
    deviceId: { type: String, unique: true, required: true },
    uniqueNumber: { type: Number, unique: true, required: true }
});

export default mongoose.model("Key", KeySchema);
