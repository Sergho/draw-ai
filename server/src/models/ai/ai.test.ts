import { Canvas } from '../canvas/canvas.model.js';
import { datasetItemSize } from '../dataset/dataset.constants.js';
import { DatasetItem } from '../dataset/dataset.types.js';
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

    it('should return shaped prediction', () => {
        const { layers } = aiConfig;

        const targetLength = layers[layers.length - 1].size;

        const canvas = new Canvas(datasetItemSize);
        canvas.random();

        const prediction = model.predict(canvas);
        expect(prediction.length).toEqual(targetLength);
    });
    it('should return normalized prediction', () => {
        const canvas = new Canvas(datasetItemSize);
        canvas.random();

        const prediction = model.predict(canvas);
        for (const elem of prediction) {
            expect(elem).toBeLessThan(1);
            expect(elem).toBeGreaterThan(0);
        }
    });
    it('should return determined prediction', () => {
        const canvas = new Canvas(datasetItemSize);
        canvas.random();

        const firstPrediction = model.predict(canvas);
        const secondPrediction = model.predict(canvas);

        expect(firstPrediction).toEqual(secondPrediction);
    });
    it('should change params on learning', () => {
        const inputCanvas = new Canvas(datasetItemSize);
        const batch: DatasetItem[] = [];
        for (let i = 0; i < 3; i++) {
            const canvas = new Canvas(datasetItemSize);
            canvas.random();
            batch.push({ id: `${i}`, canvas, value: i + 1 });
        }

        inputCanvas.random();

        const firstPrediction = model.predict(inputCanvas);
        model.learn(batch);
        const secondPrediction = model.predict(inputCanvas);

        expect(firstPrediction).not.toEqual(secondPrediction);
    });
});
