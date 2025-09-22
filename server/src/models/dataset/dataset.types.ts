import { Canvas } from '../canvas/canvas.model.js';

export type DatasetItem = {
    id: string;
    canvas: Canvas;
    value: number;
};

export class DatasetError extends Error {}

export type DatasetModelCreateItemDto = Pick<DatasetItem, 'canvas' | 'value'>;

export type DatasetModelUpdateItemDto = Pick<DatasetItem, 'id'> &
    Partial<Pick<DatasetItem, 'canvas' | 'value'>>;

export type DatasetModelGetItemDto = Pick<DatasetItem, 'id'>;

export type DatasetModelDeleteItemDto = Pick<DatasetItem, 'id'>;
