import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';

console.log("JWT_SECRET in auth middleware:", process.env.JWT_SECRET);

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token found' });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed'});
  }
};