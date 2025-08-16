import { Router } from 'express';
import { aiController } from '../controllers/ai.controller.js';

export const aiRouter = Router();

aiRouter.put('/', aiController.update);
aiRouter.get('/status', aiController.status);
aiRouter.get('/', aiController.predict);
