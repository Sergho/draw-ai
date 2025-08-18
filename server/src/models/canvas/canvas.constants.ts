import { CanvasError } from './canvas.types.js';

export const CANVAS_ERROR = {
    incorrectSize: new CanvasError('Incorrect canvas size'),
    incorrectData: new CanvasError('Incorrect canvas data'),
    incorrectPosition: new CanvasError('Incorrect canvas position'),
};
