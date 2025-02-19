import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { JWT_SECRET_KEY } from '../../config';
import { Role } from '../../types';
import db from '../../database';

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

router.get('/testOpen', async (req, res) => {
  res.json({ message: "Test endpoint is working!" });
});

// Secure account info endpoint
router.get('/accountInfo', (req, res) => {
  const userId = req.query.id;
  if (!userId) {
    return res.status(400).json({ error: "Missing user ID parameter" });
  }

  try {
    const query = `SELECT * FROM users WHERE id = ?`;
    // Prepare and execute the query synchronously
    const stmt = db.prepare(query);
    const results = stmt.all(userId);
    res.json(results);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



export default router;