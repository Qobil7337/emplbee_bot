import express from 'express'
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import dotenv from 'dotenv'
import axios from "axios";
dotenv.config()
const app = express()
const port = 3000

const bot = new Telegraf(process.env.BOT_TOKEN)


app.use(express.json());

bot.start((ctx) => ctx.reply('Welcome'))

bot.command('configure', async (ctx) => {
    // Only handle messages from groups/supergroups
    if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
        const text = ctx.message.text
        const parts = text.split(' ')
        if (parts.length > 2) {
            return ctx.reply('Please provide organization ID like: /configure 12345')
        }
        if (parts[1] === undefined) {
            return ctx.reply('Please provide organization ID like: /configure 12345')
        }
        const organizationId = parts[1]
        const groupId = ctx.chat.id

        try {
            await axios.get(`http://localhost:8888/emplbee/BACKEND/web/index.php/v1/task/check-org-id?organizationId=${organizationId}`, {
                headers: {
                    Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
                }
            }).then(response => {
                console.log(response.data)
                if (!response.data) {
                    return ctx.reply('Organization with this id does not exist')
                }
                // add telegram group id to database
                ctx.reply(`Configured with Organization ID: ${organizationId}`)
            })
        } catch (e) {
            console.log(e)
            return ctx.reply('Failed to check organization id')
        }

    } else {
        ctx.reply('This command can only be used in a group.')
    }
})

bot.command('settings', (ctx) => {
    if (ctx.chat.type !== 'group' && ctx.chat.type !== 'supergroup') {
        return ctx.reply('Settings can only be configured in groups.');
    }

    ctx.reply('Select the types of messages this group wants to receive:', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '✅ Task Creation', callback_data: 'setting_task_creation' },
                    { text: '✅ Face Check-in', callback_data: 'setting_face_checkin' },
                ],
                [
                    { text: '✅ Face Check-out', callback_data: 'setting_face_checkout' }
                ]
            ]
        }
    })
})

bot.on('callback_query', async (ctx) => {
    const callbackData = ctx.callbackQuery.data;

    // Just for demonstration — later you can toggle or store this.
    let message = '';

    switch (callbackData) {
        case 'setting_task_creation':
            message = 'You selected: Task Creation';
            break;
        case 'setting_face_checkin':
            message = 'You selected: Face Check-in';
            break;
        case 'setting_face_checkout':
            message = 'You selected: Face Check-out';
            break;
        default:
            message = 'Unknown option';
    }

    await ctx.answerCbQuery(); // dismiss loading
    await ctx.reply(message);
})

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
