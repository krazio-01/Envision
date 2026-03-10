import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        bookmarks: [
            {
                mediaId: { type: String, required: true },
                mediaType: { type: String, enum: ['movie', 'tv'], required: true },
                addedAt: { type: Date, default: Date.now },
            },
        ],
        completed: [
            {
                mediaId: { type: String, required: true },
                mediaType: { type: String, enum: ['movie', 'tv'], required: true },
                addedAt: { type: Date, default: Date.now },
            },
        ],
        dropped: [
            {
                mediaId: { type: String, required: true },
                mediaType: { type: String, enum: ['movie', 'tv'], required: true },
                addedAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true },
);

export default mongoose.model('UserActivity', userActivitySchema);
