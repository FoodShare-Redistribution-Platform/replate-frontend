import { test, expect } from '@playwright/test';


// Mock Admin Stats APIs 
async function mockAdminAPIs(page) {

  const json = data => ({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(data)
  });

  // Dashboard Stats (CRITICAL)
  await page.route('**/api/admin/stats', route =>
    route.fulfill(json({
      totalUsers: 6,
      donors: 2,
      ngos: 2,
      volunteers: 1,
      donations: 9,
      requests: 9,
      assignments: 8,
      pendingVerifications: 0
    }))
  );
}


// Shared Setup
async function setupAdmin(page) {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'fake-admin-token');
    localStorage.setItem('user', JSON.stringify({
      fullName: 'System Admin',
      role: 'admin'
    }));
  });

  await mockAdminAPIs(page);
}


//  Dashboard Loads
test('admin dashboard loads successfully', async ({ page }) => {

  await setupAdmin(page);
  await page.goto('http://localhost:5173/admin');

  // Greeting Heading 
  await expect(
    page.getByRole('heading', {
      name: /Good (Morning|Afternoon|Evening), System Admin!/
    })
  ).toBeVisible();
});


// Empty API Stability
test('admin dashboard handles empty stats', async ({ page }) => {

  await page.addInitScript(() => {
    localStorage.setItem('token', 'fake-admin-token');
    localStorage.setItem('user', JSON.stringify({
      fullName: 'System Admin',
      role: 'admin'
    }));
  });

  await page.route('**/api/admin/stats', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({})
    })
  );

  await page.goto('http://localhost:5173/admin');

  await expect(
    page.getByRole('heading', {
      name: /Good (Morning|Afternoon|Evening), System Admin!/
    })
  ).toBeVisible();
});
