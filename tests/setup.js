// Global Setup for Tests
jest.mock('../backend/database', () => ({
    db: { 
        all: jest.fn((sql, params, cb) => cb(null, [])),
        run: jest.fn((sql, params, cb) => cb && cb(null)),
        get: jest.fn((sql, params, cb) => cb(null, null))
    },
    buscarConhecimento: jest.fn((p, cb) => cb(null)),
    buscarStatusSistemas: jest.fn((k, cb) => cb(null)),
    atualizarStatusSistemas: jest.fn()
}));

jest.mock('../backend/routes/stats', () => ({
    registrarMensagem: jest.fn()
}));

jest.mock('../src/api/ia', () => ({
    processarPergunta: jest.fn(() => Promise.resolve("IA Mock Response"))
}));

// Mock console.log to keep test output clean
global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
};
