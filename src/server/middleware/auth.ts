import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../../config';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
      }
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as { userId: number };
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};