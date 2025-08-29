import { TransactionalModel } from '../../utils/transactional-model.js';
import { Canvas } from '../canvas/canvas.model.js';
import { datasetItemSize } from '../dataset/dataset.constants.js';
import { DatasetItem } from '../dataset/dataset.types.js';
import { Matrix } from '../matrix/matrix.model.js';
import { aiConfig } from './ai.constants.js';

export class AIModel implements TransactionalModel {
    private weights: Matrix[];
    constructor() {
        const { layers } = aiConfig;

        let lastSize = datasetItemSize.width * datasetItemSize.height;
        for (let i = 0; i < layers.length; i++) {
            const size = layers[i].size;
            const matrix = new Matrix({ rows: lastSize, cols: size });
            matrix.random();
            this.weights.push(matrix);
            lastSize = layers[i].size;
        }
    }
    async learn(sample: DatasetItem): Promise<void> {}
    async predict(canvas: Canvas): Promise<number> {}
    async clear(): Promise<void> {
        for (const matrix of this.weights) {
            matrix.random();
        }
    }
    async start(): Promise<void> {}
    async commit(): Promise<void> {}
    async rollback(): Promise<void> {}
}
