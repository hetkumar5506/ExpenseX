# ExpenseX Frontend - AI-Powered Expense Tracker UI

Welcome to the frontend for **ExpenseX**, a modern, feature-rich React application designed to provide a seamless user experience for the AI-powered expense tracking platform. This interface is built with a focus on responsiveness, interactivity, and a clean, user-friendly design.

 
*(Note: Replace the URL above with a real screenshot of your dashboard for maximum impact!)*

---

## 🎯 Project Goal

To build a complete, production-ready user interface using React that perfectly complements the powerful backend. The goal was to create an intuitive and visually appealing application that showcases all of the backend's AI and data management features, including dynamic charts, real-time notifications, and comprehensive settings management.

---

## 🧩 Tech Stack

- **Framework/Library:** React (with Create React App)
- **Routing:** React Router DOM
- **HTTP Client:** Axios (with interceptors for JWT authentication & error handling)
- **Styling:** Plain CSS with CSS Variables for theming (Light/Dark mode)
- **Animations:** Framer Motion
- **Charting:** Chart.js with `react-chartjs-2`
- **Icons:** React Icons
- **File Downloads:** `file-saver`

---

## ✨ Core Features

This frontend application implements the full suite of features provided by the ExpenseX API:

*   **Professional Landing Page:** A beautifully designed welcome page that serves as the entry point for new users.
*   **Secure Authentication:** A unified Login/Registration system with robust routing to protect application data.
*   **Interactive Dashboard:**
    *   Dynamic summary cards showing key metrics like "This Month's Total," "Total Expenses," and "Pending Reviews."
    *   An interactive, multi-view expense chart (Doughnut, Bar, Line, Polar Area) displaying a monthly spending breakdown.
    *   A list of recent transactions with a "Manage" option to edit or delete on the fly.
*   **Full Expense Management:**
    *   A dedicated "All Expenses" page with pagination to view the entire transaction history.
    *   A reusable modal to **Edit** or **Delete** any confirmed expense from multiple pages.
*   **AI Smart Scan & Manual Entry:**
    *   A dedicated page for adding expenses, featuring a two-panel layout for AI Smart Scan (receipt OCR) and Manual Entry.
*   **Global NLP Search:**
    *   A fully functional search bar in the central navigation that routes to a dedicated search results page, displaying all matching expenses from natural language queries (e.g., "food last month").
*   **Real-Time Notifications:**
    *   A notification bell icon in the navbar with a badge for unread counts, driven by backend cron jobs for payment reminders.
    *   A dropdown menu to view all notifications and "Mark all as read."
*   **Comprehensive Settings Page:**
    *   A multi-tabbed interface for a clean user experience.
    *   **Profile & Appearance:** Update user name, profile picture, and toggle between Light/Dark themes.
    *   **Security:** A secure form to change the user's password.
    *   **Categories:** A full CRUD interface to view, add, and delete custom spending categories.
    *   **Payments:** Manage upcoming payment reminders.
    *   **Danger Zone:** Securely delete the user account.
*   **Robust Error Handling:**
    *   A professional **404 Page Not Found** for invalid URLs.
    *   A global banner for **No Internet Connection**.
    *   A full-page error display for **Server Down** states, with a "Try Again" option.

---

## 🗂️ Folder Structure

The `src` directory is organized by feature and function for clear separation of concerns:

# File Tree: src

**Root Path:** `/Users/patelhet/Desktop/ExpenseX/frontend/src`

├── api
│   └── index.js
├── assets
│   ├── icons
│   └── images
├── components
│   ├── charts
│   │   └── ExpenseChart.js
│   ├── common
│   │   ├── AnimatedSection.js
│   │   ├── Button.js
│   │   ├── EditExpenseModal.css
│   │   ├── EditExpenseModal.js
│   │   └── ProtectedRoute.js
│   ├── errors
│   │   ├── OfflineNotice
│   │   │   ├── OfflineNotice.css
│   │   │   └── OfflineNotice.js
│   │   └── ServerError
│   │       ├── ServerError.css
│   │       └── ServerError.js
│   ├── layout
│   │   ├── MainLayout.css
│   │   ├── MainLayout.js
│   │   ├── Navbar.css
│   │   ├── Navbar.js
│   │   ├── NotificationDropdown.css
│   │   ├── NotificationDropdown.js
│   │   ├── Sidebar.css
│   │   └── Sidebar.js
│   └── settings
│       ├── AppearanceSettings.js
│       ├── CategorySettings.js
│       ├── DeleteAccount.js
│       ├── PasswordSettings.js
│       ├── PaymentSettings.js
│       ├── ProfileSettings.js
│       └── SettingsForms.css
├── contexts
│   ├── AuthContext.js
│   └── ThemeContext.js
├── hooks
├── pages
│   ├── Auth
│   │   ├── Auth.css
│   │   └── Auth.js
│   ├── Error404
│   │   ├── Error404.css
│   │   └── Error404.js
│   ├── Home
│   │   ├── Home.css
│   │   └── Home.js
│   ├── Welcome
│   │   ├── Welcome.css
│   │   └── Welcome.js
│   ├── AllExpensesPage.css
│   ├── AllExpensesPage.js
│   ├── PendingExpensesPage.css
│   ├── PendingExpensesPage.js
│   ├── ReportsPage.css
│   ├── ReportsPage.js
│   ├── ScanPage.css
│   ├── ScanPage.js
│   ├── SearchPage.js
│   ├── SettingsPage.css
│   └── SettingsPage.js
├── styles
│   ├── main.css
│   ├── theme.css
│   └── variables.css
├── utils
│   └── dashboardHelper.js
├── App.js
└── index.js



---

## 🚀 How to Run

Before running the frontend, ensure the **backend server is running** (usually on `http://localhost:5050`).

1.  **Navigate to the directory:**
    ```bash
    cd frontend
    ```
2.  **Install Dependencies:**
    If you haven't already, install all the necessary packages.
    ```bash
    npm install
    ```
3.  **Start the Development Server:**
    This command will run the app in development mode.
    ```bash
    npm start
    ```
4.  **Open in Browser:**
    Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes.

---