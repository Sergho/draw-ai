import { datasetItemSize } from '../dataset/dataset.constants.js';
import { AIConfig } from './ai.types.js';

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
};
