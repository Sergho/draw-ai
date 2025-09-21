import { MatrixError } from './matrix.types.js';

export const MATRIX_ERROR = {
    incorrectPosition: new MatrixError('Incorrect matrix position'),
    incompatibleSizes: new MatrixError('Incompatible matrix sizes'),
    invalidFactor: new MatrixError('Invalid factor'),
};
