import { Request, Response } from 'express';

class AiController {
    async learn(req: Request, res: Response) {
        res.send('Запуск обучения');
    }

    async predict(req: Request, res: Response) {
        res.send('Результат предсказания');
    }
}

export const aiController = new AiController();
