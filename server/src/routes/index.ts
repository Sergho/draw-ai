import { Router } from 'express';
import { datasetRouter } from './dataset.route.js';
import { aiRouter } from './ai.route.js';

export const router = Router();

router.use('/dataset', datasetRouter);
router.use('/ai', aiRouter);
