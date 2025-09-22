import { Canvas } from '../../models/canvas/canvas.model.js';
import { datasetItemSize } from '../../models/dataset/dataset.constants.js';
import { DatasetModel } from '../../models/dataset/dataset.model.js';
import { DatasetItem } from '../../models/dataset/dataset.types.js';
import { MatrixSize } from '../../models/matrix/matrix.types.js';
import {
    DatasetServiceCreateItemDto,
    DatasetServiceDeleteItemDto,
    DatasetServiceUpdateItemDto,
} from './dataset.types.js';

export class DatasetService {
    async getSize(): Promise<MatrixSize> {
        return datasetItemSize;
    }
    async createItem(dto: DatasetServiceCreateItemDto): Promise<DatasetItem> {
        const model = new DatasetModel();
        const { pixels, value } = dto;
        const canvas = new Canvas(datasetItemSize);
        canvas.fillWithPixels(pixels);

        try {
            await model.start();
            const created = await model.createItem({
                canvas,
                value,
            });
            await model.commit();

            return created;
        } catch (err) {
            await model.rollback();
            throw err;
        }
    }
    async getAllItems(): Promise<DatasetItem[]> {
        const model = new DatasetModel();
        return model.getAllItems();
    }
    async updateItem(dto: DatasetServiceUpdateItemDto) {
        const model = new DatasetModel();
        const { id, pixels, value } = dto;
        const canvas = new Canvas(datasetItemSize);

        if (pixels) {
            canvas.fillWithPixels(pixels);
        }

        try {
            await model.start();
            const updated = await model.updateItem({
                id,
                canvas: pixels ? canvas : undefined,
                value,
            });
            await model.commit();

            return updated;
        } catch (err) {
            await model.rollback();
            throw err;
        }
    }
    async deleteItem(dto: DatasetServiceDeleteItemDto): Promise<void> {
        const model = new DatasetModel();
        const { id } = dto;

        try {
            await model.start();
            await model.deleteItem({ id });
            await model.commit();
        } catch (err) {
            await model.rollback();
            throw err;
        }
    }
}
