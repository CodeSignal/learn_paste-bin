import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';
import { User } from './models/User.js';
import { sequelize } from './models/index.js';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());

// Serve static files from the dist/client directory
app.use(express.static(join(__dirname, '../../dist/client')));

const PORT = process.env.PORT || 3001;

// Initialize database
sequelize.sync({ alter: true }).then(async () => {
  try {
    console.log("Database synchronized with alter: true.");
    // Create default user
    const hashedPassword = await bcrypt.hash('admin', 10);
    await User.findOrCreate({
      where: { username: 'admin' },
      defaults: { password: hashedPassword }
    });
  } catch (error) {
    console.error("Error initializing database:", error);
  }
});

// Use routes
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});