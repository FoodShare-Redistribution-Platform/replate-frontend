# Replate Frontend Developer Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [About the Project](#about-the-project)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Running Tests](#running-tests)
6. [Compatibility](#compatibility)
7. [Project Structure Overview](#project-structure-overview)
8. [Security Design Notes](#security-design-notes)
9. [Limitations](#limitations)
10. [Project Support](#project-support)
11. [License](#license)

## Introduction

Welcome to the frontend documentation for **FoodShare/Replate**. This application serves as the client-side interface for connecting food donors with NGOs and volunteers, facilitating the efficient redistribution of surplus food. It provides a responsive and interactive user experience for all platform roles: Donors, NGOs, and Volunteers.

## About the Project

Replate is a community-driven platform designed to reduce food waste and help those in need. The frontend is built with modern web technologies to ensure performance, scalability, and ease of maintenance.

### Key Features
*   **Role-Based Access**: Specialized interfaces for Donors (manage donations), NGOs (request food), and Volunteers (pickup & delivery).
*   **Interactive Maps**: Real-time visualization of donation pickup locations using Leaflet.
*   **Responsive Design**: Optimized for both desktop and mobile devices using Tailwind CSS.
*   **Real-time Updates**: Dynamic status tracking for donations and deliveries.

### tech Stack
*   **Framework**: React (v18+) with Vite
*   **Styling**: Tailwind CSS
*   **State Management**: React `useState`, `useEffect`, Context API
*   **Routing**: `react-router-dom`
*   **HTTP Client**: `axios`
*   **Maps**: `react-leaflet`

## Installation

Follow these steps to set up the development environment.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16 or higher)
*   npm or yarn package manager

### Steps
1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd replate-frontend
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory if you need to override defaults:
    ```env
    VITE_API_URL=http://localhost:5001
    ```
    *Default configuration assumes the backend is running on port 5001.*

## Usage

### Development Server
Start the local development server with hot-reloading:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

### Production Build
To create an optimized build for deployment:
```bash
npm run build
```
You can preview the production build locally using:
```bash
npm run preview
```

## Running Tests

The project uses **Playwright** for End-to-End (E2E) testing.

### Setup
Ensure Playwright browsers are installed:
```bash
npx playwright install
```

### Execution
*   **Run All Tests**:
    ```bash
    npx playwright test
    ```
*   **Interactive UI Mode**:
    ```bash
    npx playwright test --ui
    ```
*   **View Report**:
    ```bash
    npx playwright show-report
    ```

### Linting
To check for code quality and style issues:
```bash
npm run lint
```

## Compatibility

*   **Browsers**: Chrome, Firefox, Safari, Edge (Latest versions)
*   **Node.js**: Requires Node.js v16.x or higher for development tools.
*   **OS**: Cross-platform (Windows, macOS, Linux).

## Project Structure Overview

| Directory | Description |
| :--- | :--- |
| `src/api/` | Axios instances and API call functions. |
| `src/assets/` | Static assets like images and logos. |
| `src/components/` | Reusable UI components (Buttons, Modals, Navbars). |
| `src/pages/` | Unique page views (Dashboard, DonateFood, Login). |
| `src/icons/` | Custom icon components (using Lucide React). |
| `src/App.jsx` | Main application component and routing configuration. |
| `src/main.jsx` | Application entry point. |
| `public/` | Public static files (favicon, manifest.json). |
| `tests/` | Playwright E2E test specifications. |

## Security Design Notes

*   **Authentication**: Uses JWT (JSON Web Tokens) stored in `localStorage` (for this demo version) to manage user sessions.
*   **Authorization**: Route protection ensures users can only access pages relevant to their role (Donor, NGO, Volunteer, Admin).
*   **Data Protection**: All API requests to protected endpoints include the Authorization header.

## Limitations

*   **Maps**: Location services rely on loose address matching; integration with a real Geocoding API (like Google Maps API) requires valid API keys in production.
*   **Persistence**: Browser refresh may reset non-persisted local state if not handled by the backend or local storage.

## Project Support

For issues, feature requests, or contributions, please open an issue in the repository or contact the development team.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
