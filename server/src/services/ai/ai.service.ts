import { AIModel } from '../../models/ai/ai.model.js';
import { Canvas } from '../../models/canvas/canvas.model.js';
import { datasetItemSize } from '../../models/dataset/dataset.constants.js';
import { DatasetModel } from '../../models/dataset/dataset.model.js';
import { DatasetItem } from '../../models/dataset/dataset.types.js';
import { batchSize } from './ai.contants.js';
import { AIServicePredictDto } from './ai.types.js';

export class AIService {
    async learn(): Promise<void> {
        const datasetModel = new DatasetModel();
        const aiModel = new AIModel();
        const dataset = await datasetModel.getAllItems();
        dataset.sort(() => Math.random() - 0.5);
        const batches: DatasetItem[][] = [];

        for (let i = 0; i < dataset.length; i += batchSize) {
            batches.push(dataset.slice(i, i + batchSize));
        }

        try {
            await aiModel.start();

            for (const batch of batches) {
                aiModel.learn(batch);
            }

            await aiModel.commit();
        } catch (err) {
            aiModel.rollback();
            throw err;
        }
    }
    async predict(dto: AIServicePredictDto): Promise<number[]> {
        const aiModel = new AIModel();
        const { pixels } = dto;
        const canvas = new Canvas(datasetItemSize);
        canvas.fillWithPixels(pixels);

        return aiModel.predict(canvas);
    }
}
