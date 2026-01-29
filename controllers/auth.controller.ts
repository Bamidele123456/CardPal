import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';
console.log("JWT_SECRET in auth controller:", process.env.JWT_SECRET);

export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    // Set HTTP-Only Cookie
    res.cookie('access_token', token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
    secure: process.env.NODE_ENV === 'production', // Must be true if sameSite is 'none'
    maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    // Set HTTP-Only Cookie
    res.cookie('access_token', token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
    secure: process.env.NODE_ENV === 'production', // Must be true if sameSite is 'none'
    maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('access_token');
  res.status(200).json({ message: 'Logged out successfully' });
};