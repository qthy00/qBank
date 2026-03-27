import { vi } from 'vitest'

// Mock canvas
vi.mock('canvas', () => ({
  default: {}
}))

// Mock crypto for UUID generation - jsdom doesn't have crypto by default
if (typeof global.crypto === 'undefined') {
  Object.defineProperty(global, 'crypto', {
    value: {
      randomUUID: vi.fn(() => '10000000-1000-4000-8000-100000000000'),
      getRandomValues: vi.fn((arr) => arr)
    },
    writable: true,
    configurable: true
  })
}

