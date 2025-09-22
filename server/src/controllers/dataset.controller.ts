import { Request, Response } from 'express';

class DatasetController {
    async create(req: Request, res: Response) {
        res.send('Создание элемента датасета');
    }

    async getSize(req: Request, res: Response) {
        res.send('Получение размерности элемента датасета');
    }

    async getAll(req: Request, res: Response) {
        res.send('Получение всех элементов датасета');
    }

    async update(req: Request, res: Response) {
        res.send('Изменение элемента датасета');
    }

    async delete(req: Request, res: Response) {
        res.send('Удаление элемента из датасета');
    }
}

export const datasetController = new DatasetController();
