import { Router } from 'express';

export const datasetRouter = Router();

datasetRouter.post('/', (req, res) => {
    res.send('Создание элемента датасета');
});

datasetRouter.get('/', (req, res) => {
    res.send('Список элементов датасета');
});

datasetRouter.patch('/', (req, res) => {
    res.send('Изменение элемента датасета');
});

datasetRouter.delete('/', (req, res) => {
    res.send('Удаление элемента из датасета');
});
