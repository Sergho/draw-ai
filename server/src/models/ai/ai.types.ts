import { Matrix } from '../matrix/matrix.model.js';

export type LayerConfig = {
    size: number;
};

export type AIConfig = {
    layers: LayerConfig[];
    paramsDispersion: number;
};

export type AILayerSignal = {
    raw: number[];
    activated: number[];
};

export type AILearnDiff = {
    weightsDiff: Matrix[];
    biasesDiff: Matrix[];
};

export class AIError extends Error {}
