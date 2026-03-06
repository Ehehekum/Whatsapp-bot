const axios = require('axios');
const config = JSON.parse(require('fs').readFileSync('./config.json'));

const aiCommands = {
    // AI Text Generation
    'gpt': async (sock, from, text, m) => {
        if (!text) return await sock.sendMessage(from, { text: 'Masukkan teksnya!' });
        const res = await axios.get(`${config.apiUrl}/ai/chatgpt?text=${encodeURIComponent(text)}`);
        await sock.sendMessage(from, { text: res.data.result });
    },
    
    'claude': async (sock, from, text) => {
        if (!text) return await sock.sendMessage(from, { text: 'Masukkan teksnya!' });
        const res = await axios.get(`${config.apiUrl}/ai/claude?text=${encodeURIComponent(text)}`);
        await sock.sendMessage(from, { text: res.data.result });
    },
    
    'gemini': async (sock, from, text) => {
        if (!text) return await sock.sendMessage(from, { text: 'Masukkan teksnya!' });
        const res = await axios.get(`${config.apiUrl}/ai/gemini?text=${encodeURIComponent(text)}`);
        await sock.sendMessage(from, { text: res.data.result });
    },
    
    'deepseek': async (sock, from, text) => {
        if (!text) return await sock.sendMessage(from, { text: 'Masukkan teksnya!' });
        const res = await axios.get(`${config.apiUrl}/ai/deepseek?text=${encodeURIComponent(text)}`);
        await sock.sendMessage(from, { text: res.data.result });
    },
    
    // Image Generation
    'flux': async (sock, from, text, m) => {
        if (!text) return await sock.sendMessage(from, { text: 'Masukkan promptnya!' });
        const res = await axios.get(`${config.apiUrl}/ai/v1/flux?prompt=${encodeURIComponent(text)}`, {
            responseType: 'arraybuffer'
        });
        await sock.sendMessage(from, { 
            image: Buffer.from(res.data),
            caption: `🎨 Flux: ${text}`
        });
    },
    
    'deepimg': async (sock, from, text) => {
        if (!text) return await sock.sendMessage(from, { text: 'Masukkan promptnya!' });
        const res = await axios.get(`${config.apiUrl}/ai/deepimg?prompt=${encodeURIComponent(text)}`, {
            responseType: 'arraybuffer'
        });
        await sock.sendMessage(from, { 
            image: Buffer.from(res.data),
            caption: `🎨 DeepImg: ${text}`
        });
    },
    
    // Special: GPT Image Edit
    'gptedit': async (sock, from, m, text) => {
        if (!m.message.imageMessage) {
            return await sock.sendMessage(from, { text: 'Kirim foto dengan caption .gptedit deskripsi' });
        }
        
        const media = await m.download();
        const buffer = Buffer.from(media);
        const base64 = buffer.toString('base64');
        
        const res = await axios.post(`${config.apiUrl}/ai/gptimage`, {
            image: base64,
            prompt: text
        });
        
        if (res.data.image) {
            await sock.sendMessage(from, { 
                image: Buffer.from(res.data.image, 'base64'),
                caption: '✅ Hasil edit:'
            });
        }
    },
    
    // TTS
    'tts': async (sock, from, text) => {
        if (!text) return await sock.sendMessage(from, { text: 'Masukkan teksnya!' });
        const res = await axios.get(`${config.apiUrl}/ai/gemini-tts?text=${encodeURIComponent(text)}`, {
            responseType: 'arraybuffer'
        });
        await sock.sendMessage(from, { 
            audio: Buffer.from(res.data),
            mimetype: 'audio/mp4',
            ptt: true
        });
    },
    
    // Fun AI
    'grammar': async (sock, from, text) => {
        if (!text) return await sock.sendMessage(from, { text: 'Masukkan teksnya!' });
        const res = await axios.get(`${config.apiUrl}/ai/grammarcheck?text=${encodeURIComponent(text)}`);
        await sock.sendMessage(from, { text: res.data.result });
    }
};

module.exports = aiCommands;
