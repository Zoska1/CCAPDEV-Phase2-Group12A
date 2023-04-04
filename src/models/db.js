import mongoose from "mongoose";

const url = process.env.MONGODB_URI ?? "";

export function connect() {
    return mongoose.connect(url);
};