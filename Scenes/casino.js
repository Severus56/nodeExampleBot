const {Scenes} = require("telegraf");
const UserModel = require('../DB/models')

const startCasinoScene = new Scenes.BaseScene('startCasino');

const casinoScript = async(ctx,chatId) =>{
    const user = await UserModel.findOne({
        where: {
            chatId
        }
    })
    const randomNumber = Math.floor(Math.random() * 2)
    console.log(`В казино выпадет: ${randomNumber}`)
    await ctx.reply('Введите сумму ставки')
    startCasinoScene.on('message', async (ctx) =>{
        let bet = Number(ctx.message.text)
        try {
            if(user.balance >= bet && randomNumber == 1){
                user.balance += (bet*2)
                await ctx.reply(`Поздравляем! Вы выиграли ${bet*2} монет. Ваш баланс: ${user.balance}`)
                ctx.scene.leave()
            }
            else if(user.balance >= bet && randomNumber == 0){
                user.balance -= bet
                await ctx.reply(`Вы проиграли! Ваш баланс ${user.balance}`)
                ctx.scene.leave()
            }
            else if(user.balance < bet){
                await ctx.reply(`Ваш баланс меньше суммы ставки`)
                ctx.scene.leave()
            }
            await user.save();
        }catch (e) {
            ctx.reply('Произошла какая-то ошибка!')
        }
    })
}

    startCasinoScene.enter(async(ctx) =>{
        const chatId = ctx.chat.id
        casinoScript(ctx,chatId)
    })

module.exports = startCasinoScene