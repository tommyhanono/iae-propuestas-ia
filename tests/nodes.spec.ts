import { test } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { KEYS, REVEAL_MS, VIEWPORTS, assertNode, open, watchErrors } from './helpers'
import { expect } from '@playwright/test'

mkdirSync('tests/screenshots/viewports', { recursive: true })

for (const vp of VIEWPORTS) {
  test.describe(`nodos @ ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } })
    test('los 14 nodos: centrados, completos, sin overflow ni errores', async ({ page }) => {
      const errors = watchErrors(page)
      for (const key of KEYS) {
        test.info().annotations.push({ type: 'nodo', description: key })
        await open(page, key)
        await assertNode(page, key, vp.name)
        if (['lobby', 'bc-5', 'bc-6', 'cu-2', 'cu-5'].includes(key)) {
          await page.screenshot({ path: `tests/screenshots/viewports/${vp.name}-${key}.png` })
        }
      }
      await page.waitForTimeout(REVEAL_MS / 4)
      expect(errors).toEqual([])
    })
  })
}
