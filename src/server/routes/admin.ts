import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { JWT_SECRET_KEY } from '../../config';
import { Role } from '../../types';

const router = express.Router();

// Admin-only test endpoint
router.get('/test', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Missing authorization header" });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET_KEY);
    const user = await User.findByPk(decoded.userId);
    if (!user || user.role !== Role.ADMIN.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }
    res.json({ message: "Admin test endpoint accessed successfully" });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;