const { Client, GatewayIntentBits } = require('discord.js');
const { TOKEN_DISCORD, CHANNELID_DISCORD } = process.env;

class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ]
        });
        // Add channel id
        this.chanelId = CHANNELID_DISCORD;

        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}`);
        });

        // Sử dụng this.client ở đây
        this.client.login(TOKEN_DISCORD);
    }

    sendToFormatCode(logData) {
        const { code, message = 'Information about code', title = 'Code Example' } = logData;
        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt('00ff00', 16),
                    title,
                    description: '```json\n' + JSON.stringify(code, null, 2) + '\n```',
                }
            ]
        };
        this.sendMessage(codeMessage);
    }

    sendMessage(message = 'Message') {
        const channel = this.client.channels.cache.get(this.chanelId);
        if (!channel) {
            console.error(`Couldn't find the channel... `, this.channel);
            return;
        }
        channel.send(message).catch(e => console.error(e));
    }
}

module.exports = new LoggerService();
