import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('root redirects to the English site', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveURL(/\/en$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })

  test('Arabic site is right-to-left', async ({ page }) => {
    await page.goto('http://localhost:3000/ar')
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  })
})
