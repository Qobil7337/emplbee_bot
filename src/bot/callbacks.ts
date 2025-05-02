import {Context, Telegraf} from 'telegraf'
import {getTelegramConfig, updateTelegramConfig} from "../services/telegramService.js";
import {CONFIG_KEYS} from "../constants/constants.js";

export const registerCallbacks = (bot: Telegraf) => {
    // ON SELECT OPTIONS CALLBACK
    bot.on('callback_query', async (ctx: Context) => {

        if (!ctx.chat) {
            return ctx.reply?.('❌ Chat not found in callback query.')
        }

        const groupId = ctx.chat.id

        try {
            const config = await getTelegramConfig(groupId)

            if (!config.includes(CONFIG_KEYS.TASK_UPDATE)) {
                config.push(CONFIG_KEYS.TASK_UPDATE)
                await updateTelegramConfig(groupId, config)
                return ctx.reply('✅ Task update is set successfully.')
            } else {
                await ctx.answerCbQuery('Already enabled')
                return ctx.reply('Task Update is already enabled.')
            }
        } catch (e) {
            console.log('Callback handler error:', e)
            ctx.reply('❌ Failed to update settings.')
        }
    })
}
