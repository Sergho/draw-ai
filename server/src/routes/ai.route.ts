import { Router } from 'express';
import { aiController } from '../controllers/ai.controller.js';

export const aiRouter = Router();

aiRouter.put('/', aiController.learn);
aiRouter.get('/', aiController.predict);
