/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^date-fns$': '<rootDir>/src/mocks/date-fns.ts',
        '^date-fns/locale$': '<rootDir>/src/mocks/date-fns.ts',
        '@mui/x-date-pickers/(.*)': '<rootDir>/src/mocks/mui-date-pickers.tsx',
    },
    setupFilesAfterEnv: [
        '<rootDir>/src/setupTests.ts'
    ],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    testPathIgnorePatterns: [
        '/node_modules/',
        '/src/hooks/',
        '/src/pages/',
        '/src/components/'
    ],
    testMatch: [
        '**/src/tests/main.test.ts',
        '**/src/tests/components/SimpleComponent.test.tsx',
        '**/src/tests/services/api.test.ts'
    ],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/main.tsx',
        '!src/vite-env.d.ts'
    ],
    coverageThreshold: {
        global: {
            branches: 40,
            functions: 40,
            lines: 40,
            statements: 40
        }
    }
} 