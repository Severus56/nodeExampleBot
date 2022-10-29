const {Telegraf, Scenes} = require('telegraf')

const startAgeCheck = async ctx =>{
    return await ctx.scene.enter('ageCheck')
}

module.exports = startAgeCheck