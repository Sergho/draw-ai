import { StorageModel } from './storage.model.js';

describe('storage model', () => {
    let model: StorageModel;

    beforeEach(async () => {
        model = new StorageModel();
        await model.start();
    });

    afterEach(async () => {
        await model.rollback();
    });

    it('should has no data initially', async () => {
        const data = await model.read();
        expect(data).toEqual('');
    });
    it('should overwrite data', async () => {
        await model.write('temp');
        await model.write('test123');
        const data = await model.read();
        expect(data).toEqual('test123');
    });
    it('should add data', async () => {
        await model.write('temp');
        await model.add('test123');
        const data = await model.read();
        expect(data).toEqual('temptest123');
    });
    it('should clear data', async () => {
        await model.write('temp');
        await model.clear();
        const data = await model.read();
        expect(data).toEqual('');
    });
});
