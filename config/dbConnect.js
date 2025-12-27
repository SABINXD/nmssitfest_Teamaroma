
import mongoose from "mongoose";

const MONGODB_URI = "mongodb://127.0.0.1:27017/blood_donor";

let isConnected = false; // track connection state

export async function connectDB() {
    if (isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(MONGODB_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
    }
}
