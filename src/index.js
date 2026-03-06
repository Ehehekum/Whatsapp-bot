const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs-extra');
const pino = require('pino');
const chalk = require('chalk');
const path = require('path');
const axios = require('axios');

// Import command handlers
const aiCommands = require('./src/commands/ai');
const downloaderCommands = require('./src/commands/downloader');
const toolCommands = require('./src/commands/tools');
const funCommands = require('./src/commands/fun');

// Config
const config = JSON.parse(fs.readFileSync('./config.json'));

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: !config.pairingNumber,
        logger: pino({ level: 'silent' }),
        browser: ['Ubuntu', 'Chrome', '20.0.04']
    });

    // Pairing code jika nomor diisi
    if (config.pairingNumber && !sock.authState.creds.registered) {
        setTimeout(async () => {
            const code = await sock.requestPairingCode(config.pairingNumber);
            console.log(chalk.green(`Pairing Code: ${code}`));
        }, 3000);
    }

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error = Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log(chalk.green('Bot Connected!'));
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // Message handler
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];
        if (!m.message || m.key.fromMe) return;

        const from = m.key.remoteJid;
        const type = Object.keys(m.message)[0];
        const body = type === 'conversation' ? m.message.conversation :
                    type === 'imageMessage' ? m.message.imageMessage.caption :
                    type === 'videoMessage' ? m.message.videoMessage.caption : '';
        
        const prefix = config.prefix;
        if (!body.startsWith(prefix)) return;

        const args = body.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        const text = args.join(' ');
        const isMedia = type === 'imageMessage' || type === 'videoMessage';

        // Handle commands
        try {
            if (aiCommands[command]) {
                await aiCommands[command](sock, from, text, m);
            } else if (downloaderCommands[command]) {
                await downloaderCommands[command](sock, from, text, m);
            } else if (toolCommands[command]) {
                if (isMedia) {
                    await toolCommands[command](sock, from, m, text);
                } else {
                    await toolCommands[command](sock, from, text, m);
                }
            } else if (funCommands[command]) {
                await funCommands[command](sock, from, text, m);
            }
        } catch (error) {
            console.error(error);
            await sock.sendMessage(from, { text: 'Error: ' + error.message });
        }
    });
}

startBot();
