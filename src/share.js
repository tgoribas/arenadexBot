
const pptr = require('puppeteer');
const fetch = require('node-fetch');

function share(ENV, message, arenaDeck) {

    // console.log("Deck Length..." + arenaDeck.deck.length)
    if (arenaDeck.deck.length > 20) {

        /** NODE_FETCH
        * Envia o deck para a API e cria um novo deck
        */

        let status;
        console.log(`${ENV.ARENA_URL}/api/deckshare/?deck=${arenaDeck.encodedeck}&token=${ENV.ARENA_TOKEN}`);
        fetch(`${ENV.ARENA_URL}/api/deckshare/?deck=${arenaDeck.encodedeck}&token=${ENV.ARENA_TOKEN}`)
            .then(res => {
                status = res.status;
                return res.text()
            })
            .then(text => {
                /**
                 * Cria um JSON 'code_json'
                 * JSON.parse -> Pega a o resultado da requisição e transforma em JSON
                 */

                //  const code_json = JSON.parse(text.substring(1));
                const code_json = JSON.parse(text);

                //code==13, Sucesso.
                if (code_json.code === "13") {

                    //Verifica que code_deck
                    if (code_json.location != "") {

                        message.reply(`\n **Deck:** <${code_json.location}/>`);
                        console.log("Inicio Puppeteer..." + (Date.now() - message.createdTimestamp) + "ms")
                        message.reply('⌛ *Carregando Imagem...*').then(msg => {

                            const takeScreenshot = async (url) => {

                                const browser = await pptr.launch({
                                    pipe: true, // connect to browser via pipe rather than WebSocket, per docs
                                    args: [
                                        '--disable-gpu',
                                        '--no-sandbox',
                                        '--disable-extensions'
                                    ]
                                });

                                const page = await browser.newPage();
                                const options = {
                                    path: 'img/' + code_json.code_deck + '.jpg',
                                    type: 'jpeg',
                                    fullPage: true
                                }
                                await page.goto(url);
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
                            takeScreenshot(`${ENV.ARENA_URL}/api/deckimage/?deck=${code_json.codeDeck}&token=${ENV.ARENA_TOKEN}`);
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
            .catch(function (error) {
                message.reply(`😱 Desculpe! Tivemos problemas para processar seu deck.`);
                console.log('Erro ao fazer o FETCH: ' + error.message);
            })
    } else {
        //Else deck.length>20
        message.reply(`Opss.... Parece que seu Deck e invalido`)
    }
}

module.exports = share;  