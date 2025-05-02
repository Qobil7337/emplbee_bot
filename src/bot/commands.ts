import {Context, Telegraf} from 'telegraf'
import {CHAT_TYPES} from "../constants/constants.js";
import {checkDuplicateEntries, checkOrganizationExists, registerTelegramGroup} from "../services/telegramService.js";

export const registerCommands = (bot: Telegraf) => {
    // CONFIGURE COMMAND

    bot.command('configure', async (ctx: Context) => {
        if (!ctx.chat) {
            return ctx.reply?.('❌ Chat not found in callback query.')
        }

        if (![CHAT_TYPES.GROUP, CHAT_TYPES.SUPERGROUP].includes(ctx.chat.type)) {
            return ctx.reply('This command can only be used in a group.')
        }

        if (!ctx.message || !('text' in ctx.message)) {
            return ctx.reply('Invalid message format.')
        }

        const parts = ctx.message.text.split(' ')
        const organizationId = parts[1]
        if (!organizationId || parts.length > 2) {
            return ctx.reply('Please provide organization ID like: /configure 12345')
        }
// need to refactor nested try catch
        try {
            const exists = await checkOrganizationExists(organizationId)
            if (!exists) return ctx.reply('Organization with this id does not exist')
            try {
                const duplicate = await checkDuplicateEntries(ctx.chat.id)
                if (duplicate) return ctx.reply('Organization is already configured')
            } catch (e) {
                console.log('Duplicate error:', e);
                ctx.reply('❌ Failed to find duplicate records in telegram model.')
            }
            await registerTelegramGroup(ctx.chat.id)
            ctx.reply(`Configured with Organization ID: ${organizationId}`)
        } catch (e) {
            console.log('Configure error:', e);
            ctx.reply('❌ Failed to configure organization.')
        }
    })

    // SETTINGS COMMAND

    bot.command('settings', async (ctx) => {
        if (![CHAT_TYPES.GROUP, CHAT_TYPES.SUPERGROUP].includes(ctx.chat.type)) {
            return ctx.reply('Settings can only be configured in groups.')
        }

        ctx.reply('Select the types of messages this group wants to receive:', {
            reply_markup: {
                inline_keyboard: [[{ text: '✅ Task Updates', callback_data: 'task_update' }]]
            }
        })
    })
}
