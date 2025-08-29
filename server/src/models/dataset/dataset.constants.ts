import { CanvasSize } from '../canvas/canvas.types.js';
import { DatasetError } from './dataset.types.js';

export const DATASET_ERROR = {
    notFound: new DatasetError('Dataset item not found'),
    incorrectSize: new DatasetError('Incorrect canvas size'),
    incorrectValue: new DatasetError('Incorrect value'),
};

export const datasetItemSize: CanvasSize = {
    rows: 30,
    cols: 30,
};
