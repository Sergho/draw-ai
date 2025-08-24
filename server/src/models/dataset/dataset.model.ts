import { DatasetItemEntity } from '../../database/entities/dataset-item.entity.js';
import { Canvas } from '../canvas/canvas.model.js';
import {
    DatasetCreateItemDto,
    DatasetDeleteItemDto,
    DatasetGetItemDto,
    DatasetItem,
    DatasetUpdateItemDto,
} from './dataset.types.js';
import { DATASET_ERROR, datasetItemSize } from './dataset.constants.js';
import { QueryRunner } from 'typeorm';
import { AppDataSource } from '../../database/data-source.js';
import { TransactionalModel } from '../../utils/transactional-model.js';

export class DatasetModel implements TransactionalModel {
    private queryRunner: QueryRunner;
    constructor() {
        this.queryRunner = AppDataSource.createQueryRunner();
    }
    async createItem(dto: DatasetCreateItemDto): Promise<DatasetItem> {
        const { canvas, value } = dto;

        if (!canvas.checkSize(datasetItemSize)) {
            throw DATASET_ERROR.incorrectSize;
        }

        if (value < 0 || value > 10) {
            throw DATASET_ERROR.incorrectValue;
        }

        const blob = canvas.getBlob();
        const created = await this.queryRunner.manager.save(DatasetItemEntity, {
            matrix: blob,
            value,
        });

        return {
            id: created.id,
            canvas,
            value,
        };
    }

    async getAllItems(): Promise<DatasetItem[]> {
        const list = await this.queryRunner.manager.find(DatasetItemEntity);

        return list.map((found) => {
            const canvas = new Canvas(datasetItemSize);
            canvas.parseBlob(found.matrix);

            return {
                id: found.id,
                canvas,
                value: found.value,
            };
        });
    }

    async getSingleItem(dto: DatasetGetItemDto): Promise<DatasetItem> {
        const { id } = dto;

        const item = await this.queryRunner.manager.findOneBy(
            DatasetItemEntity,
            { id },
        );

        if (!item) {
            throw DATASET_ERROR.notFound;
        }

        const canvas = new Canvas(datasetItemSize);
        canvas.parseBlob(item.matrix);

        return {
            id: item.id,
            canvas,
            value: item.value,
        };
    }

    async exists(dto: DatasetGetItemDto): Promise<boolean> {
        return this.queryRunner.manager.existsBy(DatasetItemEntity, dto);
    }

    async updateItem(dto: DatasetUpdateItemDto): Promise<DatasetItem> {
        const { id, canvas, value } = dto;
        const blob = canvas ? canvas.getBlob() : undefined;

        if (!this.exists({ id })) {
            throw DATASET_ERROR.notFound;
        }

        if (canvas && !canvas.checkSize(datasetItemSize)) {
            throw DATASET_ERROR.incorrectSize;
        }

        if (value && (value < 0 || value > 10)) {
            throw DATASET_ERROR.incorrectValue;
        }

        const updated = await this.queryRunner.manager.save(DatasetItemEntity, {
            id,
            ...(blob && { blob }),
            ...(value && { value }),
        });

        const updatedCanvas = canvas ? canvas : new Canvas(datasetItemSize);
        if (!canvas) {
            updatedCanvas.parseBlob(updated.matrix);
        }

        return {
            id: updated.id,
            canvas: updatedCanvas,
            value: updated.value,
        };
    }

    async deleteItem(dto: DatasetDeleteItemDto): Promise<void> {
        const { id } = dto;

        if (!this.exists({ id })) {
            throw DATASET_ERROR.notFound;
        }

        await this.queryRunner.manager.delete(DatasetItemEntity, id);
    }

    async start() {
        await this.queryRunner.connect();
        await this.queryRunner.startTransaction();
    }

    async commit() {
        await this.queryRunner.commitTransaction();
        await this.queryRunner.release();
    }

    async rollback() {
        await this.queryRunner.rollbackTransaction();
        await this.queryRunner.release();
    }
}
