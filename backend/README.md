# ExpenseX Backend - AI-Powered Expense Tracker API

Welcome to the backend server for **ExpenseX**, a next-generation, AI-powered expense tracking application. This server is built with Node.js, Express, and MySQL, and it provides a comprehensive suite of APIs to power a modern, dynamic frontend.

This project was developed as a final semester college project, designed to be professional, scalable, and ready for public deployment.

---

## 🎯 Project Goal

To deliver a fully functional, AI-powered backend that handles user authentication, data management, and advanced features like OCR scanning, NLP search, automated notifications, and customizable report generation. A key requirement is that all "AI" features are powered by free, open-source, and offline-capable libraries, with no reliance on paid cloud APIs.

---

## 🧩 Tech Stack

- **Server:** Node.js, Express.js
- **Database:** MySQL
- **Authentication:** JSON Web Tokens (JWT), bcrypt
- **File Uploads:** Multer
- **AI & Data Processing:**
  - **OCR:** Tesseract.js
  - **NLP:** Compromise, Fuse.js
  - **Date Parsing:** Custom Logic (initially Chrono-node)
  - **AI Categorization:** Custom logic (`aiHelper.js`)
- **Report Generation:**
  - **PDF:** PDFKit, pdfkit-table
  - **Excel:** ExcelJS
  - **Word:** DOCX
- **Scheduled Tasks:** Node-cron
- **Security:** Express-rate-limit

---

## 🗂️ Folder Structure

The backend follows a standard Model-View-Controller (MVC) like architecture for clear separation of concerns.

------


# File Tree: backend

```
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── categoryController.js
│   ├── expenseController.js
│   ├── notificationController.js
│   ├── reportController.js
│   ├── scanController.js
│   ├── searchController.js
│   └── userController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   ├── rateLimitMiddleware.js
│   └── uploadMiddleware.js
├── models/
│   ├── categoryModel.js
│   ├── expenseModel.js
│   ├── settingsModel.js
│   └── userModel.js
├── node_modules/ 🚫 (auto-hidden)
├── routes/
│   ├── authRoutes.js
│   ├── categoryRoutes.js
│   ├── expenseRoutes.js
│   ├── notificationRoutes.js
│   ├── reportRoutes.js
│   ├── scanRoutes.js
│   ├── searchRoutes.js
│   └── userRoutes.js
├── uploads/
├── utils/
│   ├── aiHelper.js
│   ├── cronJobs.js
│   ├── ocrHelper.js
│   ├── reportHelper.js
│   └── searchHelper.js
├── .env 🚫 (auto-hidden)
├── README.md
├── eng.traineddata
├── logo.png
├── package-lock.json
├── package.json
├── routes.md
└── server.js
```

---

## 🧱 Database Schema

The application uses a relational MySQL database with the following primary tables:

1.  `users`: Stores user credentials, profile information, and preferences.
2.  `categories`: Stores user-defined expense categories with custom names and colors.
3.  `expenses`: The core table storing all individual expense transactions, linked to a user and a category. Includes a `status` column (`pending`, `confirmed`) for the smart scan workflow.
4.  `settings`: A key-value store for user-specific settings like `upcoming_payments` and `dashboard_layout` (stored as JSON).
5.  `notifications`: Stores system-generated notifications, such as payment reminders.
6.  `session_logs`: An audit trail of successful user login events.
7.  `reports`: (Schema exists for future use to store generated report metadata).

---

## 🔑 Core Features & API Endpoints

### 1. Authentication (`/api/auth`)
- `POST /register`: Creates a new user, hashes the password with `bcrypt`, creates default categories, and returns a JWT.
- `POST /login`: Authenticates a user, verifies the password, logs the session, and returns a JWT.
- `GET /me`: A protected route that returns the currently logged-in user's information.

### 2. Expenses (`/api/expenses`)
- `POST /`: Creates a new `confirmed` expense manually.
- `GET /`: Retrieves a list of all `confirmed` expenses for the user. Supports filtering by `dateRange`, `categoryIds`, and `limit`.
- `GET /pending`: Retrieves all expenses with a `pending` status (from smart scans).
- `PUT /:id/confirm`: Confirms a pending expense, updating its details and changing its status to `confirmed`.
- `DELETE /:id`: Deletes an expense.

### 3. AI Smart Scan (`/api/scan`)
- `POST /`: The "Hybrid Scan" endpoint.
    1.  Accepts a receipt image upload (`multipart/form-data`).
    2.  Uses **Tesseract.js** for OCR.
    3.  Uses custom helpers to parse amount, date, and vendor.
    4.  Uses **`aiHelper.js`** to predict the category based on the user's past expenses for that vendor.
    5.  Calculates a "confidence score".
    6.  Saves the expense as `confirmed` (high confidence) or `pending` (low confidence).
    7.  Deletes the temporary image file from the `/uploads` directory.

### 4. NLP Search (`/api/search`)
- `POST /`: Accepts a natural language query (e.g., "food last month").
    1.  Uses a robust, clock-immune manual parser for date phrases ("this month", "last month", month names).
    2.  Uses **Fuse.js** for powerful, fuzzy keyword searching across category names, vendors, and descriptions.
    3.  Returns a filtered list of matching expenses.

### 5. User & Settings (`/api/users`)
- `PUT /profile`: Updates user's name and theme (`light`/`dark`).
- `PUT /password`: Securely updates user's password after verifying the current one.
- `PUT /profile-photo`: Uploads a new profile photo (max 5MB), deletes the old one.
- `GET /settings`: Retrieves user settings, including the `upcoming_payments` array.
- `PUT /settings/upcoming-payments`: Overwrites the user's list of upcoming payment reminders.
- `POST /account/delete`: Permanently deletes a user and all their associated data after password verification.

### 6. Reports (`/api/reports`)
- `POST /generate`: A powerful and flexible report generator.
    - Accepts a configuration object specifying `format`, `dateRange`, `title`, `include_chart`, etc.
    - Generates and returns a downloadable file in **PDF**, **Excel (`.xlsx`)**, or **Word (`.docx`)** format.
    - PDF reports are professionally styled with headers, footers, page numbers, and embedded charts.

### 7. Automated Notifications (`node-cron`)
- A cron job runs automatically on the server (currently every minute for testing).
- It scans the `settings` of all users.
- It uses MySQL's `DATEDIFF()` function to reliably check if any `upcoming_payments` are due the next day.
- If a payment is due, it creates a notification in the `notifications` table.
- `GET /api/notifications` and `PUT /api/notifications/read` allow the user to manage these alerts.

### 8. Security
- **JWT:** All protected routes are secured by a JWT-based `authMiddleware`.
- **Rate Limiting:** `express-rate-limit` is used to prevent brute-force attacks on authentication routes and spam on general API routes.
- **Session Logging:** Successful logins are recorded with IP address and device info for security auditing.

---

## 🚀 How to Run

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Create `.env` File:**
    Create a `.env` file in the `backend/` root and add your MySQL database credentials and a JWT secret key.
    ```env
    PORT=5050
    DB_HOST=localhost
    DB_USER=your_mysql_username
    DB_PASSWORD=your_mysql_password
    DB_NAME=expensex_db
    JWT_SECRET=your_super_secret_key_here
    ```
3.  **Set Up Database:**
    Use a MySQL client to create the `expensex_db` database and run the SQL schema script provided in the project setup to create all the tables.
4.  **Start the Server:**
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:5050`. You can test all endpoints using the provided Postman collection.