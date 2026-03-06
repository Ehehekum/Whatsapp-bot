const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const readline = require('readline');
const fs = require('fs-extra');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function startPairing() {
    const config = JSON.parse(fs.readFileSync('./config.json'));
    
    rl.question('Masukkan nomor WhatsApp (contoh: 62812xxxx): ', async (phoneNumber) => {
        const { state } = await useMultiFileAuthState('auth_info');
        
        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false
        });

        console.log('Meminta pairing code...');
        
        setTimeout(async () => {
            const code = await sock.requestPairingCode(phoneNumber);
            console.log('\n✅ Pairing Code:', code);
            console.log('Masukkan kode ini di WhatsApp Web\n');
            
            config.pairingNumber = phoneNumber;
            fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
            
            rl.close();
            process.exit(0);
        }, 3000);
    });
}

startPairing();
