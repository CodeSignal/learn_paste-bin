import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Snippet } from './models/Snippet.js';
import { User } from './models/User.js';
import { sequelize } from './models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the dist/client directory
app.use(express.static(join(__dirname, '../../dist/client')));

const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'your-secret-key'; // remains hard-coded

// Initialize database
sequelize.sync().then(async () => {
  try {
    // Create default user if it doesn't exist
    const hashedPassword = await bcrypt.hash('admin', 10);
    await User.findOrCreate({
      where: { username: 'admin' },
      defaults: { password: hashedPassword }
    });
    console.log("Database initialized with default user.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
  
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return res.json({ token });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save snippet endpoint
app.post('/api/snippets', async (req, res) => {
  try {
    const { title, content, language } = req.body;
    // Always generate a new unique id using uuidv4()
    const snippet = await Snippet.create({
      id: uuidv4(),
      title,
      content,
      language,
      userId: 1
    });
    res.json(snippet);
  } catch (error) {
    console.error("Error saving snippet:", error);
    res.status(500).json({ error: "Failed to save snippet" });
  }
});

// List all snippets for userId 1
app.get('/api/snippets', async (req, res) => {
  try {
    const snippets = await Snippet.findAll({ where: { userId: 1 } });
    res.json(snippets);
  } catch (error) {
    console.error("Error retrieving snippets:", error);
    res.status(500).json({ error: "Failed to retrieve snippets" });
  }
});


// Get snippet endpoint
app.get('/api/snippets/:id', async (req, res) => {
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

// Delete snippet endpoint
app.delete('/api/snippets/:id', async (req, res) => {
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


// Catch-all route to serve index.html for client-side routing
app.get('*', (_, res) => {
  res.sendFile(join(__dirname, '../../dist/client/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
