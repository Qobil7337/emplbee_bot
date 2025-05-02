import express, { Request, Response } from 'express'
import bot from './bot/bot.js'

const app = express()
const port = 3000

app.use(express.json())

app.get('/', (_: Request, res: Response) => {
    res.send('Hello World from 3000 port!');
})

app.post('/notify', async (req: Request, res: Response) => {
    const { chatId, message } = req.body
    try {
        await bot.telegram.sendMessage(chatId, message)
        res.send('Notification sent')
    } catch (err) {
        console.log('Notify error:', err)
        res.status(500).send('Failed to send notification')
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

bot.launch()
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))































































// import express from 'express'
// import { Telegraf } from "telegraf";
// import { message } from "telegraf/filters";
// import dotenv from 'dotenv'
// import axios from "axios";
// dotenv.config()
// const app = express()
// const port = 3000
//
// const bot = new Telegraf(process.env.BOT_TOKEN)
//
// const dev_api_url = process.env.DEV_API_URL;
// app.use(express.json());
//
// bot.start((ctx) => ctx.reply('Welcome'))
//
// bot.command('configure', async (ctx) => {
//     // Only handle messages from groups/supergroups
//     if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
//         const text = ctx.message.text
//         const parts = text.split(' ')
//         if (parts.length > 2) {
//             return ctx.reply('Please provide organization ID like: /configure 12345')
//         }
//         if (parts[1] === undefined) {
//             return ctx.reply('Please provide organization ID like: /configure 12345')
//         }
//         const organizationId = parts[1]
//         const groupId = ctx.chat.id
//
//         try {
//             await axios.get(`${dev_api_url}/task/check-org-id?organizationId=${organizationId}`, {
//                 headers: {
//                     Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
//                 }
//             }).then(async response => {
//                 if (!response.data) {
//                     return ctx.reply('Organization with this id does not exist')
//                 }
//                 // add telegram group id to database
//                try {
//                    await axios.post(
//                        `${dev_api_url}/task/register-telegram-id`,
//                        {
//                            type: "group",
//                            code: groupId,
//                            config: JSON.stringify([])
//                        },
//                        {
//                            headers: {
//                                Authorization: `Bearer ${process.env.BEARER_TOKEN}`
//                            }
//                        }
//                    ).then(response => {
//                        console.log(response.data)
//                        ctx.reply(`Configured with Organization ID: ${organizationId}`)
//                    })
//                } catch (e) {
//                    console.log(e)
//                }
//             })
//         } catch (e) {
//             console.log(e)
//             return ctx.reply('Failed to check organization id')
//         }
//
//     } else {
//         ctx.reply('This command can only be used in a group.')
//     }
// })
//
// bot.command('settings', (ctx) => {
//     if (ctx.chat.type !== 'group' && ctx.chat.type !== 'supergroup') {
//         return ctx.reply('Settings can only be configured in groups.');
//     }
//
//     ctx.reply('Select the types of messages this group wants to receive:', {
//         reply_markup: {
//             inline_keyboard: [
//                 [
//                     { text: '✅ Task Updates', callback_data: 'task_update' },
//                 ],
//             ]
//         }
//     })
// })
//
// bot.on('callback_query', async (ctx) => {
//     const callbackData = ctx.callbackQuery.data
//     const groupId = ctx.chat.id
//     try {
//         const res = await axios.get(
//             `${dev_api_url}/task/get-telegram-config?groupId=${groupId}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
//                 }
//             }
//         )
//         let configArray = []
//         if (res.data && res.data.config) {
//             try {
//                 configArray = JSON.parse(res.data.config)
//             } catch (e) {
//                 console.error('Invalid config JSON:', e)
//             }
//         }
//
//         if (!configArray.includes('task_update')) {
//             configArray.push('task_update')
//             await axios.post(`${dev_api_url}/task/update-telegram-config`,
//                 {
//                 groupId,
//                 config: JSON.stringify(configArray),
//             },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${process.env.BEARER_TOKEN}`
//                     }
//                 }
//             ).then(response => {
//                 ctx.reply('Task update is set successfully.')
//             })
//         } else {
//             await ctx.answerCbQuery('Already enabled')
//             await ctx.reply('Task Update is already enabled.')
//         }
//     } catch (e) {
//         console.log(e)
//         await ctx.reply('❌ Failed to update settings.')
//     }
// })
//
// bot.launch()
//
// // Enable graceful stop
// process.once('SIGINT', () => bot.stop('SIGINT'))
// process.once('SIGTERM', () => bot.stop('SIGTERM'))
//
// app.get('/', (req, res) => {
//     res.send('Hello World from 3000 port!')
// })
//
// app.post('/notify', (req, res) => {
//     const { chatId, message } = req.body;
//     bot.telegram.sendMessage(chatId, message)
//     res.send('Notification sent')
// })
//
//
//
// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })
