const axios = require('axios');

const funCommands = {
    'menu': async (sock, from) => {
        const menu = `🤖 *NEXRAY BOT MENU* 🤖

*🎨 AI IMAGE*
.flux <prompt> - Flux image gen
.deepimg <prompt> - Deep image gen
.gptedit - Edit foto dengan AI

*🤖 AI TEXT*
.gpt <text>
.claude <text>
.gemini <text>
.deepseek <text>

*🔊 TTS & FUN*
.tts <text> - Text to speech
.grammar <text> - Grammar check

*📥 DOWNLOADER*
.aio <url> - All in one downloader
.ytmp3 <url>
.ytmp4 <url>
.tiktok <url>
.ig <url>
.twitter <url>
.spotify <url>
.terabox <url>
.threads <url>

*🛠️ TOOLS*
.hd - HD foto (reply/kirim foto)
.nsfwcheck - Cek NSFW
.sticker - Buat sticker
.toimage - Sticker ke gambar

✨ Powered by NexRay API`;
        
        await sock.sendMessage(from, { text: menu });
    },
    
    'ping': async (sock, from) => {
        const start = Date.now();
        await sock.sendMessage(from, { text: 'Pong!' });
        const end = Date.now();
        await sock.sendMessage(from, { text: `⏱️ ${end - start}ms` });
    }
};

module.exports = funCommands;
