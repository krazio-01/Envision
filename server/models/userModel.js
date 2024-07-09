import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
        },
        email: {
            type: String,
            required: [true, "Please provide a email"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
        },
        isVerfied: {
            type: Boolean,
            default: false,
        },
        avatar: {
            type: String,
            required: [true, "Please provide an avatar"],
        },
        forgotPasswordToken: String,
        forgotPasswordTokenExpiry: Date,
        verifyToken: String,
        verifyTokenExpiry: Date,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", userSchema);
