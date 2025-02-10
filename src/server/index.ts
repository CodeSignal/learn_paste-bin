import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Snippet } from './models/Snippet.js';
import { User } from './models/User.js';
import { sequelize } from './models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
const JWT_SECRET = 'your-secret-key';

// Initialize database
sequelize.sync().then(async () => {
  // Create default user
  const hashedPassword = await bcrypt.hash('admin', 10);
  await User.findOrCreate({
    where: { username: 'admin' },
    defaults: { password: hashedPassword }
  });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Save snippet
app.post('/api/snippets', async (req, res) => {
  const { title, content, language, id } = req.body;
  const snippet = await Snippet.create({
    id: id || Math.random().toString(36).substr(2, 9),
    title,
    content,
    language,
    userId: 1
  });
  res.json(snippet);
});

// Get snippet
app.get('/api/snippets/:id', async (req, res) => {
  const snippet = await Snippet.findByPk(req.params.id);
  res.json(snippet);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
