"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.signUp = void 0;
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';
console.log("JWT_SECRET in auth controller:", process.env.JWT_SECRET);
const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User_1.User.findOne({ email });
        if (userExists)
            return res.status(400).json({ message: 'User already exists' });
        const user = await User_1.User.create({ name, email, password });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
        // Set HTTP-Only Cookie
        res.cookie('access_token', token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production', // Must be true if sameSite is 'none'
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.signUp = signUp;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email });
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
        // Set HTTP-Only Cookie
        res.cookie('access_token', token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production', // Must be true if sameSite is 'none'
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email } });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
const logout = (req, res) => {
    res.clearCookie('access_token');
    res.status(200).json({ message: 'Logged out successfully' });
};
exports.logout = logout;
