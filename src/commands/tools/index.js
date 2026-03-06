const axios = require('axios');
const FormData = require('form-data');
const config = JSON.parse(require('fs').readFileSync('./config.json'));

const toolCommands = {
    'hd': async (sock, from, m, text) => {
        if (!m.message.imageMessage) {
            return await sock.sendMessage(from, { text: 'Kirim foto dengan caption .hd' });
        }
        
        await sock.sendMessage(from, { text: '⏫ Mengupload gambar...' });
        
        // Download media
        const media = await m.download();
        const buffer = Buffer.from(media);
        
        // Upload ke temporary hosting (gunakan 0x0.st atau catbox)
        const form = new FormData();
        form.append('file', buffer, 'image.jpg');
        
        const upload = await axios.post('https://tmp.ninja/api/upload', form, {
            headers: form.getHeaders()
        });
        
        const imageUrl = upload.data.file.url;
        
        await sock.sendMessage(from, { text: '✨ Memproses HD...' });
        
        // Panggil API enhancer
        const res = await axios.get(`${config.apiUrl}/tools/v2/enhancer?url=${encodeURIComponent(imageUrl)}&type=fast`, {
            responseType: 'arraybuffer'
        });
        
        await sock.sendMessage(from, { 
            image: Buffer.from(res.data),
            caption: '✅ Gambar berhasil di-HD!'
        });
    },
    
    'nsfwcheck': async (sock, from, m, text) => {
        if (!m.message.imageMessage) {
            return await sock.sendMessage(from, { text: 'Kirim foto dengan caption .nsfwcheck' });
        }
        
        await sock.sendMessage(from, { text: '⏫ Mengupload gambar...' });
        
        // Download media
        const media = await m.download();
        const buffer = Buffer.from(media);
        
        // Upload ke temporary hosting
        const form = new FormData();
        form.append('file', buffer, 'image.jpg');
        
        const upload = await axios.post('https://tmp.ninja/api/upload', form, {
            headers: form.getHeaders()
        });
        
        const imageUrl = upload.data.file.url;
        
        await sock.sendMessage(from, { text: '🔍 Memeriksa gambar...' });
        
        // Panggil API NSFW checker
        const res = await axios.get(`${config.apiUrl}/tools/nsfw-checker?url=${encodeURIComponent(imageUrl)}`);
        
        const result = res.data.result;
        let message = `🔞 *NSFW Checker*\n\n`;
        message += `Label: ${result.label_name}\n`;
        message += `Confidence: ${(result.confidence * 100).toFixed(2)}%\n`;
        message += `Kesimpulan: ${result.label_name === 'Not Porn' ? '✅ Aman' : '⚠️ NSFW'}`;
        
        await sock.sendMessage(from, { text: message });
    },
    
    'sticker': async (sock, from, m) => {
        if (!m.message.imageMessage) {
            return await sock.sendMessage(from, { text: 'Kirim foto dengan caption .sticker' });
        }
        
        const media = await m.download();
        const buffer = Buffer.from(media);
        
        await sock.sendMessage(from, { 
            sticker: buffer
        });
    },
    
    'toimage': async (sock, from, m) => {
        if (!m.message.stickerMessage) {
            return await sock.sendMessage(from, { text: 'Reply sticker dengan .toimage' });
        }
        
        const media = await m.download();
        const buffer = Buffer.from(media);
        
        await sock.sendMessage(from, { 
            image: buffer,
            caption: '✅ Sticker to image'
        });
    }
};

module.exports = toolCommands;
