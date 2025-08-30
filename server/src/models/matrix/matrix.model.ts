import { MATRIX_ERROR } from './matrix.constants.js';
import { MatrixPosition, MatrixSize } from './matrix.types.js';

export class Matrix {
    private data: number[];
    private _size: MatrixSize;
    constructor(size: MatrixSize) {
        this.size = size;
    }
    set size(value: MatrixSize) {
        const { rows, cols } = value;

        this._size = value;
        this.data = [];
        this.data.length = rows * cols;
        this.fill(0);
    }
    get size(): MatrixSize {
        return this._size;
    }
    fill(value: number): void {
        const { data } = this;
        for (let i = 0; i < data.length; i++) {
            data[i] = value;
        }
    }
    random(from: number, to: number): void {
        const { data } = this;
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * (to - from) + from;
        }
    }
    set(position: MatrixPosition, value: number): void {
        const index = this.getDataIndex(position);

        if (index === -1) {
            throw MATRIX_ERROR.incorrectPosition;
        }

        this.data[index] = value;
    }
    get(position: MatrixPosition): number {
        const index = this.getDataIndex(position);

        if (index === -1) {
            throw MATRIX_ERROR.incorrectPosition;
        }

        return this.data[index];
    }
    getList(): number[] {
        return this.data;
    }
    static fromList(list: number[]): Matrix {
        const matrix = new Matrix({ rows: 1, cols: list.length });

        for (let col = 0; col < list.length; col++) {
            matrix.set({ row: 0, col }, list[col]);
        }

        return matrix;
    }
    static sum(first: Matrix, second: Matrix): Matrix {
        if (
            first.size.rows !== second.size.rows ||
            first.size.cols !== second.size.cols
        ) {
            throw MATRIX_ERROR.incompatibleSizes;
        }

        const { rows, cols } = first.size;
        const result = new Matrix({ rows, cols });

        for (let i = 0; i < first.data.length; i++) {
            result.data[i] = first.data[i] + second.data[i];
        }

        return result;
    }
    static multiply(first: Matrix, second: Matrix): Matrix {
        if (first.size.cols !== second.size.rows) {
            throw MATRIX_ERROR.incompatibleSizes;
        }

        const rows = first.size.rows;
        const cols = second.size.cols;
        const result = new Matrix({ rows, cols });

        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            for (let colIndex = 0; colIndex < cols; colIndex++) {
                const row = first.getRow(rowIndex);
                const col = second.getCol(colIndex);

                let sum = 0;
                for (let i = 0; i < row.length; i++) {
                    sum += row[i] * col[i];
                }

                result.set({ row: rowIndex, col: colIndex }, sum);
            }
        }

        return result;
    }
    private getDataIndex(position: MatrixPosition): number {
        const { row, col } = position;
        const { cols } = this.size;
        const index = row * cols + col;

        if (index >= this.data.length) {
            return -1;
        }

        return index;
    }
    private getRow(index: number): number[] {
        const { rows, cols } = this.size;
        const start = index * cols;

        if (index >= rows) {
            return [];
        }

        const result: number[] = [];

        for (let i = start; i < start + cols; i++) {
            result.push(this.data[i]);
        }

        return result;
    }
    private getCol(index: number): number[] {
        const { cols } = this.size;

        if (index >= cols) {
            return [];
        }

        const result: number[] = [];

        for (let i = index; i < this.data.length; i += cols) {
            result.push(this.data[i]);
        }

        return result;
    }
}
