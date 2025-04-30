import express from 'express'
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import dotenv from 'dotenv'
dotenv.config()
const app = express()
const port = 3000

const bot = new Telegraf(process.env.BOT_TOKEN)


app.use(express.json());

bot.start((ctx) => ctx.reply('Welcome'))

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

app.get('/', (req, res) => {
    res.send('Hello World from 3000 port!')
})

app.post('/notify', (req, res) => {
    const { chatId, message } = req.body;
    bot.telegram.sendMessage(chatId, message)
    res.send('Notification sent')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
