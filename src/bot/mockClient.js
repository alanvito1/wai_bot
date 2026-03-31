const EventEmitter = require('events');

class MockClient extends EventEmitter {
    constructor() {
        super();
        this.messages = [];
    }

    async initialize() {
        console.log('🧪 [MockBot] Inicializando cliente simulado...');
        setTimeout(() => this.emit('ready'), 500);
    }

    async sendMessage(to, body) {
        console.log(`🧪 [MockBot] Enviando mensagem para ${to}: ${body}`);
        this.messages.push({ to, body, timestamp: new Date() });
        return { id: { _serialized: `mock_${Date.now()}` } };
    }

    // Método auxiliar para simular recebimento de mensagem nos testes
    async simulateIncomingMessage(from, body) {
        console.log(`🧪 [MockBot] Simulando mensagem de ${from}: ${body}`);
        const message = {
            from,
            body,
            fromMe: false,
            isStatus: false,
            timestamp: Math.floor(Date.now() / 1000),
            type: 'chat',
            getChat: async () => ({ id: from }),
            reply: async (text) => this.sendMessage(from, text)
        };
        this.emit('message', message);
    }

    // Limpar histórico de mensagens para o próximo teste
    clearMessages() {
        this.messages = [];
    }
}

module.exports = new MockClient();
