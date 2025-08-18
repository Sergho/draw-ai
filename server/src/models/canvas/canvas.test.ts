import { CANVAS_ERROR } from './canvas.constants.js';
import { Canvas } from './canvas.model.js';

describe('canvas model', () => {
    it('should parse blob correctly', () => {
        const map = [
            [0.1, 0.2, 0.3],
            [0.4, 0.5, 0.6],
        ];
        const canvas = new Canvas({ width: 2, height: 3 });
        const blob = Buffer.from([1, 2, 3, 4, 5, 6]);
        canvas.parseBlob(blob);
        for (let x = 0; x < 2; x++) {
            for (let y = 0; y < 3; y++) {
                const elem = canvas.get({ x, y });
                expect(elem).toEqual(map[x][y]);
            }
        }
    });
    it('should parse base64 correctly', () => {
        const map = [
            [0.2, 0.5],
            [0, 1],
            [0.3, 0.7],
        ];
        const canvas = new Canvas({ width: 3, height: 2 });
        const base64 = 'AgUACgMH';
        canvas.parseBase64(base64);
        for (let x = 0; x < 2; x++) {
            for (let y = 0; y < 3; y++) {
                const elem = canvas.get({ x, y });
                expect(elem).toEqual(map[x][y]);
            }
        }
    });
    it('should check size', () => {
        const canvas = new Canvas({ width: 3, height: 4 });
        const blob = Buffer.from([1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2]);
        expect(() => {
            canvas.parseBlob(blob);
        }).toThrow(CANVAS_ERROR.incorrectSize);
    });
    it('should check elements value', () => {
        const canvas = new Canvas({ width: 3, height: 4 });
        const blob = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        expect(() => {
            canvas.parseBlob(blob);
        }).toThrow(CANVAS_ERROR.incorrectData);
    });
    it('should check position on set', () => {
        const canvas = new Canvas({ width: 2, height: 3 });
        expect(() => {
            canvas.set({ x: 2, y: 0 }, 0.1);
        }).toThrow(CANVAS_ERROR.incorrectPosition);
    });
    it("shouldn't check position on get", () => {
        const canvas = new Canvas({ width: 2, height: 3 });
        canvas.parseBlob(Buffer.from([1, 2, 3, 4, 5, 6]));
        expect(canvas.get({ x: 2, y: 0 })).toEqual(undefined);
    });
    it('should correctly convert blob to base64', () => {
        const canvas = new Canvas({ width: 3, height: 4 });
        const base64 = 'AQMFBwgGBAIACgoA';
        const blob = Buffer.from([1, 3, 5, 7, 8, 6, 4, 2, 0, 10, 10, 0]);
        canvas.parseBlob(blob);
        expect(canvas.getBase64()).toEqual(base64);
    });
    it('should correctly convert base64 to blob', () => {
        const canvas = new Canvas({ width: 4, height: 3 });
        const base64 = 'CgkIBwYFBAMCAQAA';
        const blob = Buffer.from([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0]);
        canvas.parseBase64(base64);
        expect(canvas.getBlob()).toEqual(blob);
    });
    it('should be determined while working with blob', () => {
        const canvas = new Canvas({ width: 3, height: 4 });
        const blob = Buffer.from([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]);
        canvas.parseBlob(blob);
        expect(canvas.getBlob()).toEqual(blob);
    });
    it('should be determined while working with base64', () => {
        const canvas = new Canvas({ width: 3, height: 4 });
        const base64 = 'AQIDBAECAwQBAgME';
        canvas.parseBase64(base64);
        expect(canvas.getBase64()).toEqual(base64);
    });
});
