import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import sendEmail from '../utils/sendMail.js';
import jwt from 'jsonwebtoken';

const EMAIL_VERIFICATION_TTL = 24 * 60 * 60 * 1000; // 24H
const PASSWORD_RESET_TTL = 15 * 60 * 1000; // 15 minutes

const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // validations
        if (!name || !email || !password) return res.status(400).json({ message: 'Please fill all fields' });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email format' });

        const passwordRegex = /^(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!passwordRegex.test(password))
            return res.status(400).json({
                message: 'Password must be at least 8 characters long and include at least one special character',
            });

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'This account is already registered' });

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // generate unique verifyation token
        const hashedToken = uuidv4();

        // Create new user
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            avatar: '../images/useravatar.webp',
            verifyToken: hashedToken,
            verifyTokenExpiry: Date.now() + EMAIL_VERIFICATION_TTL,
        });

        const user = await newUser.save();

        // Send verification email
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        await sendEmail(user.email, 'Account Verification', 'verify-email.html', {
            name: user.name || 'User',
            verifyLink: `${frontendUrl}/verify-email?token=${hashedToken}`,
        });

        res.status(201).json({
            message: 'Registration successful',
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validations
        if (!email || !password) return res.status(400).json({ message: 'Please fill all fields' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Invalid credentials' });

        if (!user.isVerfied) {
            if (user.verifyTokenExpiry && user.verifyTokenExpiry < Date.now()) {
                const newHashedToken = uuidv4();
                user.verifyToken = newHashedToken;
                user.verifyTokenExpiry = Date.now() + EMAIL_VERIFICATION_TTL;
                await user.save({ validateBeforeSave: false });

                const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
                await sendEmail(user.email, 'Account Verification', 'verify-email.html', {
                    name: user.name || 'User',
                    verifyLink: `${frontendUrl}/verify-email?token=${newHashedToken}`,
                });

                return res.status(401).json({
                    message: 'Account not verified. A fresh activation link has been sent to your inbox!',
                });
            }
            return res.status(401).json({ message: 'Please verify your email first. Check your inbox.' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Generate JWT token
        const tokenPayload = {
            userId: user._id,
            username: user.username,
            email: user.email,
        };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        // Set the cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const forgotPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).json({ message: 'Email is required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const resetToken = uuidv4();

        user.forgotPasswordToken = resetToken;
        user.forgotPasswordTokenExpiry = Date.now() + PASSWORD_RESET_TTL;

        await user.save({ validateBeforeSave: false });

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const to = user?.email;
        await sendEmail(to, 'Password change request for Envision', 'reset-password.html', {
            resetLink: `${frontendUrl}/forgot-password/change?token=${resetToken}`,
        });

        res.status(200).json({
            message: `An email has been sent to ${to} with further instructions.`,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const forgotPasswordChange = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({
            forgotPasswordToken: token,
            forgotPasswordTokenExpiry: { $gt: Date.now() },
        });

        if (!user) return res.json();

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        user.password = hashedPassword;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;

        await user.save();

        return res.status(200).json({ message: 'Password reset scucessfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() },
        });

        if (!user) return res.status(404).json({ message: 'Invalid Link' });

        user.isVerfied = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const logout = async (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(0),
        });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export { signUp, login, forgotPasswordRequest, forgotPasswordChange, verifyEmail, logout };
