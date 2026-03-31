const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const config = require('../../config');
const { atualizarStatusSistemas } = require('../../backend/database');

const client = new Client(config.whatsappOptions);

client.on('qr', qr => {
    console.log('📌 QR Code recebido. Gerando imagem...');
    qrcode.generate(qr, { small: true });
    atualizarStatusSistemas('qr', qr);
    atualizarStatusSistemas('status', 'waiting_qr');
});

client.on('ready', () => {
    console.log('✅ Bot conectado e pronto para uso!');
    atualizarStatusSistemas('status', 'connected');
    atualizarStatusSistemas('qr', ''); // Limpa o QR após conectar
});

client.on('auth_failure', msg => {
    console.error('❌ Falha na autenticação:', msg);
});

console.log('🚀 Inicializando cliente WhatsApp (pode demorar alguns segundos)...');
client.initialize().catch(err => {
    console.error('❌ Erro fatal ao inicializar cliente:', err);
});

module.exports = client;
