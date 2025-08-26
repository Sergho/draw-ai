import { AppDataSource } from '../../database/data-source.js';
import { Canvas } from '../canvas/canvas.model.js';
import { DATASET_ERROR, datasetItemSize } from './dataset.constants.js';
import { DatasetModel } from './dataset.model.js';

describe('dataset model', () => {
    let model: DatasetModel;

    beforeAll(async () => {
        await AppDataSource.initialize();
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    beforeEach(async () => {
        model = new DatasetModel();
        await model.start();
    });

    afterEach(async () => {
        await model.rollback();
    });

    it('should check size on creating item', async () => {
        const canvas = new Canvas({ width: 3, height: 2 });

        await expect(model.createItem({ canvas, value: 4 })).rejects.toThrow(
            DATASET_ERROR.incorrectSize,
        );
    });
    it('should check value on creating item', async () => {
        const canvas = new Canvas(datasetItemSize);

        await expect(model.createItem({ canvas, value: 15 })).rejects.toThrow(
            DATASET_ERROR.incorrectValue,
        );
    });
    it('should create item in database', async () => {
        const canvas = new Canvas(datasetItemSize);
        const created = await model.createItem({ canvas, value: 5 });
        const found = await model.getSingleItem({ id: created.id });

        expect(found.id).toEqual(created.id);
    });
    it('should check size on updating item', async () => {
        const canvas = new Canvas(datasetItemSize);
        const created = await model.createItem({ canvas, value: 4 });
        canvas.size = { width: 3, height: 4 };

        await expect(
            model.updateItem({ id: created.id, canvas, value: 4 }),
        ).rejects.toThrow(DATASET_ERROR.incorrectSize);
    });
    it('should check value on updating item', async () => {
        const canvas = new Canvas(datasetItemSize);
        const created = await model.createItem({ canvas, value: 4 });

        await expect(
            model.updateItem({ id: created.id, canvas, value: 15 }),
        ).rejects.toThrow(DATASET_ERROR.incorrectValue);
    });
    it('should update item in database', async () => {
        const canvas = new Canvas(datasetItemSize);
        const created = await model.createItem({ canvas, value: 4 });
        const updated = await model.updateItem({
            id: created.id,
            canvas,
            value: 3,
        });
        const found = await model.getSingleItem({ id: updated.id });

        expect(found.id).toEqual(updated.id);
    });
    it('should delete item from database', async () => {
        const canvas = new Canvas(datasetItemSize);
        const created = await model.createItem({ canvas, value: 5 });
        await model.deleteItem({ id: created.id });

        await expect(model.getSingleItem({ id: created.id })).rejects.toThrow(
            DATASET_ERROR.notFound,
        );
    });
});
