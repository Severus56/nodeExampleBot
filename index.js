const { Telegraf, Markup, Extra, Stage, session, Scenes} = require('telegraf');
const dotenvConf = require('dotenv').config();
const startGameScene = require('./Scenes/game')
const startCasinoScene = require('./Scenes/casino')
const sequelize = require('./DB/db');
const UserModel = require('./DB/models')
const {gamesMenu} = require("./Buttons/options");


const bot = new Telegraf(process.env.TOKEN);
const stage = new Scenes.Stage([startGameScene, startCasinoScene])



const main = async (ctx) =>{
    try{
        await sequelize.authenticate()
        await sequelize.sync()

    } catch (e) {
        console.log(`Подключение не удалось по причине: ${e}`)
    }

    bot.start(async (ctx) => {
        const chatId = ctx.chat.id
        const user = await UserModel.findOne({
            where: {
                chatId
            }
        })
        if(!user){
            await UserModel.create({chatId})
            ctx.reply(`👋 Привет, ${ctx.message.from.first_name ? ctx.message.from.first_name : ctx.message.from.last_name}! Ты впервые зашел в бота, рады познакомится!`)
        }
        else if(user){
            ctx.reply(`👋 С возвращением, ${ctx.message.from.first_name ? ctx.message.from.first_name : ctx.message.from.last_name}`)
        }
    });


    bot.use(session())
    bot.use(stage.middleware())


    bot.command('info', async(ctx) => {
        const chatId = ctx.chat.id
        const user = await UserModel.findOne({
            where: {
                chatId
            }
        })

        ctx.replyWithHTML(
            `➖➖➖➖➖➖➖<b>Профиль</b>➖➖➖➖➖➖➖\n
         Твой никнейм: ${ctx.from.first_name}\n
         Премиум: ${ctx.from.is_premium ? 'Есть ✔️' : 'Нет ✖️'}\n
 ➖➖➖➖➖➖📊<b>Статистика</b>📊➖➖➖➖➖➖\n
       ✔ Правильных: ${user.right}\n
       ✖ Не правильных: ${user.notRight}\n
       🎮 Всего игр: ${user.right + user.notRight}\n
       💵 Баланс: ${user.balance}\n
🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰🟰`)
    })

    bot.command('log', async(ctx) => {
        const chatId = ctx.message.chat.id
        if(chatId == process.env.ADMIN){
            ctx.reply(`${chatId}`)
            console.log(chatId)
        }
        else{
            ctx.reply('У вас недостаточно прав!')
        }
    })

    bot.command('game', async(ctx) => {
        ctx.scene.enter('startGame')
    })

    bot.command('casino', async(ctx) => {
        ctx.scene.enter('startCasino')
    })

    bot.command('gameslist', async(ctx) => {
        ctx.reply('Список наших игр', gamesMenu)
        bot.action('startGameFromButton', async(ctx) => {
            await ctx.answerCbQuery()
            ctx.scene.enter('startGame')
        })
        bot.action('startCasinoFromButton', async(ctx) => {
            await ctx.answerCbQuery()
            ctx.scene.enter('startCasino')
        })
    })

    bot.launch();
}
    main()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));