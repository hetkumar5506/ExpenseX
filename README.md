<div align="center">
  <img src="./backend/logo.png" alt="ExpenseX Logo" width="150">
  <h1>ExpenseX - AI-Powered Expense Tracker</h1>
  <p>
    A professional, full-stack expense tracking web application featuring a powerful Node.js backend with offline-first AI capabilities and a sleek, fully-featured React frontend.
  </p>
</div>

---

## ✨ Core Features

*   **🤖 AI Smart Scan:** Upload a receipt image and let the offline OCR (Tesseract.js) and custom AI logic automatically extract the vendor, amount, date, and predict the category.
*   **🗣️ Natural Language Search:** A global search bar that understands queries like "food last month" or "shopping at Amazon" to instantly find transactions.
*   **📄 Comprehensive Reporting:** Generate and download professional, multi-format reports (**PDF**, **Excel**, **Word**) for any date range, with optional charts.
*   **🔔 Automated Notifications:** Set reminders for upcoming payments and receive automated alerts from a server-side cron job before they are due.
*   **🎨 Full User & Data Management:** Secure user authentication, profile customization (including profile pictures and Light/Dark themes), and complete CRUD functionality for expenses and categories.
*   **🖥️ Responsive & Modern UI:** A clean, intuitive, and fully responsive user interface built with React, featuring smooth animations (Framer Motion) and dynamic data visualizations (Chart.js).

---

## 🛠️ Tech Stack Overview

| Area      | Technology / Library                                                              |
| :-------- | :-------------------------------------------------------------------------------- |
| **Backend** | Node.js, Express.js, MySQL, JWT, bcrypt, Multer, `node-cron`                        |
|           | **AI:** Tesseract.js (OCR), Fuse.js (Fuzzy Search)                                  |
|           | **Reporting:** PDFKit, ExcelJS, DOCX                                                |
| **Frontend**| React, React Router, Axios, Framer Motion, Chart.js, React Icons                  |
| **Database**| MySQL                                                                             |

---

## 🗂️ Project Structure

The project is organized into two main packages: a `backend` API server and a `frontend` React application.

# File Tree: ExpenseX

```
├── backend
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── expenseController.js
│   │   ├── notificationController.js
│   │   ├── reportController.js
│   │   ├── scanController.js
│   │   ├── searchController.js
│   │   └── userController.js
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── rateLimitMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models
│   │   ├── categoryModel.js
│   │   ├── expenseModel.js
│   │   ├── settingsModel.js
│   │   └── userModel.js
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── scanRoutes.js
│   │   ├── searchRoutes.js
│   │   └── userRoutes.js
│   ├── uploads
│   │   ├── profile_photo-1762786316179.jpg
│   │   └── profile_photo-1762787511329.jpg
│   ├── utils
│   │   ├── aiHelper.js
│   │   ├── cronJobs.js
│   │   ├── ocrHelper.js
│   │   ├── reportHelper.js
│   │   └── searchHelper.js
│   ├── README.md
│   ├── eng.traineddata
│   ├── logo.png
│   ├── package-lock.json
│   ├── package.json
│   ├── routes.md
│   └── server.js
├── frontend
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src
│   │   ├── api
│   │   │   └── index.js
│   │   ├── assets
│   │   │   ├── icons
│   │   │   └── images
│   │   ├── components
│   │   │   ├── charts
│   │   │   │   └── ExpenseChart.js
│   │   │   ├── common
│   │   │   │   ├── AnimatedSection.js
│   │   │   │   ├── Button.js
│   │   │   │   ├── EditExpenseModal.css
│   │   │   │   ├── EditExpenseModal.js
│   │   │   │   └── ProtectedRoute.js
│   │   │   ├── errors
│   │   │   │   ├── OfflineNotice
│   │   │   │   │   ├── OfflineNotice.css
│   │   │   │   │   └── OfflineNotice.js
│   │   │   │   └── ServerError
│   │   │   │       ├── ServerError.css
│   │   │   │       └── ServerError.js
│   │   │   ├── layout
│   │   │   │   ├── MainLayout.css
│   │   │   │   ├── MainLayout.js
│   │   │   │   ├── Navbar.css
│   │   │   │   ├── Navbar.js
│   │   │   │   ├── NotificationDropdown.css
│   │   │   │   ├── NotificationDropdown.js
│   │   │   │   ├── Sidebar.css
│   │   │   │   └── Sidebar.js
│   │   │   └── settings
│   │   │       ├── AppearanceSettings.js
│   │   │       ├── CategorySettings.js
│   │   │       ├── DeleteAccount.js
│   │   │       ├── PasswordSettings.js
│   │   │       ├── PaymentSettings.js
│   │   │       ├── ProfileSettings.js
│   │   │       └── SettingsForms.css
│   │   ├── contexts
│   │   │   ├── AuthContext.js
│   │   │   └── ThemeContext.js
│   │   ├── hooks
│   │   ├── pages
│   │   │   ├── Auth
│   │   │   │   ├── Auth.css
│   │   │   │   └── Auth.js
│   │   │   ├── Error404
│   │   │   │   ├── Error404.css
│   │   │   │   └── Error404.js
│   │   │   ├── Home
│   │   │   │   ├── Home.css
│   │   │   │   └── Home.js
│   │   │   ├── Welcome
│   │   │   │   ├── Welcome.css
│   │   │   │   └── Welcome.js
│   │   │   ├── AllExpensesPage.css
│   │   │   ├── AllExpensesPage.js
│   │   │   ├── PendingExpensesPage.css
│   │   │   ├── PendingExpensesPage.js
│   │   │   ├── ReportsPage.css
│   │   │   ├── ReportsPage.js
│   │   │   ├── ScanPage.css
│   │   │   ├── ScanPage.js
│   │   │   ├── SearchPage.js
│   │   │   ├── SettingsPage.css
│   │   │   └── SettingsPage.js
│   │   ├── styles
│   │   │   ├── main.css
│   │   │   ├── theme.css
│   │   │   └── variables.css
│   │   ├── utils
│   │   │   └── dashboardHelper.js
│   │   ├── App.js
│   │   └── index.js
│   ├── .gitignore
│   ├── README.md
│   ├── package-lock.json
│   └── package.json
└── README.md
```
----

Each folder is a complete, standalone project with its own dependencies and `README.md` file containing detailed setup and feature information.

---

## 🚀 Quick Start Guide

To get the full application running, you must start both the backend server and the frontend development server.

### 1. Set Up the Database

This project uses a MySQL database.
1.  Ensure you have MySQL server installed and running.
2.  Create a database named `expensex_db`.
3.  Run the SQL schema script provided in the project to create all the necessary tables.

### 2. Run the Backend

First, set up and run the backend API server.

```bash
# Navigate to the backend directory
cd backend

# Create a .env file and add your database credentials (see backend README for an example)
# Example:
# PORT=5050
# DB_HOST=localhost
# DB_USER=your_username
# DB_PASSWORD=your_password
# DB_NAME=expensex_db
# JWT_SECRET=your_super_secret_key

# Install dependencies
npm install

# Run the server (defaults to http://localhost:5050)
npm run dev

➡️ For more details, see the Backend README


3. Run the Frontend
Once the backend server is running, you can start the frontend React application in a new terminal window.

# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Run the React app (defaults to http://localhost:3000)
npm start

 For more details, see the Frontend README

After completing these steps, open http://localhost:3000 in your browser to use the application.

<div align="center"> <p>Built with ❤️ by <strong>Patel Het</strong> as a Final Semester Project.</p> </div> ```