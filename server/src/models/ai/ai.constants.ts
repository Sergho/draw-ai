import { AIConfig, AIError } from './ai.types.js';

export const AI_ERROR = {
    incorrectInput: new AIError('Incorrect prediction input'),
    incorrectSize: new AIError('Incorrect params size'),
    incorrectIndex: new AIError('Incorrect index'),
};

export const aiConfig: AIConfig = {
    layers: [
        {
            size: 400,
        },
        {
            size: 400,
        },
        {
            size: 10,
        },
    ],
    paramsDispersion: 2,
};
