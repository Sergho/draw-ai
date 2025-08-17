import { DataSource } from 'typeorm';
import { appConfig } from '../config/app.js';

export const AppDataSource = new DataSource({
    type: 'postgres',
    ...appConfig.database,
    synchronize: false,
    entities: ['dist/database/entities/**/*.entity.js'],
    migrations: ['dist/database/migrations/**/*.js'],
});
