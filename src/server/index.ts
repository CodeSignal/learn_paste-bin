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
const JWT_SECRET = 'your-secret-key';

// Initialize database
// Instead of sequelize.sync()
sequelize.sync({ alter: true }).then(async () => {
  try {
    console.log("Database synchronized with alter: true.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
});


// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, password, role } = req.body;
  // Ensure role is either 'admin' or 'user'; default to 'user'
  const userRole = role === 'admin' ? 'admin' : 'user';
  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      role: userRole
    });
    res.json({ message: "User registered successfully", userId: user.id });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
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
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Missing authorization header" });
  }
  const token = authHeader.split(' ')[1];
  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
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
      userId, // now using the userId from the token
    });
    res.json(snippet);
  } catch (error) {
    console.error("Error saving snippet:", error);
    res.status(500).json({ error: "Failed to save snippet" });
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

app.get('/api/snippets', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Missing authorization header" });
  }
  const token = authHeader.split(' ')[1];
  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
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

// Admin-only test endpoint
app.get('/api/admin/test', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Missing authorization header" });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }
    res.json({ message: "Admin test endpoint accessed successfully" });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

// Catch-all route to serve index.html for client-side routing
app.get('*', (_, res) => {
  res.sendFile(join(__dirname, '../../dist/client/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
