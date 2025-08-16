import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
    res.send({
        message: 'pong',
    });
});

app.listen(PORT, () => {
    console.log(`Server is running: http://localhost:${PORT}`);
});
