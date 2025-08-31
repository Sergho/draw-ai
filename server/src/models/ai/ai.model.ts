import { TransactionalModel } from '../../utils/transactional-model.js';
import { Canvas } from '../canvas/canvas.model.js';
import { datasetItemSize } from '../dataset/dataset.constants.js';
import { DatasetItem } from '../dataset/dataset.types.js';
import { Matrix } from '../matrix/matrix.model.js';
import { AI_ERROR, aiConfig } from './ai.constants.js';

export class AIModel implements TransactionalModel {
    private weights: Matrix[];
    private biases: Matrix[];
    constructor() {
        this.clear();
    }
    async learn(sample: DatasetItem): Promise<void> {}
    async predict(canvas: Canvas): Promise<number[]> {
        if (!canvas.checkSize(datasetItemSize)) {
            throw AI_ERROR.incorrectInput;
        }

        let current = canvas.getList();
        for (let i = 0; i < this.weights.length; i++) {
            const weights = this.weights[i];
            const biases = this.biases[i];

            const matrix = Matrix.fromList(current);
            const multiplied = Matrix.multiply(weights, matrix);
            const offseted = Matrix.sum(multiplied, biases);
            const list = offseted.getList();

            current = this.sigmoid(list);
        }

        return current;
    }
    async clear(): Promise<void> {
        this.initWeights();
        this.initBiases();
    }
    async start(): Promise<void> {}
    async commit(): Promise<void> {}
    async rollback(): Promise<void> {}
    private sigmoid(layer: number[]): number[] {
        const activated: number[] = [];

        for (const elem of layer) {
            const value = 1 / (1 + Math.exp(-elem));
            activated.push(value);
        }

        return activated;
    }
    private initWeights() {
        const { layers, paramsDispersion } = aiConfig;

        this.weights = [];

        let lastSize = datasetItemSize.cols * datasetItemSize.rows;
        for (let i = 0; i < layers.length; i++) {
            const size = layers[i].size;
            const matrix = new Matrix({ rows: size, cols: lastSize });
            matrix.random(-paramsDispersion, paramsDispersion);

            this.weights.push(matrix);
            lastSize = layers[i].size;
        }
    }
    private initBiases() {
        const { layers, paramsDispersion } = aiConfig;

        this.biases = [];
        for (let i = 0; i < layers.length; i++) {
            const size = layers[i].size;
            const matrix = new Matrix({ rows: size, cols: 1 });
            matrix.random(-paramsDispersion, paramsDispersion);

            this.biases.push(matrix);
        }
    }
}
