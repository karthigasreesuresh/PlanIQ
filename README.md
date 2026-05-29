# PlanIQ - Intelligent Task Management SaaS

PlanIQ is a premium, full-stack, responsive task management web application designed like a modern SaaS productivity tool (similar to Notion, Linear, or ClickUp). 

Developed with a clean, dark-themed, glassmorphic layout, it features JWT authentication, statistics widgets, productivity indicators, overdue warnings, search/filter/sort options, and full task CRUD capabilities.

---

## ⚡ Tech Stack & Architecture

* **Frontend**: React.js 19 + Vite + React Router v6
* **Backend**: Node.js + Express.js
* **Styling**: Tailwind CSS v3 (Customized Dark Theme)
* **Icons**: Lucide React
* **Database**: **Dual-Database Layer Adapter**
  * **MongoDB (Production)**: Uses Mongoose schemas when a connection URI is provided.
  * **Local JSON DB (Zero-Config Fallback)**: Automatically falls back to a clean, transactional file database (`backend/data/db.json`) if MongoDB is not configured. **Requires zero external installations to run!**

---

## 🚀 Key Features

1. **User Authentication & Session Security**:
   * One-way password hashing using `bcryptjs`.
   * Secure session tokens using JWT.
   * Scoped queries—users can only access, filter, or delete their own tasks.
2. **Dashboard Analytics (Productivity Center)**:
   * Dynamically calculated statistics (Total, Pending, In Progress, Completed, High Priority).
   * Overdue deadline indicators and warnings.
   * Beautiful SVG-based visual productivity progress indicator showing completion ratios.
   * Recent task activity log.
3. **Advanced Filtering, Sorting & Search**:
   * Text search matching both titles and descriptions.
   * State filters to isolate status (Pending, In Progress, Completed) and priorities (Low, Medium, High).
   * Sorting by due date (chronological) or recently added tasks.
4. **Intuitive Task Operations**:
   * Interactive checkboxes to toggle task completion with optimistic UI updates.
   * Integrated creation and editing models.
   * Confirmation prompt dialog before deleting tasks.
5. **Interactive Responsive Interface**:
   * Beautiful glassmorphic cards, gradient accents, floating blur graphics, and responsive layouts for mobile, tablet, and desktop viewports.

---

## 📁 Project Structure

```
PlanIQ/
├── package.json               # Root config (concurrent runner scripts)
├── README.md                  # Detailed startup and configuration guide
├── backend/
│   ├── package.json           # Express server requirements
│   ├── server.js              # Server entry point
│   ├── .env                   # Local configuration variables
│   ├── config/
│   │   └── db.js              # Dual-Database Layer Adapter
│   ├── middleware/
│   │   └── auth.js            # JWT verification layer
│   ├── controllers/
│   │   ├── authController.js  # Registration, sign-in, and profile actions
│   │   └── taskController.js  # CRUD and dashboard stats calculations
│   └── routes/
│       ├── authRoutes.js      # Auth API routes
│       └── taskRoutes.js      # Task API routes
└── frontend/
    ├── package.json           # React Vite requirements
    ├── vite.config.js         # Bundler configs
    ├── tailwind.config.js     # Custom SaaS themes & colors config
    ├── postcss.config.js      # CSS compiler pipeline
    ├── index.html             # Main index template & Google Font imports
    └── src/
        ├── index.css          # Tailwind base & custom animations/glass classes
        ├── App.jsx            # Routing and overall App shells
        ├── main.jsx           # Mounting React
        ├── context/
        │   └── AuthContext.jsx # Global user authentication state
        ├── utils/
        │   └── api.js          # Unified API caller with header attachments
        ├── components/
        │   ├── Sidebar.jsx    # Left-hand navigation
        │   ├── Navbar.jsx     # Top greeting & utility header
        │   ├── TaskCard.jsx   # Interactive task displays
        │   ├── TaskModal.jsx  # Task input forms
        │   └── ConfirmModal.jsx # Deletion check popup
        └── pages/
            ├── LandingPage.jsx # Landing promo & features page
            ├── LoginPage.jsx   # Credentials form
            ├── RegisterPage.jsx# Registration form
            ├── Dashboard.jsx   # Analytical dashboards
            ├── TasksPage.jsx   # Searchable and sortable registry
            ├── ProfilePage.jsx # Security details & account snapshots
            └── NotFound.jsx    # 404 Error page
```

---

## ⚙️ Setup and Installation

### 1. Install Dependencies
Make sure you have Node.js installed. Open a terminal in the root `PlanIQ` directory and run:
```bash
npm run install-all
```
*This single command will install all packages for the root runner, Express backend, and React frontend simultaneously.*

### 2. Configure Environment Variables
Inside the `backend` folder, copy `.env.example` to `.env` (it has been created by default for you):
```env
PORT=5000
JWT_SECRET=planiq_secret_auth_token_for_user_sessions_2026
MONGODB_URI=
```
> [!TIP]
> **Zero-Config Mode**: If `MONGODB_URI` is left blank, PlanIQ runs automatically using the local database file `backend/data/db.json`. No MongoDB setup is required!
> If you wish to use a live MongoDB server, simply insert your URI connection string in `MONGODB_URI`.

---

## 🏃 Running the Application

To start both the backend API and frontend dev server simultaneously, run from the root folder:
```bash
npm run dev
```

Once running:
* **Frontend**: Open `http://localhost:5173` in your browser.
* **Backend API**: Running at `http://localhost:5000`.

---

## 👨‍💻 Verification Checks

* **Build Validation**: The project compiles successfully into production assets via `npm run build`.
* **Database fallback**: The app gracefully creates and writes JSON states to `backend/data/db.json` when MongoDB connection details are absent.
