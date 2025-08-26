import { rename, unlink } from 'fs/promises';

export const deleteFile = async (filename: string) => {
    try {
        await unlink(filename);
    } catch {}
};

export const renameFile = async (oldFilename: string, newFilename: string) => {
    try {
        await rename(oldFilename, newFilename);
    } catch {}
};
