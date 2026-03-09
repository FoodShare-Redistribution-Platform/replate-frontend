# Frontend Testing Guide

This document details the End-to-End (E2E) testing strategy for the Replate Frontend, implemented using [Playwright](https://playwright.dev/).

## 🧪 Overview

Our tests focus on critical user flows, verifying that the interface behaves correctly under various conditions (success, error, empty states) by mocking backend responses. This ensures the frontend can be tested in isolation without relying on a running backend server.

## 📥 Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Install Playwright Browsers**:
    ```bash
    npx playwright install
    ```

## 🚀 Running Tests

### Run All Tests (Headless)
Executes all test files in the background and reports results.
```bash
npx playwright test
```

### Run with UI (Interactive)
Opens the Playwright UI to see tests running, time travel through steps, and inspect elements.
```bash
npx playwright test --ui
```

### View Report
Generates and opens a detailed HTML report of the last test run.
```bash
npx playwright show-report
```

## 📂 Test Suites

Tests are located in the `tests/` directory.

### 1. Authentication (`login.spec.js`)
Verifies the login lifecycle and security features.

| Test Case | Description |
| :--- | :--- |
| **Page Load** | Checks if the login form and "Sign In" heading render correctly. |
| **Validation** | Ensures error messages appear for empty fields. |
| **Invalid Login** | Verifies that an alert is shown for incorrect credentials (mocked 401 response). |
| **Success Redirect** | Confirms valid login redirects to `/dashboard` (mocked 200 response). |
| **Admin Redirect** | Confirms admin login redirects specifically to `/admin`. |

### 2. Dashboard (`dashboard.spec.js`)
Tests the main landing page after login, checking for role-specific dynamic content.

| Test Case | Description |
| :--- | :--- |
| **User Greeting** | Verifies the user's name and greeting (Good Morning/Evening) logic. |
| **Donor View** | Checks for "My Donations" section availability. |
| **NGO View** | Checks for "Available Food" and "My Requests" sections. |
| **Volunteer View** | Checks for "Available Assignments" section. |
| **Navigation** | Verifies buttons (e.g., "Donate Food") navigate to the correct pages. |

### 3. Available Food (`availableFood.spec.js`)
Tests the NGO's view for finding donations.

| Test Case | Description |
| :--- | :--- |
| **Rendering** | Verifies donation cards are displayed based on API data. |
| **Search** | Tests real-time filtering by food name (e.g., Searching "Rice"). |
| **Filter** | Tests filtering by category (e.g., "Cooked Meals"). |
| **Empty State** | Verifies variables specifically when no donations are returned from the API. |

### 4. Admin Dashboard (`adminDashboard.spec.js`)
Tests the system administrator's overview.

| Test Case | Description |
| :--- | :--- |
| **Stats Loading** | Verifies dashboard loads even if stats API returns empty data. |
| **Rendering** | Checks for admin-specific greetings and layout elements. |

## 🛠️ Mocking Strategy

These tests use **Network/API Mocking** (`page.route`).
-   Tests **do not** hit the real backend.
-   We intercept requests to `http://localhost:5001/api/*` and return fake JSON data.
-   This allows testing edge cases (like server errors or specific data shapes) deterministically.

**Example Mock:**
```javascript
await page.route('**/api/auth/login', async route => {
  await route.fulfill({
    status: 200,
    body: JSON.stringify({ token: 'fake-token', role: 'donor' })
  });
});
```
