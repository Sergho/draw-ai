import * as dotenv from 'dotenv';

dotenv.config({
    path: '../.env',
});

export const appConfig = {
    database: {
        host: 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        username: process.env.POSTGRES_USER || 'admin',
        password: process.env.POSTGRES_PASSWORD || 'admin',
        database: process.env.POSTGRES_DB || 'drawai',
    },
};
