import { datasetItemSize } from '../dataset/dataset.constants.js';
import { MATRIX_ERROR } from './matrix.constants.js';
import { Matrix } from './matrix.model.js';

describe('matrix model', () => {
    it('should fill matrix by zeros initially', () => {
        const matrix = new Matrix({ rows: 4, cols: 3 });
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 3; col++) {
                const value = matrix.get({ row, col });
                expect(value).toEqual(0);
            }
        }
    });
    it('should check matrix size while getting', () => {
        const matrix = new Matrix({ rows: 4, cols: 3 });
        expect(() => {
            matrix.get({ row: 4, col: 2 });
        }).toThrow(MATRIX_ERROR.incorrectPosition);
    });
    it('should check matrix size while setting', () => {
        const matrix = new Matrix({ rows: 4, cols: 3 });
        expect(() => {
            matrix.set({ row: 4, col: 2 }, 2);
        }).toThrow(MATRIX_ERROR.incorrectPosition);
    });
    it('should parse list correctly', () => {
        const list = [4, 3, 2, 5, 6];
        const matrix = Matrix.fromList(list);
        expect(matrix.size).toEqual({ rows: list.length, cols: 1 });
        expect(matrix.getList()).toEqual(list);
    });
    it('should check matrices sizes before sum', () => {
        const first = new Matrix({ rows: 3, cols: 2 });
        const second = new Matrix({ rows: 4, cols: 2 });
        expect(() => {
            Matrix.sum(first, second);
        }).toThrow(MATRIX_ERROR.incompatibleSizes);
    });
    it('should sum matrices correctly', () => {
        const first = [
            [1, 2, 3],
            [6, 3, 2],
        ];
        const second = [
            [4, 2, 3],
            [3, 2, 3],
        ];
        const result = [
            [5, 4, 6],
            [9, 5, 5],
        ];

        const firstMatrix = new Matrix({ rows: 2, cols: 3 });
        const secondMatrix = new Matrix({ rows: 2, cols: 3 });

        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 3; col++) {
                firstMatrix.set({ row, col }, first[row][col]);
                secondMatrix.set({ row, col }, second[row][col]);
            }
        }

        const resultMatrix = Matrix.sum(firstMatrix, secondMatrix);
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 3; col++) {
                const value = resultMatrix.get({ row, col });
                expect(value).toEqual(result[row][col]);
            }
        }
    });
    it('should check matrices sizes before multiply', () => {
        const first = new Matrix({ rows: 2, cols: 3 });
        const second = new Matrix({ rows: 4, cols: 3 });
        expect(() => {
            Matrix.multiply(first, second);
        }).toThrow(MATRIX_ERROR.incompatibleSizes);
    });
    it('should multiply matrices correctly', () => {
        const first = [
            [2, 4, 1],
            [1, 0, -2],
        ];
        const second = [
            [7, 3, 2],
            [4, 1, 0],
            [2, -1, 6],
        ];
        const result = [
            [32, 9, 10],
            [3, 5, -10],
        ];

        const firstMatrix = new Matrix({ rows: 2, cols: 3 });
        const secondMatrix = new Matrix({ rows: 3, cols: 3 });

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (row <= 1) firstMatrix.set({ row, col }, first[row][col]);
                secondMatrix.set({ row, col }, second[row][col]);
            }
        }

        const resultMatrix = Matrix.multiply(firstMatrix, secondMatrix);
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 3; col++) {
                const value = resultMatrix.get({ row, col });
                expect(value).toEqual(result[row][col]);
            }
        }
    });
    it('should observe random limits', () => {
        const matrix = new Matrix(datasetItemSize);
        matrix.random(-3, 5);
        for (const elem of matrix.getList()) {
            expect(elem).toBeLessThan(5);
            expect(elem).toBeGreaterThan(-3);
        }
    });
});
