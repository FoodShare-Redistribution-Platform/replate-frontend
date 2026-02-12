import { test, expect } from '@playwright/test';

// Mock Logged-in User
async function mockUser(page) {
  await page.route('http://localhost:5001/api/users/me', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        fullName: 'NGO User',
        role: 'ngo'
      })
    })
  );
}

// Mock Available Donations
async function mockDonations(page) {
  const futureTime = new Date(Date.now() + 5 * 60 * 60 * 1000); // +5 hrs

  await page.route('http://localhost:5001/api/donations/available', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: [
          {
            _id: '1',
            foodName: 'Rice Meal',
            foodType: 'Cooked Meals',
            quantity: 10,
            unit: 'servings',
            estimatedServings: 20,
            city: 'Trivandrum',
            expiryDate: futureTime.toISOString().split('T')[0],
            expiryTime: futureTime.toTimeString().slice(0, 5),
            dietaryTags: ['Vegetarian']
          }
        ]
      })
    })
  );
}


// Page Load Test
test('available food page loads correctly', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'fake-token');
  });

  await mockUser(page);
  await mockDonations(page);

  await page.goto('http://localhost:5173/available-food');

  await expect(page.getByRole('heading', { name: 'Available Food' })).toBeVisible();
});


// Donations Render
test('donations render correctly', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'fake-token');
  });

  await mockUser(page);
  await mockDonations(page);

  await page.goto('http://localhost:5173/available-food');

  await expect(page.locator('.donation-card')).toHaveCount(1);
  await expect(page.locator('text=Rice Meal')).toBeVisible();
});


// Search Works
test('search filters donations', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'fake-token');
  });

  await mockUser(page);
  await mockDonations(page);

  await page.goto('http://localhost:5173/available-food');

  await page.fill('input[placeholder*="Search"]', 'Rice');

  await expect(page.locator('.donation-card')).toHaveCount(1);

  await page.fill('input[placeholder*="Search"]', 'Pizza');

  await expect(page.locator('.donation-card')).toHaveCount(0);
});


// Filter Works
test('filter dropdown filters food type', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'fake-token');
  });

  await mockUser(page);
  await mockDonations(page);

  await page.goto('http://localhost:5173/available-food');

  await page.selectOption('.filter-dropdown', 'Cooked Meals');

  await expect(page.locator('.donation-card')).toHaveCount(1);

  await page.selectOption('.filter-dropdown', 'Beverages');

  await expect(page.locator('.donation-card')).toHaveCount(0);
});


// Empty State
test('empty state shown when no donations', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'fake-token');
  });

  await mockUser(page);

  await page.route('http://localhost:5001/api/donations/available', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: []
      })
    })
  );

  await page.goto('http://localhost:5173/available-food');

  await expect(page.locator('.empty-state')).toBeVisible();
});
