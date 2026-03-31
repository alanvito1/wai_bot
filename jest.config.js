module.exports = {
  testEnvironment: 'node',
  moduleNameMapper: {
    // Force redirect any import of the real client to our mock
    '../../bot/client': '<rootDir>/src/bot/mockClient.js',
    '^../bot/client$': '<rootDir>/src/bot/mockClient.js'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true
};
