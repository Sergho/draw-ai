import { Canvas } from '../canvas/canvas.model.js';
import { datasetItemSize } from '../dataset/dataset.constants.js';
import { aiConfig } from './ai.constants.js';
import { AIModel } from './ai.model.js';

describe('AI model', () => {
    let model: AIModel;

    beforeEach(async () => {
        model = new AIModel();
        await model.start();
    });
    afterEach(async () => {
        await model.rollback();
    });

    it('should return shaped prediction', async () => {
        const { layers } = aiConfig;

        const targetLength = layers[layers.length - 1].size;

        const canvas = new Canvas(datasetItemSize);
        canvas.random();

        const prediction = await model.predict(canvas);
        expect(prediction.length).toEqual(targetLength);
    });
    it('should return normalized prediction', async () => {
        const canvas = new Canvas(datasetItemSize);
        canvas.random();

        const prediction = await model.predict(canvas);
        for (const elem of prediction) {
            expect(elem).toBeLessThan(1);
            expect(elem).toBeGreaterThan(0);
        }
    });
});
