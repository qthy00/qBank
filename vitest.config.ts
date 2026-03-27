import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80
      },
      exclude: [
        'node_modules/',
        '.nuxt/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mock/**',
        '**/types/**',
        '**/assets/**',
        '**/public/**',
        '**/coverage/**',
        '**/*.spec.ts',
        '**/*.test.ts',
        'tests/setup.ts'
      ]
    },
    include: [
      'tests/**/*.{test,spec}.{js,ts}'
    ],
    exclude: [
      'node_modules',
      '.nuxt',
      'dist',
      '.output'
    ]
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './app'),
      '@': path.resolve(__dirname, './app')
    }
  }
})
