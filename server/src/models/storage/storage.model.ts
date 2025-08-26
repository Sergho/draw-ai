import { dirname } from 'path';
import { appConfig } from '../../config/app.js';
import { TransactionalModel } from '../../utils/transactional-model.js';
import { appendFile, mkdir, readFile, writeFile } from 'fs/promises';
import { deleteFile, renameFile } from './storage.helpers.js';

export class StorageModel implements TransactionalModel {
    private origFilename: string;
    private bufferFilename: string;
    constructor() {
        this.origFilename = appConfig.fs.path;
        this.bufferFilename = this.origFilename + '.buffer';
    }
    async write(data: string) {
        await writeFile(this.bufferFilename, data);
    }
    async add(data: string) {
        await appendFile(this.bufferFilename, data);
    }
    async read() {
        return readFile(this.bufferFilename, 'utf-8');
    }
    async clear() {
        await writeFile(this.bufferFilename, '');
    }
    async start() {
        const dir = dirname(this.bufferFilename);
        await mkdir(dir, { recursive: true });
        await writeFile(this.bufferFilename, '');
    }
    async commit() {
        await deleteFile(this.origFilename);
        await renameFile(this.bufferFilename, this.origFilename);
    }
    async rollback() {
        await deleteFile(this.bufferFilename);
    }
}
