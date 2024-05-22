const {Client,GatewayIntentBits} = require('discord.js')

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,

    ]
})
client.on('ready',()=> {
    console.log(`logged is as ${client.user.tag}`);
})
const token = "MTI0MjQ5MzA0ODAzNDgyMDE3OA.GeRbSC.tFr4OCx6QMwSJmJZlK1DFL8kDv4ZrnX4rqv_6Q"
client.login(token)

client.on('messageCreate', msg => {
    if(msg.author.bot) return
    if(msg.content == "hello") {
        msg.reply(`Chào mừng đến với Tứ Đại Ngu`)
    }
})