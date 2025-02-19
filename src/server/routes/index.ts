import express from 'express';
import authRoutes from './auth';
import snippetRoutes from './snippets';
import adminRoutes from './admin';
import staticRoutes from './static';

const router = express.Router();

router.use('/api', express.json());
router.use('/api/auth', authRoutes);
router.use('/api/snippets', snippetRoutes);
router.use('/api/admin', adminRoutes);
router.use('/', staticRoutes);

export default router;
