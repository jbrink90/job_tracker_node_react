# Job Tracker

A simple and efficient job tracking web app built using **React**, **Express (Node.js)**, and **SQLite**. This tool helps you keep track of your job applications, statuses, and updates in one clean interface.

#### 🚀 Features

- 📝 Add, edit, and delete job entries

- 📅 Track application and status update dates
- 📍 Log company, role, location, and status
- 📊 Responsive table view with mobile-friendly column handling
- 🔒 Local storage with lightweight SQLite database
- 🌐 RESTful API built with Express

---

#### 🛠️ Tech Stack

- React + Vite + TypeScript

- Node.js + Express

- SQLite

---

#### 📁 Project Structure

job_tracker_node_react/
├── backend/ # Express server + SQLite DB
│ └── db.js # SQLite schema and helpers
│ └── routes/jobs.js # Job API endpoints
├── frontend/ # React UI
│ └── components/ # Reusable UI components
│ └── App.jsx # Main app logic

---

### 📦 Getting Started

1. Clone the repo

```
git clone https://github.com/jbrink90/job_tracker_node_react.git
cd job_tracker_node_react
```

2. Install dependencies

```sh
npm install
```

3. Run the app

```
npm run dev
```

---

### 📬 API Endpoints

| Method | Endpoint | Description            |
| ------ | -------- | ---------------------- |
| GET    | /jobs    | Fetch all job entries  |
| POST   | /jobs    | Add a new job entry    |
| PATCH  | jobs     | Update an existing job |
| DELETE | /jobs    | Delete a job entry     |

**Payload**:

```JSON
  {
    "id": 1,
    "company": "Tester",
    "job_title": "Modified Job Title",
    "description": "Job Description changed",
    "location": "New Delhi, India",
    "status": "Denied",
    "applied": "2025-08-01",
    "last_updated": "2025-12-05T06:31:12.513Z",
    "supabase_id": "269278e8-f504-4cb9-aea7-b917f235b255"
  }
```

---

### 🧪 Future Enhancements

- ✅ Authentication for multi-user support [Completed: branch (feature/user_id_integration)]

- 🔍 Search & filter capabilities [Completed: [commit](https://github.com/jbrink90/job_tracker_node_react/commit/2aab105ac46d58f165313835908c1bc0b2f76e3c "commit")]

- ⏰ Reminders for follow-ups

---

### Docker Compose Example

```yaml
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: job_tracker_backend
    ports:
      - "4444:4444"
    environment:
      MODE: production
      NODE_ENV: production
      API_PORT: 4444
      SQLITE_FILENAME: /usr/src/app/data/jobtracker.sqlite
      SUPABASE_URL: https://yoursite.supabase.co
      SUPABASE_ANON: your_secret_key

    volumes:
      - ./data:/usr/src/app/data
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: job_tracker_frontend
    ports:
      - "42000:80"
    depends_on:
      - backend
    restart: unless-stopped
    volumes:
      - ./conf.d:/etc/nginx/conf.d/
    environment:
      VITE_SUPABASE_URL: https://yoursite.supabase.co
      VITE_SUPABASE_ANON: your_secret_key
      VITE_API_BASE_URL_DEV: http://localhost:4444
      VITE_API_BASE_URL_PROD: https://api.jobtrackr.online
      VITE_FRONTEND_BASE_URL_DEV: http://localhost:5173
      VITE_FRONTEND_BASE_URL_PROD: https://jobtrackr.online
```
