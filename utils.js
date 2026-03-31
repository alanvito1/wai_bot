const client = require('./bot');

async function sendMessage(userId, message) {
    console.log(`🚀 Enviando mensagem para ${userId}: ${message}`);
    try {
        await client.sendMessage(userId, message);
        console.log(`✅ Mensagem enviada para ${userId}`);
    } catch (error) {
        console.error(`❌ Erro ao enviar mensagem para ${userId}:`, error);
    }
}

module.exports = { sendMessage };
