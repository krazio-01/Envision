import mongoose from "mongoose";

// Define Bookmark schema
const bookmarkSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        mediaId: {
            type: String,
            required: true,
        },
        mediaType: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

// Create and export Bookmark model
export default mongoose.model("Bookmark", bookmarkSchema);
