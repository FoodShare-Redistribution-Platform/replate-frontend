import { test, expect } from '@playwright/test';


//  Dashboard Page Loads
test('dashboard page loads correctly', async ({ page }) => {
  await page.goto('http://localhost:5173/dashboard');
  await expect(page.locator('.dashboard-page')).toBeVisible();
});




// User Name Displayed
test('displays user full name', async ({ page }) => {

  // Mock localStorage BEFORE page loads
  await page.addInitScript(() => {
    localStorage.setItem('user', JSON.stringify({
      fullName: 'Sanjana',
      role: 'donor'
    }));
  });
  await page.goto('http://localhost:5173/dashboard');
  await expect(page.locator('h1')).toContainText('Sanjana');
});


// Greeting Message
test('displays greeting message', async ({ page }) => {

  await page.addInitScript(() => {
    localStorage.setItem('user', JSON.stringify({
      fullName: 'Sanjana',
      role: 'donor'
    }));
  });

  await page.goto('http://localhost:5173/dashboard');

  await expect(page.locator('h1')).toContainText(/Good/);
});


// Donor Role Content
test('renders donor dashboard content', async ({ page }) => {

  await page.addInitScript(() => {
    localStorage.setItem('user', JSON.stringify({
      fullName: 'Donor User',
      role: 'donor'
    }));
  });

  await page.goto('http://localhost:5173/dashboard');

  await expect(page.getByRole('heading', { name: 'My Donations' })
).toBeVisible();
  await expect(page.getByRole('heading', { name: 'My Donations' })
).toBeVisible();
});


// NGO Role Content
test('renders ngo dashboard content', async ({ page }) => {

  await page.addInitScript(() => {
    localStorage.setItem('user', JSON.stringify({
      fullName: 'NGO User',
      role: 'ngo'
    }));
  });

  await page.goto('http://localhost:5173/dashboard');

  await expect(page.getByRole('heading', { name: 'Available Food' })).toBeVisible();
await expect(page.getByRole('heading', { name: 'My Requests' })).toBeVisible();

});

//Volunteer Role Content
test('renders volunteer dashboard content', async ({ page }) => {

  await page.addInitScript(() => {
    localStorage.setItem('user', JSON.stringify({
      fullName: 'Volunteer User',
      role: 'volunteer'
    }));
  });

  await page.goto('http://localhost:5173/dashboard');

  await expect(page.locator('text=Available Assignments')).toBeVisible();
});

// Navigation Button Works (Donor → Donate Food)
test('donor donate food navigation works', async ({ page }) => {

  await page.addInitScript(() => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({
      fullName: 'Donor User',
      role: 'donor'
    }));
  });

  // Mock user validation API
  await page.route('http://localhost:5001/api/users/me', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        fullName: 'Donor User',
        role: 'donor'
      })
    })
  );

  await page.goto('http://localhost:5173/dashboard');

  await page.getByRole('button', { name: /donate food/i }).click();

  await expect(page).toHaveURL(/donate-food/);
});

