module.exports = {
  verbose: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  testMatch: ['<rootDir>/test/**/*.test.ts?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  setupFiles: ['<rootDir>/test/setup.ts'],
  moduleNameMapper: {
    '\\.(css|scss|)$': 'identity-obj-proxy',
  },
};
