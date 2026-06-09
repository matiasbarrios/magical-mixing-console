import path from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@magical-mixing/mixers': path.resolve(repoRoot, 'src/mixers'),
            '@magical-mixing/mixers-react': path.resolve(repoRoot, 'src/mixers-react'),
            '@magical-mixing/console': path.resolve(repoRoot, 'src/console'),
            '@magical-mixing/virtual-devices': path.resolve(repoRoot, 'src/virtual-devices'),
        },
    },
    test: {
        environment: 'node',
        setupFiles: ['./tests/setup.js'],
        include: ['tests/**/*.{js,jsx}'],
        exclude: [
            'node_modules/**',
            '.webpack/**',
            'android/**',
            'ios/**',
            'tests/setup.js',
            'tests/helpers/**',
            'tests/**/integration/**',
        ],
    },
});
