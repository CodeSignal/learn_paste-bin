 import express from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Snippet } from '../models/Snippet';
import { JWT_SECRET_KEY } from '../../config';

const router = express.Router();

// Save snippet endpoint
router.post('/', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Missing authorization header" });
  }
  const token = authHeader.split(' ')[1];
  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET_KEY);
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
  const userId = decoded.userId;
  try {
    const { title, content, language } = req.body;
    const snippet = await Snippet.create({
      id: uuidv4(),
      title,
      content,
      language,
      userId,
    });
    res.json(snippet);
  } catch (error) {
    console.error("Error saving snippet:", error);
    res.status(500).json({ error: "Failed to save snippet" });
  }
});

// Get snippet endpoint
router.get('/:id', async (req, res) => {
  try {
    const snippet = await Snippet.findByPk(req.params.id);
    if (!snippet) {
      return res.status(404).json({ error: "Snippet not found" });
    }
    res.json(snippet);
  } catch (error) {
    console.error("Error retrieving snippet:", error);
    res.status(500).json({ error: "Failed to retrieve snippet" });
  }
});

router.get('/', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Missing authorization header" });
  }
  const token = authHeader.split(' ')[1];
  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET_KEY);
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
  const userId = decoded.userId;
  try {
    const snippets = await Snippet.findAll({ where: { userId } });
    res.json(snippets);
  } catch (error) {
    console.error("Error retrieving snippets:", error);
    res.status(500).json({ error: "Failed to retrieve snippets" });
  }
});

// Delete snippet endpoint
router.delete('/:id', async (req, res) => {
  try {
    const snippet = await Snippet.findByPk(req.params.id);
    if (!snippet) {
      return res.status(404).json({ error: "Snippet not found" });
    }
    await snippet.destroy();
    res.json({ message: "Snippet deleted successfully" });
  } catch (error) {
    console.error("Error deleting snippet:", error);
    res.status(500).json({ error: "Failed to delete snippet" });
  }
});

export default router;
