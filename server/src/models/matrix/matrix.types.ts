export type MatrixSize = {
    rows: number;
    cols: number;
};

export type MatrixPosition = {
    row: number;
    col: number;
};

export class MatrixError extends Error {}
