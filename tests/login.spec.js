//TESTING 

// Login test
import { test, expect } from '@playwright/test';

// FOR THE PAGE TO LOAD 
test('login page loads correctly', async ({ page }) => {
    //Tests whether the login page loads and displays the correct elements
  await page.goto('http://localhost:5173/login');
    //Checks if the heading "Sign In" is visible on the page /i for case
  await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  //locates with element if email in the web page
  await expect(page.locator('#email')).toBeVisible();
  await expect(page.locator('#password')).toBeVisible();
});

//Empty Form Validation 
test('shows validation when fields empty', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.click('button[type="submit"]');

  // Browser validation prevents submit
  await expect(page.locator('#email')).toBeVisible();
});

//Invalid Login
test('shows alert on invalid login', async ({ page }) => {

  await page.route('http://localhost:5001/api/auth/login', async route => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Invalid email or password'
      })
    });
  });

  await page.goto('http://localhost:5173/login');
  await page.fill('#email', 'wrong@mail.com');
  await page.fill('#password', 'wrongpass');
  const dialogPromise = page.waitForEvent('dialog');
  await page.click('button[type="submit"]');
  const dialog = await dialogPromise;
  expect(dialog.message()).toContain('Invalid email or password');
  await dialog.dismiss();
});


//Successful Login
test('login success redirects to dashboard', async ({ page }) => {

  await page.route('http://localhost:5001/api/auth/login', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        token: 'fake-token',
        _id: '123',
        email: 'test@mail.com',
        fullName: 'Test User',
        role: 'user',
        verificationStatus: 'approved',
        status: 'active'
      })
    });
  });

  await page.goto('http://localhost:5173/login');

  await page.fill('#email', 'test@mail.com');
  await page.fill('#password', '123456');

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/dashboard/);
});


//Admin Redirect
test('admin login redirects to admin dashboard', async ({ page }) => {
  await page.route('http://localhost:5001/api/auth/login', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        token: 'admin-token',
        _id: '999',
        email: 'admin@mail.com',
        fullName: 'Admin',
        role: 'admin',
        verificationStatus: 'approved',
        status: 'active'
      })
    });
  });

  await page.goto('http://localhost:5173/login');
  await page.fill('#email', 'admin@mail.com');
  await page.fill('#password', 'admin123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/admin/);
});
