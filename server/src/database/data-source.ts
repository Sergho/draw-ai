import { DataSource } from 'typeorm';
import { appConfig } from '../config/app.js';
import { DatasetItemEntity } from './entities/dataset-item.entity.js';

export const AppDataSource = new DataSource({
    type: 'postgres',
    ...appConfig.database,
    synchronize: false,
    entities: [DatasetItemEntity],
    migrations: ['dist/database/migrations/**/*.js'],
});
