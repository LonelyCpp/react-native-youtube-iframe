module.exports = {
  projects: [
    {
      displayName: 'unit',
      testEnvironment: 'jest-environment-node',
      testMatch: ['<rootDir>/__tests__/unit/**/*.test.js'],
      modulePathIgnorePatterns: ['<rootDir>/website/', '<rootDir>/example/'],
    },
    {
      displayName: 'component',
      testEnvironment: 'jest-environment-jsdom',
      testMatch: ['<rootDir>/__tests__/component/**/*.test.js'],
      modulePathIgnorePatterns: ['<rootDir>/website/', '<rootDir>/example/'],
      setupFiles: ['<rootDir>/jest.setup.js'],
      haste: {
        defaultPlatform: 'ios',
        platforms: ['android', 'ios', 'native'],
      },
    },
    {
      displayName: 'iframe',
      testEnvironment: 'jest-environment-jsdom',
      testMatch: ['<rootDir>/__tests__/iframe/**/*.test.js'],
      modulePathIgnorePatterns: ['<rootDir>/website/', '<rootDir>/example/'],
    },
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/WebView.native.js',
    '!src/WebView.web.js',
  ],
};
