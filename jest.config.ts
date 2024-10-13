import type { Config } from 'jest';

const config: Config = {
    verbose: true,
};

export default config;

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    }
};
