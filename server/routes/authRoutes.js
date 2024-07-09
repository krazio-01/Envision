import { Router } from "express";
import {
    signUp,
    login,
    forgotPasswordRequest,
    forgotPasswordChange,
    verifyEmail,
    logout,
} from "../controllers/authControllers.js";

const router = Router();

// Register endpoint
router.post("/signup", signUp);

// Login endpoint
router.post("/signin", login);

// Forgot Password endpoint
router.post("/forgot-password/request", forgotPasswordRequest);

// Forgot Password endpoint
router.post("/forgot-password/change", forgotPasswordChange);

// Verify Email endpoint
router.post("/verifyEmail", verifyEmail);

// Logout endpoint
router.post("/logout", logout);

export default router;
