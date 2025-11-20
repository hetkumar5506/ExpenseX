# ExpenseX Frontend - AI-Powered Expense Tracker UI

Welcome to the frontend for **ExpenseX**, a modern, feature-rich React application designed to provide a seamless user experience for the AI-powered expense tracking platform. This interface is built with a focus on responsiveness, interactivity, accessibility, and a clean, user-friendly design.

*(Note: Replace the URL above with a real screenshot of your dashboard for maximum impact!)*

---

## 🎯 Project Goal

To build a complete, production-ready user interface using React that perfectly complements the powerful backend. The goal is to create an intuitive and visually appealing application that showcases all of the backend's AI and data management features, including dynamic charts, real-time notifications, AI-powered receipt scanning, and comprehensive settings management.

This frontend is fully aligned with the **master prompt for ExpenseX**, ensuring seamless integration with the backend APIs for authentication, expenses, smart scans, NLP search, notifications, and report generation.

---

## 🧩 Tech Stack

- **Framework/Library:** React (with Create React App)  
- **Routing:** React Router DOM  
- **HTTP Client:** Axios (with interceptors for JWT authentication & error handling)  
- **Styling:** Plain CSS with CSS Variables for Light/Dark themes  
- **Animations:** Framer Motion for scroll reveal, modal animations, draggable dashboard cards  
- **Charting:** Chart.js with `react-chartjs-2` for dynamic, interactive charts  
- **Icons:** React Icons  
- **File Downloads:** `file-saver` for exporting reports  
- **Local Storage:** For saving dashboard card order, theme preference, and session info  

---

## ✨ Core Features

This frontend implements the full suite of features provided by the ExpenseX backend API:

- **Professional Landing Page:** Multi-section welcome page with animated hero section, feature showcases, testimonials, and FAQ. Scroll-based reveal animations using Framer Motion.
- **Secure Authentication:** Login and registration with form validation, JWT token management, loading states, and error display.
- **Interactive Dashboard (Home Page):**
  - Greeting: Displays "Hello, [username] 👋" using `useAuth()`.
  - Draggable Grid: Uses Framer Motion's `Reorder` components to create a responsive dashboard layout. Card order is saved in `localStorage`.
  - Cards:
    - `RecentExpensesCard`: Shows latest 3 confirmed expenses.
    - `AnalyticsCard`: Displays expense charts with dynamic chart type switch (Bar, Line, Pie).
    - `UpcomingPaymentsCard`: Shows upcoming payment reminders from user settings.
    - `QuickActionsCard`: Buttons for "Add Expense", "Scan Receipt", and "Generate Report".
  - Expandable Modal: Clicking any card expands it with Framer Motion `layoutId`, blurred backdrop, and close functionality.
- **Expense Management Pages:**
  - `AddExpense.js`: Form with amount, date, vendor, category dropdown, description, and OCR-based receipt scanning.
  - `ViewExpenses.js`: Paginated table of confirmed expenses with search functionality.
  - `Reports.js`: Report Builder UI supporting date range, summary/chart selection, chart type, and export format (PDF, Excel, Word).
- **AI Smart Scan & Manual Entry:**
  - Hybrid layout for adding expenses with AI-powered OCR scan and manual entry form.
  - Integrates with `/api/scan` for receipt processing.
- **Global NLP Search:**
  - Search bar in Navbar using `/api/search` to query natural language queries like "food last month".
  - Results page displays filtered expenses.
- **Real-Time Notifications:**
  - Notification bell with badge for unread counts.
  - Dropdown shows notifications with "Mark all as read" option.
  - Driven by backend cron jobs for upcoming payments.
- **Comprehensive Settings Page:**
  - Multi-section settings with tabs for a clean UX.
  - **Profile & Appearance:** Update name, profile picture, and toggle Light/Dark theme.
  - **Security:** Change password form with validation.
  - **Categories:** CRUD interface for expense categories.
  - **Payments:** Manage upcoming payment reminders.
  - **Danger Zone:** Securely delete user account.
- **Robust Error Handling:**
  - 404 Page Not Found for invalid URLs.
  - Full-page No Internet Connection banner.
  - Server Error page with retry functionality.

---

## 🗂️ Folder Structure

The `src` directory is organized for maintainability and clear separation of concerns:


```
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src
│   ├── api
│   │   └── index.js
│   ├── assets
│   │   ├── icons
│   │   └── images
│   ├── components
│   │   ├── charts
│   │   │   └── ExpenseChart.js
│   │   ├── common
│   │   │   ├── AnimatedSection.js
│   │   │   ├── Button.js
│   │   │   ├── EditExpenseModal.css
│   │   │   ├── EditExpenseModal.js
│   │   │   └── ProtectedRoute.js
│   │   ├── errors
│   │   │   ├── OfflineNotice
│   │   │   │   ├── OfflineNotice.css
│   │   │   │   └── OfflineNotice.js
│   │   │   └── ServerError
│   │   │       ├── ServerError.css
│   │   │       └── ServerError.js
│   │   ├── layout
│   │   │   ├── MainLayout.css
│   │   │   ├── MainLayout.js
│   │   │   ├── Navbar.css
│   │   │   ├── Navbar.js
│   │   │   ├── NotificationDropdown.css
│   │   │   ├── NotificationDropdown.js
│   │   │   ├── Sidebar.css
│   │   │   └── Sidebar.js
│   │   └── settings
│   │       ├── AppearanceSettings.js
│   │       ├── CategorySettings.js
│   │       ├── DeleteAccount.js
│   │       ├── PasswordSettings.js
│   │       ├── PaymentSettings.js
│   │       ├── ProfileSettings.js
│   │       └── SettingsForms.css
│   ├── contexts
│   │   ├── AuthContext.js
│   │   └── ThemeContext.js
│   ├── hooks
│   ├── pages
│   │   ├── Auth
│   │   │   ├── Auth.css
│   │   │   └── Auth.js
│   │   ├── Error404
│   │   │   ├── Error404.css
│   │   │   └── Error404.js
│   │   ├── Home
│   │   │   ├── Home.css
│   │   │   └── Home.js
│   │   ├── Welcome
│   │   │   ├── Welcome.css
│   │   │   └── Welcome.js
│   │   ├── AllExpensesPage.css
│   │   ├── AllExpensesPage.js
│   │   ├── PendingExpensesPage.css
│   │   ├── PendingExpensesPage.js
│   │   ├── ReportsPage.css
│   │   ├── ReportsPage.js
│   │   ├── ScanPage.css
│   │   ├── ScanPage.js
│   │   ├── SearchPage.js
│   │   ├── SettingsPage.css
│   │   └── SettingsPage.js
│   ├── styles
│   │   ├── main.css
│   │   ├── theme.css
│   │   └── variables.css
│   ├── utils
│   │   └── dashboardHelper.js
│   ├── App.js
│   └── index.js
├── .gitignore
├── README.md
├── package-lock.json
└── package.json
```
---

## 🚀 How to Run

Before running the frontend, ensure the **backend server is running** (default: `http://localhost:5050`).

1. **Navigate to the frontend directory:**
```bash
cd frontend

2.	Install Dependencies:
npm install

3. Start Development Server:
npm start

4.	Open in Browser:
Visit http://localhost:3000￼ to view the app. Changes will reload automatically during development.

⚡ Notes & Recommendations
	•	The frontend is fully aligned with the backend API endpoints, including authentication, expenses, smart scan, NLP search, notifications, and report generation.

	•	Uses Framer Motion for smooth animations on modals, cards, and scroll-reveal sections.

	•	Dashboard layout is responsive and supports mobile, tablet, and desktop breakpoints.

	•	Supports Light/Dark themes via CSS variables and a theme context.

	•	All API calls are made via Axios with JWT authentication and global error handling.

	•	LocalStorage is used for persisting dashboard card order and theme preference.
    
	•	All files, components, and pages follow a structured folder organization for maintainability and scalability.