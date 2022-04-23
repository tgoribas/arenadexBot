/**
 * Arquivo index.js
 * Arquivo do Bot ArenaDex
 *
 * @author    Tiago Ribas <tgoribas@gmail.com>
 * @copyright 2021-2022 Bot ArenaDex
 * @version   1.1.2 (22/04/2022)
 */

// Variaveis de Ambiente
require ('dotenv').config()
const ENV = {
    'ARENA_URL'   : process.env.ARENA_URL,
    'ARENA_TOKEN' : process.env.ARENA_TOKEN,
    'BOT_TOKEN'   : process.env.BOT_TOKEN
}

// Discord.Js
const Discord = require("discord.js");
const client = new Discord.Client();
client.login(ENV.BOT_TOKEN);

// Comando 'share'
const share = require('./src/share');

const prefix = "!";
  
client.on("message", function (message) {

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
  
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
  
    //Aqui tudo começa!                
    if (command === "arenadex") {

        const action = args[0].split('\n', 1);
        console.log("Action..." + action)

        if (action == "share") {

            const arenaDeck = {
                'deck'       : commandBody.replace('arenadex share', '').substring(1),
                'encodedeck' : encodeURI(commandBody.replace('arenadex share', '').substring(1))
            }
            share(ENV, message, arenaDeck);

        } else if (action == "test") {
            const timeTaken = Date.now() - message.createdTimestamp;
            message.reply(`Teste! This message had a latency of ${timeTaken}ms.`);
        }
    }
});