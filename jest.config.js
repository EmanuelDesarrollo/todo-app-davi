/** @type {import('jest').Config} */
module.exports = {
    // Entorno Node — ideal para tests de lógica pura (store, API, repositorio)
    testEnvironment: 'node',

    // Transformar TypeScript con babel-jest usando babel-preset-expo
    transform: {
        '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
    },

    // No ignorar ningún módulo en la transformación (todos pasan por babel)
    transformIgnorePatterns: [],

    // Extensiones a resolver
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

    // Mocks de módulos nativos que no son necesarios en tests de lógica
    moduleNameMapper: {
        '^realm$': '<rootDir>/__mocks__/realm.js',
        '^@realm/react$': '<rootDir>/__mocks__/@realm/react.js',
    },

    // Patrones de búsqueda de tests
    testMatch: [
        '**/__tests__/**/*.(ts|tsx|js)',
        '**/?(*.)+(spec|test).(ts|tsx|js)',
    ],

    // Cobertura de código (solo lógica de negocio)
    collectCoverageFrom: [
        'src/store/**/*.ts',
        'src/api/**/*.ts',
        'src/features/**/data/**/*.ts',
        'src/features/**/viewModel/**/*.ts',
        'src/features/**/model/**/*.ts',
        '!src/**/*.d.ts',
    ],
};
