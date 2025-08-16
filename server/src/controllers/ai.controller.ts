import { Request, Response } from 'express';

class AiController {
    async update(req: Request, res: Response) {
        res.send('Запуск обучения');
    }

    async status(req: Request, res: Response) {
        res.send('Статус обучения');
    }

    async predict(req: Request, res: Response) {
        res.send('Результат предсказания');
    }
}

export const aiController = new AiController();
