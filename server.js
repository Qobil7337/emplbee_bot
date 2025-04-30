import express from 'express';
import axios from 'axios';

const app = express()
const port = 4000

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World from 4000 port!')
})

app.post('/create-task', async (req, res) => {
    const task = {
        title: req.body.title,
        description: req.body.description,
    };

    try {
        await axios.post(`http://localhost:4000/notify`, {
            chatId: 5401590333,
            message: `📝 New Task Created:\n${task.title}\n${task.description}`
        })
        res.send('Task created and notification sent')
    } catch (e) {
        console.error('Failed to notify Telegram bot:', e.message);
        res.status(500).send('Task created but failed to notify');
    }


})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
