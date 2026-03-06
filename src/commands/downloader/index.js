const axios = require('axios');
const config = JSON.parse(require('fs').readFileSync('./config.json'));

const downloaderCommands = {
    'aio': async (sock, from, text) => {
        if (!text) return await sock.sendMessage(from, { text: 'Masukkan URL!' });
        const res = await axios.get(`${config.apiUrl}/downloader/aio?url=${encodeURIComponent(text)}`);
        
        if (res.data.result.media) {
            // Kirim media berdasarkan tipe
            for (const media of res.data.result.media) {
                if (media.type === 'video') {
                    await sock.sendMessage(from, { 
                        video: { url: media.url },
                        caption: `📹 ${res.data.result.title || 'Video'}`
                    });
                } else if (media.type === 'image') {
                    await sock.sendMessage(from, { 
                        image: { url: media.url },
                        caption: `📸 ${res.data.result.title || 'Image'}`
                    });
                } else if (media.type === 'audio') {
                    await sock.sendMessage(from, { 
                        audio: { url: media.url },
                        mimetype: 'audio/mp4'
                    });
                }
            }
        } else {
            await sock.sendMessage(from, { text: JSON.stringify(res.data.result, null, 2) });
        }
    },
    
    'ytmp3': async (sock, from, text) => {
        if (!text) return await sock.sendMessage(from, { text: 'Masukkan URL YouTube!' });
        const res = await axios.get(`${config.apiUrl}/downloader/v1/ytmp3?url=${encodeURIComponent(text)}`);
        await sock.sendMessage(from, { 
            audio: { url: res.data.result.download },
            mimetype: 'audio/mp4',
            caption: `🎵 ${res.data.result.title}`
        });
    },
    
    'ytmp4': async (sock, from, text) => {
        if (!text) return await sock.sendMessage(from, { text: 'Masukkan URL YouTube!' });
        const res = await axios.get(`${config.apiUrl}/downloader/v1/ytmp4?url=${encodeURIComponent(text)}`);
        await sock.sendMessage(from, { 
            video: { url: res.data.result.download },
            caption: `🎬 ${res.data.result.title}`
        });
    },
    
    'tiktok': async (sock, from, text) => {
        if (!text) return await sock.sendMessage(from, { text: 'Masukkan URL TikTok!' });
        const res = await axios.get(`${config.apiUrl}/downloader/tiktok?url=${encodeURIComponent(text)}`);
        await sock.sendMessage(from, { 
            video: { url: res.data.result.video },
            caption: `🎵 TikTok: ${res.data.result.title || ''}`
        });
    },
    
    'ig': async (sock, from, text) => {
        if (!text) return await sock.sendMessage(from, { text: 'Masukkan URL Instagram!' });
        const res = await axios.get(`${config.apiUrl}/downloader/aio?url=${encodeURIComponent(text)}`);
        const media = res.data.result.media[0];
        if (media.type === 'video') {
            await sock.sendMessage(from, { video: { url: media.url }, caption: '📸 Instagram Video' });
        } else {
            await sock.sendMessage(from, { image: { url: media.url }, caption: '📸 Instagram Photo' });
        }
    },
    
    'twitter': async (sock, from, text) => {
        if (!text) return await sock.sendMessage(from, { text: 'Masukkan URL Twitter!' });
        const res = await axios.get(`${config.apiUrl}/downloader/twitter?url=${encodeURIComponent(text)}`);
        await sock.sendMessage(from, { 
            video: { url: res.data.result.HD || res.data.result.SD },
            caption: '🐦 Twitter Video'
        });
    },
    
    'spotify': async (sock, from, text) => {
        if (!text) return await sock.sendMessage(from, { text: 'Masukkan URL Spotify!' });
        const res = await axios.get(`${config.apiUrl}/downloader/v1/spotify?url=${encodeURIComponent(text)}`);
        await sock.sendMessage(from, { 
            audio: { url: res.data.result.download },
            mimetype: 'audio/mp4',
            caption: `🎵 ${res.data.result.title} - ${res.data.result.artist}`
        });
    },
    
    'terabox': async (sock, from, text) => {
        if (!text) return await sock.sendMessage(from, { text: 'Masukkan URL Terabox!' });
        const res = await axios.get(`${config.apiUrl}/downloader/terabox?url=${encodeURIComponent(text)}`);
        await sock.sendMessage(from, { 
            document: { url: res.data.result.download },
            fileName: res.data.result.filename,
            mimetype: 'application/octet-stream'
        });
    },
    
    'threads': async (sock, from, text) => {
        if (!text) return await sock.sendMessage(from, { text: 'Masukkan URL Threads!' });
        const res = await axios.get(`${config.apiUrl}/downloader/threads?url=${encodeURIComponent(text)}`);
        await sock.sendMessage(from, { 
            video: { url: res.data.result.video },
            caption: '🧵 Threads Video'
        });
    }
};

module.exports = downloaderCommands;
