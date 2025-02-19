import express from 'express';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Catch-all route to serve index.html for client-side routing
router.get('*', (_, res) => {
  res.sendFile(join(__dirname, '../../../dist/client/index.html'));
});

export default router;