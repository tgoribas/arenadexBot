/**
 * Arquivo index.js
 * Arquivo do Bot ArenaDex
 *
 * @author    Tiago Ribas <tgoribas@gmail.com>
 * @copyright 2021-2022 Bot ArenaDex
 * @version   2.1.0 (22/04/2022)
 */
const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();


const prefix = "!";
 
client.on("message", function (message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
 
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
 
    //Aqui tudo começa!                
    if (command === "arenadex") {
 
        // console.log("Bot Beta - Puppeteer")
        const action = args[0].split('\n', 1);
        const deck = commandBody.replace('arenadex share', '').substring(1);
        const encodedeck = encodeURI(deck);
        console.log("Action..." + action)
        console.log(`URL: ${config.ARENA_URL}/api/deckshare/?deck=${encodedeck}&token=${config.ARENA_TOKEN}`)

        if (action == "share") {

            console.log('#####################');

            /** PUPPETEER TESTE */
            const pptr = require('puppeteer');
            (async () => {
                const browser = await pptr.launch({ args: ['--no-sandbox'] });
                console.log(`browser.version` + await browser.version());
                const page = await browser.newPage();
                await page.goto(`${config.ARENA_URL}/api/deckimage/?deck=${code_json.codeDeck}&token=${config.ARENA_TOKEN}`);
                await browser.close();
            })();

            console.log("Deck Length..." + deck.length)
            if (deck.length > 20) {
 
                /** NODE_FETCH
                * Envia o deck para a API e cria um novo deck
                */
                const fetch = require('node-fetch');
                let status;
                fetch(`${config.ARENA_URL}/api/deckshare/?deck=${encodedeck}&token=${config.ARENA_TOKEN}`)
                    .then(res => {
                        status = res.status;
                        return res.text()
                    })
                     .then(text => {
                         /**
                          * Cria um JSON 'code_json'
                          * JSON.parse -> Pega a o resultado da requisição e transforma em JSON
                          * text.substring -> Remove a primeira string da variavel para corrigir um bug
                          */
                        //  const code_json = JSON.parse(text.substring(1));
                        const code_json = JSON.parse(text);
                        console.log(code_json)
 
                        //code==13, Sucesso na solicitação do deck
                        if (code_json.code === "13") {
 
                            //Verifica que code_deck
                            if (code_json.location != "") {
 
                                message.reply(`\n **Deck:** <${code_json.location}/>`);
                                console.log("v3. Inicio Puppeteer..." + (Date.now() - message.createdTimestamp) + "ms")
                                message.reply('⌛ *Carregando Imagem...*').then(msg => {

                                    console.log('Dentro Reply')
                                    //Puppeteer faz o Screenshot do deck
                                    // const puppeteer = require('puppeteer')
                                    // const pptr = require('puppeteer');
                                    // console.log(puppeteer);

                                    const takeScreenshot = async (url) => {

                                        console.log(`${config.ARENA_URL}/api/deckimage/?deck=${code_json.codeDeck}&token=${config.ARENA_TOKEN}`)

                                        console.log('Screenshot');
                                        // const browser = await pptr.launch({ args: ['--no-sandbox'] });
                                        const browser = await pptr.launch({
                                            pipe: true, // connect to browser via pipe rather than WebSocket, per docs
                                            args: [
                                            '--disable-gpu',
                                            '--no-sandbox',
                                            '--disable-extensions'
                                            ]
                                        });
                                        // browser = await chromium.launch({
                                        //     args: ["--disable-gpu"]
                                        //   });
                                        // console.log(browser);
                                        const page = await browser.newPage();
                                        console.log('New Page');  
                                        const options = {
                                            path: 'img/' + code_json.code_deck + '.jpg',
                                            type: 'jpeg',
                                            fullPage: true
                                        }
                                        console.log('Antes Goto');
                                        await page.goto(url);
                                        console.log('GOTO');
                                        await page.evaluateHandle('document.fonts.ready');
                                        await page.screenshot(options)
                                        await browser.close();
                                        console.log("Browser Close..." + (Date.now() - message.createdTimestamp) + "ms")
                                        //Verifica se o arquivo de imagem existe.
                                        var fs = require('fs');
                                        var filePath = 'img/' + code_json.code_deck + '.jpg';

                                        try {
                                            if (fs.existsSync(filePath)) {

                                                if (message.reply(`\n`, { files: ['img/' + code_json.code_deck + '.jpg'] })) {
 
                                                    console.log("Imagem Postada..." + (Date.now() - message.createdTimestamp) + "ms")
                                                    msg.delete();
 
                                                    //Função para deletar a foto.
                                                    setTimeout(function () {
                                                        fs.unlink(filePath, (err) => {
                                                            if (err) {
                                                                console.error(err)
                                                                return
                                                            } else {
                                                                console.log("Imagem deletada..." + (Date.now() - message.createdTimestamp) + "ms")
                                                            }
                                                         });
 
                                                    }, 7000);
                                                    //Fim setTimeout
                                                }
                                            }
                                        } catch (err) {
                                            //Imagem não existe
                                            console.error(err)
                                            message.reply(`Desculpe tivemos um problema de salvar a imagem do seu Deck.`);
                                        }
                                    }
                                    takeScreenshot(`${config.ARENA_URL}/api/deckimage/?deck=${code_json.codeDeck}&token=${config.ARENA_TOKEN}`);
                                })
                                console.log('Teste...')
                            }
                        } else if (code_json.code === "1") {
                            // codigo 1, Error
                            message.reply(`Opss.... ${code_json.alert}`);
                        } else {
                            message.reply(`Opss.... Tivemos um erro inesperado ao processar seu deck. `);
                        }
                    }) //Fim .then->text
                    .catch(function(error) {
                        message.reply(`😱 Desculpe! Tivemos problemas para processar seu deck.`);
                        console.log('Erro ao fazer o FETCH: ' + error.message);
                    })
            //Else deck.length>20    
            } else {
                message.reply(`Opss.... Parece que seu Deck e invalido`)
            }
        } else if (action == "test") {
            const timeTaken = Date.now() - message.createdTimestamp;
            message.reply(`Teste! This message had a latency of ${timeTaken}ms.`);
        }
    }//Fim (command === "arenadex")
});

client.login(config.BOT_TOKEN);