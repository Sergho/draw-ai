import { Canvas } from '../canvas/canvas.model.js';

export type DatasetItem = {
    id: string;
    canvas: Canvas;
    value: number;
};

export class DatasetError extends Error {}

export type DatasetCreateItemDto = Pick<DatasetItem, 'canvas' | 'value'>;

export type DatasetUpdateItemDto = Pick<DatasetItem, 'id'> &
    Partial<Pick<DatasetItem, 'canvas' | 'value'>>;

export type DatasetGetItemDto = Pick<DatasetItem, 'id'>;

export type DatasetDeleteItemDto = Pick<DatasetItem, 'id'>;
