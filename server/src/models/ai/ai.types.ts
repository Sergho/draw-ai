export type LayerConfig = {
    size: number;
};

export type AIConfig = {
    layers: LayerConfig[];
    paramsDispersion: number;
};

export class AIError extends Error {}
