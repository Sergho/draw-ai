import { Matrix } from '../matrix/matrix.model.js';
import { CANVAS_ERROR } from './canvas.constants.js';
import { CanvasPosition, CanvasSize } from './canvas.types.js';

export class Canvas extends Matrix {
    constructor(size: CanvasSize) {
        super(size);
    }
    parseBase64(data: string): void {
        const blob = Buffer.from(data, 'base64');
        this.parseBlob(blob);
    }
    parseBlob(blob: Buffer): void {
        const { rows, cols } = this.size;
        const targetSize = rows * cols;

        if (blob.length !== targetSize) {
            throw CANVAS_ERROR.incorrectSize;
        }

        for (let i = 0; i < targetSize; i++) {
            const row = Math.trunc(i / cols);
            const col = i % cols;
            const value = +(blob[i] / 10).toFixed(1);

            this.set({ row, col }, value);
        }
    }
    getBase64(): string {
        const blob = this.getBlob();
        return btoa(String.fromCharCode(...blob));
    }
    getBlob(): Buffer {
        const { rows, cols } = this.size;
        const buffer = new Uint8Array(rows * cols);
        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
                const elem = this.get({ row, col }) * 10;
                buffer[row * cols + col] = elem;
            }
        }

        return Buffer.from(buffer);
    }
    set(position: CanvasPosition, value: number) {
        if (value < 0 || value > 1) {
            throw CANVAS_ERROR.incorrectData;
        }

        super.set(position, value);
    }
    random(): void {
        super.random(0, 1);
    }
}
