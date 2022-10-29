const {Scenes} = require("telegraf");
const {gameOptions, againGameOptions} = require('../Buttons/options');
const startGameScene = new Scenes.BaseScene('startGame');
const chats = {};
const UserModel = require('../DB/models')
const {json} = require("sequelize");

const startGameFunction = async(ctx,chatId) =>{
    await ctx.reply('Я загадываю число от 0 до 9, а ты его отгадываешь!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await ctx.reply('Начинаем', gameOptions);
    console.log(`Следующее число: ${chats[chatId]}`)
}


startGameScene.enter(async(ctx) => {
    const chatId = ctx.chat.id
    startGameFunction(ctx,chatId)
})
startGameScene.on('callback_query', async (ctx) => {
    const data = ctx.update.callback_query.data;
    const chatId = ctx.chat.id
    const user = await UserModel.findOne({
        where: {
            chatId
        }
    })
    if(data === '/again'){
        return startGameFunction(ctx, chatId)
    }
    if(data == chats[chatId]){
        user.right += 1;
        await ctx.reply(`Верно! Я загадал число ${chats[chatId]}`, againGameOptions)
        setTimeout(() => ctx.scene.leave(),3000)
    }
    else {
        user.notRight += 1;
        await ctx.reply(`Не правильно, я загадал цифру ${chats[chatId]}`, againGameOptions)
        setTimeout(() => ctx.scene.leave(),3000)
    }
    await user.save();
})

module.exports = startGameScene