import { Router } from 'express';

export const aiRouter = Router();

aiRouter.put('/', (req, res) => {
    res.send('Запуск обучения');
});

aiRouter.get('/status', (req, res) => {
    res.send('Статус обучения');
});

aiRouter.get('/', (req, res) => {
    res.send('Результат предсказания');
});
