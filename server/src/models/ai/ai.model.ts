import { TransactionalModel } from '../../utils/transactional-model.js';
import { Canvas } from '../canvas/canvas.model.js';
import { datasetItemSize } from '../dataset/dataset.constants.js';
import { DatasetItem } from '../dataset/dataset.types.js';
import { Matrix } from '../matrix/matrix.model.js';
import { AI_ERROR, aiConfig } from './ai.constants.js';
import { AILayerSignal, AILearnDiff } from './ai.types.js';

export class AIModel implements TransactionalModel {
    private weights: Matrix[];
    private biases: Matrix[];
    constructor() {
        this.clear();
    }
    learn(batch: DatasetItem[]): void {
        const diffs: AILearnDiff[] = [];
        for (const elem of batch) {
            const { canvas, value } = elem;
            const signals = this.getSignals(canvas);
            diffs.push(this.getLearnDiff(value, signals));
        }

        const avgDiff = this.averageDiff(diffs);
        const updated = this.sumDiff(
            { weightsDiff: this.weights, biasesDiff: this.biases },
            avgDiff,
        );

        this.weights = updated.weightsDiff;
        this.biases = updated.biasesDiff;
    }
    predict(canvas: Canvas): number[] {
        const signals = this.getSignals(canvas);

        return signals[signals.length - 1].activated;
    }
    clear(): void {
        this.initWeights();
        this.initBiases();
    }
    async start(): Promise<void> {}
    async commit(): Promise<void> {}
    async rollback(): Promise<void> {}
    private getSignals(canvas: Canvas): AILayerSignal[] {
        if (!canvas.checkSize(datasetItemSize)) {
            throw AI_ERROR.incorrectInput;
        }

        const signals: AILayerSignal[] = [
            {
                raw: [],
                activated: canvas.getList(),
            },
        ];

        for (let i = 0; i < this.weights.length; i++) {
            const weights = this.weights[i];
            const biases = this.biases[i];

            const current = signals[signals.length - 1].activated;

            const matrix = Matrix.fromList(current);
            const multiplied = Matrix.multiply(weights, matrix);
            const offseted = Matrix.sum(multiplied, biases);
            const list = offseted.getList();

            signals.push({
                raw: list,
                activated: this.sigmoid(list),
            });
        }

        return signals;
    }
    private getLearnDiff(value: number, signals: AILayerSignal[]): AILearnDiff {
        if (signals.length !== this.weights.length + 1) {
            throw AI_ERROR.incorrectSize;
        }

        const weightsDiff = new Array<Matrix>(this.weights.length);
        const biasesDiff = new Array<Matrix>(this.biases.length);

        let error = this.initError(value, signals);
        for (let i = this.weights.length - 1; i >= 0; i--) {
            if (i < this.weights.length - 1) {
                error = this.getError(signals, i + 1);
            }

            weightsDiff[i] = this.getWeightsDiff(signals, i, error);
            biasesDiff[i] = this.getBiasesDiff(signals, i + 1, error);
        }

        return { weightsDiff, biasesDiff };
    }
    private sigmoid(layer: number[]): number[] {
        const activated: number[] = [];

        for (const elem of layer) {
            const value = 1 / (1 + Math.exp(-elem));
            activated.push(value);
        }

        return activated;
    }
    private dSigmoid(arg: number): number {
        const exp = Math.exp(arg);

        return -exp / (1 + exp) ** 2;
    }
    private initWeights(): void {
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
    private initBiases(): void {
        const { layers, paramsDispersion } = aiConfig;

        this.biases = [];
        for (let i = 0; i < layers.length; i++) {
            const size = layers[i].size;
            const matrix = new Matrix({ rows: size, cols: 1 });
            matrix.random(-paramsDispersion, paramsDispersion);

            this.biases.push(matrix);
        }
    }
    private initError(value: number, signals: AILayerSignal[]): number[] {
        const lastSignal = signals[signals.length - 1].activated;
        const result = [...lastSignal];

        result[value] -= 1;
        result.map((x) => 2 * x);

        return result;
    }
    private getError(signals: AILayerSignal[], layerIndex: number): number[] {
        if (layerIndex < 0 || layerIndex >= signals.length) {
            throw AI_ERROR.incorrectIndex;
        }

        const prevSignals = signals[layerIndex + 1];
        const currentSignals = signals[layerIndex];
        const weights = this.weights[layerIndex];

        const error: number[] = [];
        for (let i = 0; i < currentSignals.activated.length; i++) {
            error[i] = 0;
            for (let j = 0; j < prevSignals.activated.length; j++) {
                let term = weights.get({ row: j, col: i });
                term *= this.dSigmoid(prevSignals.raw[j]);
                term *= prevSignals.activated[j];

                error[i] += term;
            }
        }

        return error;
    }
    private getWeightsDiff(
        signals: AILayerSignal[],
        weightsIndex: number,
        error: number[],
    ): Matrix {
        if (weightsIndex < 0 || weightsIndex >= this.weights.length) {
            throw AI_ERROR.incorrectIndex;
        }

        const prevSignals = signals[weightsIndex + 1];
        const currentSignals = signals[weightsIndex];

        if (error.length !== prevSignals.activated.length) {
            throw AI_ERROR.incorrectSize;
        }

        const weightsDiff = new Matrix({
            rows: prevSignals.activated.length,
            cols: currentSignals.activated.length,
        });

        for (let i = 0; i < prevSignals.activated.length; i++) {
            for (let j = 0; j < currentSignals.activated.length; j++) {
                let elem = currentSignals.activated[j];
                elem *= this.dSigmoid(prevSignals.raw[i]);
                elem *= error[i];

                weightsDiff.set({ row: i, col: j }, elem);
            }
        }

        return weightsDiff;
    }
    private getBiasesDiff(
        signals: AILayerSignal[],
        layerIndex: number,
        error: number[],
    ): Matrix {
        if (layerIndex < 0 || layerIndex >= signals.length) {
            throw AI_ERROR.incorrectIndex;
        }

        const layerSignals = signals[layerIndex];

        if (error.length !== layerSignals.activated.length) {
            throw AI_ERROR.incorrectSize;
        }

        const biasesDiff = new Matrix({
            rows: layerSignals.activated.length,
            cols: 1,
        });

        for (let i = 0; i < layerSignals.activated.length; i++) {
            let elem = this.dSigmoid(layerSignals.raw[i]);
            elem *= error[i];

            biasesDiff.set({ row: i, col: 0 }, elem);
        }

        return biasesDiff;
    }
    private sumDiff(first: AILearnDiff, second: AILearnDiff): AILearnDiff {
        if (first.biasesDiff.length !== second.biasesDiff.length) {
            throw AI_ERROR.incorrectSize;
        }

        if (first.weightsDiff.length !== second.weightsDiff.length) {
            throw AI_ERROR.incorrectSize;
        }

        if (first.weightsDiff.length !== first.biasesDiff.length) {
            throw AI_ERROR.incorrectSize;
        }

        const sumDiff: AILearnDiff = {
            weightsDiff: [],
            biasesDiff: [],
        };

        for (let i = 0; i < first.weightsDiff.length; i++) {
            sumDiff.weightsDiff.push(
                Matrix.sum(first.weightsDiff[i], second.weightsDiff[i]),
            );
            sumDiff.biasesDiff.push(
                Matrix.sum(first.biasesDiff[i], second.biasesDiff[i]),
            );
        }

        return sumDiff;
    }
    private averageDiff(diffs: AILearnDiff[]): AILearnDiff {
        if (diffs.length === 0) {
            throw AI_ERROR.incorrectSize;
        }

        let avgDiff: AILearnDiff = diffs[0];
        for (let i = 1; i < diffs.length; i++) {
            avgDiff = this.sumDiff(avgDiff, diffs[i]);
        }

        if (avgDiff.biasesDiff.length !== avgDiff.weightsDiff.length) {
            throw AI_ERROR.incorrectSize;
        }

        for (let i = 0; i < avgDiff.weightsDiff.length; i++) {
            const factor = 1 / diffs.length;
            avgDiff.weightsDiff[i].scale(factor);
            avgDiff.biasesDiff[i].scale(factor);
        }

        return avgDiff;
    }
}
