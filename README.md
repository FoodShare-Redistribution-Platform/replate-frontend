# Replate Frontend Developer Documentation

This repository contains the frontend application for FoodShare/Replate, a platform connecting food donors with NGOs and volunteers. The application is built with React, Vite, and Tailwind CSS.

## 🏗️ Architecture

The application is structured around a component-based architecture using React functional components and hooks.

-   **State Management**: React `useState`, `useEffect`, and Context API for global state (Auth).
-   **Routing**: `react-router-dom` for client-side navigation.
-   **API Integration**: `axios` for HTTP requests to the backend.
-   **Styling**: Utility-first CSS with `Tailwind CSS`.

## 🛠️ Technology Stack

-   **Framework**: React (v18+)
-   **Build Tool**: Vite (Fast, optimized bundler)
-   **Styling**: Tailwind CSS
-   **Maps**: Leaflet / React-Leaflet (Interactive maps)
-   **Icons**: Lucide React
-   **Linting**: ESLint

## 📋 Prerequisites

-   [Node.js](https://nodejs.org/) installed (v16+)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd replate-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

(Optional) If you need to point to a custom backend URL (e.g., production), create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:5001
```

*Note: Default configuration assumes backend running on `http://localhost:5001`.*

### 4. Running the Development Server

Start the local server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### 5. Deployment Build

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## 📂 Project Structure

| Directory | Purpose |
| :--- | :--- |
| `src/api/` | API integration logic (`axios` instances) |
| `src/assets/` | Static assets (Images, Logos) |
| `src/components/` | Reusable UI components (Buttons, Modals, navbars) |
| `src/pages/` | Unique page views (Dashboard, Profile, Login) |
| `src/icons/` | Custom icon components |
| `src/App.jsx` | Main application component & Routing setup |
| `src/main.jsx` | Application entry point |
| `public/` | Public static files (favicon, manifest) |

## 🌟 Key Features & Pages

### Authentication
-   **Login/Register**: Secure access for Donors, Volunteers, and NGOs (`pages/Login.jsx`, `pages/Register.jsx`).

### Dashboard (`pages/Dashboard.jsx`)
-   **Overview**: Summary of user activity.
-   **Statistics**: Visual representation of contributions.

### For Donors
-   **Donate Food** (`pages/DonateFood.jsx`): Form to list available food items.
-   **My Donations** (`pages/MyDonations.jsx`): History of past donations.

### For NGOs
-   **Available Food** (`pages/AvailableFood.jsx`): List of available donations to request.
-   **My Requests** (`pages/MyRequests.jsx`): Status of requested food items.

### For Volunteers
-   **Volunteer Map** (`pages/VolunteerMap.jsx`): Interactive map showing pickup locations.
-   **My Pickups** (`pages/MyPickups.jsx`): Management of assigned delivery tasks.

### Admin Panel (`pages/admin/`)
-   **User Management**: Oversee all platform users.
-   **System Config**: Platform-wide settings.
-   **Data Verification**: `components/VerificationRequests.jsx` for verifying NGO credentials.

## 🧪 Testing

The project uses [Playwright](https://playwright.dev/) for End-to-End (E2E) testing.

### Test Files
Located in `tests/` directory:
-   `login.spec.js`: Verifies authentication flows.
-   `dashboard.spec.js`: Tests dashboard rendering and navigation.
-   `adminDashboard.spec.js`: Checks admin-specific functionalities.
-   `availableFood.spec.js`: Tests the donation listing page.

### Running Tests

1.  **Install Playwright Browsers** (First time only):

    ```bash
    npx playwright install
    ```

2.  **Run All Tests**:

    ```bash
    npx playwright test
    ```

3.  **Run with UI Mode** (Interactive):

    ```bash
    npx playwright test --ui
    ```

4.  **View Verification Report**:

    ```bash
    npx playwright show-report
    ```

### Linting

To check for code quality issues:

```bash
npm run lint
```

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/NewComponent`)
3.  Commit your changes (`git commit -m 'Add NewComponent'`)
4.  Push to the branch (`git push origin feature/NewComponent`)
5.  Open a Pull Request
