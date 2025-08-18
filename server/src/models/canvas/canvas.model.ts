import { CANVAS_ERROR } from './canvas.constants.js';
import { CanvasError, CanvasPosition, CanvasSize } from './canvas.types.js';

export class Canvas {
    private map: number[][];
    private _size: CanvasSize;
    constructor(size: CanvasSize) {
        this.size = size;
    }
    set size(value: CanvasSize) {
        const { width, height } = value;

        this._size = value;

        this.map = [];
        this.map.length = width;
        for (let x = 0; x < width; x++) {
            this.map[x] = [];
            this.map[x].length = height;
        }
    }
    get size() {
        return this._size;
    }
    parseBase64(data: string): void {
        const blob = Buffer.from(data, 'base64');
        this.parseBlob(blob);
    }
    parseBlob(blob: Buffer): void {
        const { width, height } = this.size;
        const targetSize = width * height;
        if (blob.length !== targetSize) {
            throw CANVAS_ERROR.incorrectSize;
        }

        for (let i = 0; i < targetSize; i++) {
            const x = Math.trunc(i / height);
            const y = i % height;
            const value = +(blob[i] / 10).toFixed(1);

            this.set({ x, y }, value);
        }
    }
    getBase64(): string {
        const blob = this.getBlob();
        return btoa(String.fromCharCode(...blob));
    }
    getBlob(): Buffer {
        const { width, height } = this.size;
        const buffer = new Uint8Array(width * height);
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const elem = this.map[x][y] * 10;
                buffer[x * height + y] = elem;
            }
        }

        return Buffer.from(buffer);
    }
    get(position: CanvasPosition): number | undefined {
        const { x, y } = position;
        const { width, height } = this.size;

        if (x < 0 || y < 0 || x >= width || y >= height) {
            return undefined;
        }

        return this.map[x][y];
    }
    set(position: CanvasPosition, value: number) {
        const { x, y } = position;
        const { width, height } = this.size;

        if (x < 0 || y < 0 || x >= width || y >= height) {
            throw CANVAS_ERROR.incorrectPosition;
        }
        if (value < 0 || value > 1) {
            throw CANVAS_ERROR.incorrectData;
        }

        this.map[x][y] = value;
    }
}
