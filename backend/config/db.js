import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        mongoose.connection.on('connected', () => {
            console.log("Database Connected");
        });

        mongoose.connection.on('error', (err) => {
            console.error("Database connection error:", err);
        });

        const db = await mongoose.connect(`${process.env.MONGO_URL}`);
        isConnected = db.connections[0].readyState === 1;
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
};

export default connectDB;