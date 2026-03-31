const { test, expect } = require('@playwright/test');

test.describe('Waibot Dashboard E2E', () => {
  test('should load the dashboard and show the main navigation', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Verificar se o título do dashboard está presente
    await expect(page.getByText('📊 Dashboard')).toBeVisible();
    
    // Verificar links de navegação
    await expect(page.getByRole('link', { name: '🔌 Conexão' })).toBeVisible();
    await expect(page.getByRole('link', { name: '📚 Base de Conhecimento' })).toBeVisible();
    await expect(page.getByRole('link', { name: '📋 Leads' })).toBeVisible();
  });

  test('should navigate to Connection page', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    await page.getByRole('link', { name: '🔌 Conexão' }).click();
    
    await expect(page).toHaveURL(/.*connection/);
    await expect(page.getByText('🔌 Conexão do WhatsApp')).toBeVisible();
  });

  test('should navigate to Knowledge Base and see the table', async ({ page }) => {
    await page.goto('http://localhost:3000/knowledge');
    
    await expect(page.getByText('📚 Base de Conhecimento')).toBeVisible();
    // A tabela deve estar presente (mesmo que vazia)
    await expect(page.getByRole('table')).toBeVisible();
  });
});
