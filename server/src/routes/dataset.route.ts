import { Router } from 'express';
import { datasetController } from '../controllers/dataset.controller.js';

export const datasetRouter = Router();

datasetRouter.post('/', datasetController.create);
datasetRouter.get('/size', datasetController.getSize);
datasetRouter.get('/', datasetController.getAll);
datasetRouter.patch('/', datasetController.update);
datasetRouter.delete('/', datasetController.delete);
