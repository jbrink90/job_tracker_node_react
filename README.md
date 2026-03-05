# JobTrackr.online 🚀

**Your intelligent job application companion** - A modern PWA that helps you track, manage, and organize your job search with powerful features like LinkedIn integration, rich markdown descriptions, and seamless authentication.

---

## ✨ Key Features

### 🎯 **Smart Job Management**
- 📝 **Rich Markdown Editor** - Format job descriptions with full markdown support
- 🔗 **LinkedIn Integration** - Auto-import job details from LinkedIn URLs with one click
- 📊 **Advanced Data Grid** - Sort, filter, and manage applications with MUI Data Grid
- 📍 **Interactive Maps** - Visualize job locations with Mapbox integration

### 🔐 **Modern Authentication**
- 📧 **Passwordless Login** - Secure email-based authentication via Supabase
- 👤 **Multi-User Support** - Each user has their own private job database
- 🛡️ **Admin Protection** - Secure admin endpoints with role-based access

### 📱 **Progressive Web App**
- 📲 **Install Anywhere** - Works as a native app on desktop and mobile
- 🌐 **Offline Support** - Service worker caching for offline functionality
- � **Mobile Optimized** - Responsive design that works on all devices

### 🛠️ **Developer Experience**
- ⚡ **TypeScript** - Full type safety across frontend and backend
- 🎨 **Material-UI** - Beautiful, consistent UI components
- 🐳 **Docker Ready** - Containerized deployment with Docker Compose
- 🔄 **Hot Reload** - Fast development with Vite and Nodemon

---

## 🏗️ Architecture

### **Frontend (React + TypeScript)**
- **UI Framework**: Material-UI (MUI) v7 with custom theming
- **State Management**: React hooks with local state
- **Routing**: React Router v6 with protected routes
- **Rich Text**: MDX Editor for job descriptions
- **Maps**: Mapbox GL JS for location visualization
- **PWA**: Service worker with offline caching

### **Backend (Node.js + Express)**
- **API**: RESTful endpoints with Express.js
- **Database**: SQLite for lightweight, portable storage
- **Authentication**: Supabase JWT integration
- **Web Scraping**: Cheerio + Axios for LinkedIn job import

### **Infrastructure**
- **Deployment**: Docker containers with nginx reverse proxy
- **Environment**: Production-ready environment variable validation
- **Security**: CORS, JWT authentication, admin middleware
- **Monitoring**: Structured error handling and logging

---

## � Quick Start

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Git

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/jbrink90/job_tracker_node_react.git
cd job_tracker_node_react
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your Supabase credentials
# Required: SUPABASE_URL, SUPABASE_ANON, ADMIN_EMAIL
# Optional: API_PORT, SQLITE_FILENAME, NODE_ENV
```

4. **Start Development**
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # Frontend on http://localhost:5173
npm run dev:backend   # Backend on http://localhost:4444
```

5. **Access the App**
- 🌐 **Frontend**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:4444
- 📊 **API Docs**: Check `/api_docs` for Bruno/Postman collections

---

## � API Documentation

### **Authentication**
All protected endpoints require a Bearer token from Supabase authentication:
```http
Authorization: Bearer <your-supabase-jwt-token>
```

### **Core Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/jobs` | Get user's job listings | ✅ |
| `POST` | `/jobs` | Create new job entry | ✅ |
| `PATCH` | `/jobs` | Update existing job | ✅ |
| `DELETE` | `/jobs/:id` | Delete job entry | ✅ |
| `POST` | `/jobs/pull` | Import from LinkedIn | ✅ |
| `GET` | `/jobs/all` | Get all jobs (admin only) | 🔐 |

### **LinkedIn Integration**
```bash
curl -X POST http://localhost:4444/jobs/pull \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.linkedin.com/jobs/view/12345"}'
```

### **Job Data Model**
```json
{
  "id": 1,
  "company": "Tech Corp",
  "job_title": "Senior Developer",
  "description": "# About the role\n\nExciting opportunity...",
  "location": "San Francisco, CA",
  "status": "Applied",
  "applied": "2024-01-15",
  "last_updated": "2024-01-15T10:30:00Z",
  "supabase_id": "user-uuid-here"
}
```

---

## 🐳 Docker Deployment

### **Production Docker Compose**
```yaml
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: jobtrackr_backend
    ports:
      - "4444:4444"
    environment:
      API_PORT: 4444
      SQLITE_FILENAME: /usr/src/app/data/job_data.sqlite
      SUPABASE_URL: https://your-project.supabase.co
      SUPABASE_ANON: your-anon-key
      ADMIN_EMAIL: admin@example.com
    volumes:
      - ./data:/usr/src/app/data
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: jobtrackr_frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
    environment:
      VITE_SUPABASE_URL: https://your-project.supabase.co
      VITE_SUPABASE_ANON: your-anon-key
      VITE_API_BASE_URL: https://api.jobtrackr.online
      VITE_FRONTEND_BASE_URL: https://jobtrackr.online
```

---

## 🧪 Development & Testing

### **Available Scripts**
```bash
npm run dev          # Start development servers
npm run build        # Build for production
npm run lint         # ESLint with auto-fix
npm run format       # Prettier formatting
npm run test         # Run frontend tests
npm run test:ui      # Run tests with UI
```

### **Project Structure**
```
job_tracker_node_react/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── utils/          # Authentication & utilities
│   │   └── server.ts       # Main server file
│   ├── api_docs/           # Bruno API collections
│   └── Dockerfile
├── frontend/               # React PWA
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── lib/           # Utilities & API calls
│   │   └── main.tsx       # App entry point
│   ├── public/            # Static assets & service worker
│   └── Dockerfile
├── compose.yaml           # Docker Compose configuration
└── README.md
```

---

## 🚀 Future Roadmap

### **Completed Features** ✅
- [x] Supabase authentication integration
- [x] Advanced search and filtering
- [x] LinkedIn job import functionality
- [x] Rich markdown editor
- [x] PWA capabilities
- [x] Docker deployment

### **In Development** 🚧
- [ ] Unit Testing
- [ ] Context / Theme Improvements
- [ ] Limiting free users

### **Planned Features** 📋
- [ ] Interview Scheduling with calendar integration
- [ ] Email notifications for interview reminders
- [ ] Job application analytics dashboard
- [ ] Job export functionality

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

---

## 🙏 Acknowledgments

- **Supabase** - Authentication and database services
- **Material-UI** - React component library
- **Mapbox** - Mapping and location services
- **Vite** - Fast build tool and development server
- **Express.js** - Backend web framework

---

## 📞 Support

- 🌐 **Live App**: [JobTrackr.online](https://jobtrackr.online)
- 📧 **Contact**: [Contact Page](https://jobtrackr.online/contact)
- 🐛 **Issues**: [GitHub Issues](https://github.com/jbrink90/job_tracker_node_react/issues)
- 📖 **Documentation**: Check the `/docs` folder for detailed guides

---

**Built with ❤️ for job seekers everywhere** 🎯
