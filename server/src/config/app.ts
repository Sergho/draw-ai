import * as dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

dotenv.config({
    path: '../.env',
    quiet: true,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const appConfig = {
    database: {
        host: 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        username: process.env.POSTGRES_USER || 'admin',
        password: process.env.POSTGRES_PASSWORD || 'admin',
        database: process.env.POSTGRES_DB || 'drawai',
    },
    fs: {
        path: resolve(
            __dirname,
            '../../',
            process.env.STORAGE_PATH || 'storage/ai.txt',
        ),
    },
};
