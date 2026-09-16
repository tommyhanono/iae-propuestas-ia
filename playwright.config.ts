import { defineConfig } from '@playwright/test'

const BASE_URL = process.env.BASE_URL

export default defineConfig({
  testDir: 'tests',
  timeout: 240_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  workers: 4,
  reporter: [['list'], ['json', { outputFile: 'tests/results.json' }]],
  use: {
    baseURL: BASE_URL ?? 'http://localhost:4173',
    browserName: 'chromium',
  },
  webServer: BASE_URL
    ? undefined
    : {
        command: 'npm run build && npx vite preview --port 4173 --strictPort',
        url: 'http://localhost:4173',
        reuseExistingServer: true,
        timeout: 120_000,
      },
})
