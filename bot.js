const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const config = require('./config');

const client = new Client(config.whatsappOptions);

client.on('qr', qr => {
    console.log('📌 Escaneie o QR Code abaixo para conectar:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot conectado com sucesso!');
});

client.initialize();

module.exports = client;
