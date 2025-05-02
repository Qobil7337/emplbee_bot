import { Telegraf } from "telegraf"
import * as dotenv from "dotenv"
dotenv.config()

import { registerCommands } from "./commands.js"
import { registerCallbacks } from "./callbacks.js"

const botToken = process.env.BOT_TOKEN;
if (!botToken) {
    throw new Error("BOT_TOKEN is not defined in the environment variables")
}

const bot = new Telegraf(botToken)

registerCommands(bot)
registerCallbacks(bot)

export default bot
