const mockClient = require('../../bot/mockClient');

// Global Mocks for all logic tests
jest.mock('../../bot/client', () => require('../../bot/mockClient'));
jest.mock('../../backend/database', () => ({
    db: { 
        all: jest.fn((sql, params, cb) => cb(null, [])),
        run: jest.fn((sql, params, cb) => cb && cb(null)),
        get: jest.fn((sql, params, cb) => cb(null, null))
    },
    buscarConhecimento: jest.fn((p, cb) => cb(null)),
    buscarStatusSistemas: jest.fn((k, cb) => cb(null)),
    atualizarStatusSistemas: jest.fn()
}));
jest.mock('../../backend/routes/stats', () => ({
    registrarMensagem: jest.fn()
}));
jest.mock('../../api/ia', () => ({
    processarPergunta: jest.fn(() => Promise.resolve("IA Mock Response"))
}));

const { processarMensagem, userSteps } = require('../interacao');

describe('Bot Interaction Logic (Fixed Strings)', () => {
    const userId = '554198456192@c.us';
    
    const mockMsg = (from, body) => ({
        from,
        body,
        fromMe: false,
        isStatus: false,
        hasMedia: false,
        type: 'chat',
        getChat: async () => ({ 
            id: from, 
            sendStateTyping: jest.fn(), 
            clearState: jest.fn(), 
            sendMessage: jest.fn() 
        }),
        getChatById: async () => ({ 
            id: from, 
            sendStateTyping: jest.fn(), 
            clearState: jest.fn(), 
            sendMessage: jest.fn() 
        }),
        reply: async (msg) => mockClient.sendMessage(from, msg)
    });

    beforeEach(() => {
        jest.clearAllMocks();
        mockClient.clearMessages();
        for (const key in userSteps) delete userSteps[key];
    });

    it('Should respond with Welcome Menu on first interaction', async () => {
        await processarMensagem(mockMsg(userId, 'Ola'));
        expect(mockClient.messages.length).toBeGreaterThan(0);
        expect(mockClient.messages[0].body).toContain('Assistente Virtual do Alan');
    });

    it('Should enter simulation loop on "1"', async () => {
        userSteps[userId] = { etapa: 'menu_principal' };
        await processarMensagem(mockMsg(userId, '1'));
        
        // Verifica se a primeira pergunta da simulação foi enviada
        expect(mockClient.messages.some(m => m.body.includes('qual é o seu *nome*?'))).toBe(true);
    });

    it('Should capture name and ask for type', async () => {
        // Simular o estado exato onde o bot acabou de perguntar o nome
        userSteps[userId] = { etapa: 'simulacao_inicio' }; // Gatilho de início
        
        // Em interacao.js, o gatilho "1" ou "simular" chama processarSimulacao
        // que coloca o usuário em "introducao" (pergunta nome)
        await processarMensagem(mockMsg(userId, 'simular'));
        mockClient.clearMessages();
        
        // Agora envia o nome
        await processarMensagem(mockMsg(userId, 'Alan Vito'));
        
        expect(mockClient.messages.some(m => m.body.includes('O que você quer conquistar?'))).toBe(true);
        expect(mockClient.messages.some(m => m.body.includes('Alan Vito'))).toBe(true);
    });
});
