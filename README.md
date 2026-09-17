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
- 📈 **Install Anywhere** - Works as a native app on desktop and mobile
- 🌐 **Offline Support** - Service worker caching for offline functionality
- 📱 **Mobile Optimized** - Responsive design that works on all devices

### 🛠️ **Developer Experience**
- ⚡ **TypeScript** - Full type safety across frontend
- 🎨 **Material-UI** - Beautiful, consistent UI components
- 🐳 **Docker Ready** - Containerized deployment with Docker Compose
- 🔄 **Hot Reload** - Fast development with Vite

---

## 🏗️ Architecture

### **Frontend (React + TypeScript)**
- **UI Framework**: Material-UI (MUI) v7 with custom theming
- **State Management**: React hooks with local state
- **Routing**: React Router v6 with protected routes
- **Rich Text**: MDX Editor for job descriptions
- **Maps**: Mapbox GL JS for location visualization
- **PWA**: Service worker with offline caching

### **Backend (Supabase)**
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth (passwordless email login)
- **Edge Functions**: Deno-based serverless functions for LinkedIn scraping

### **Infrastructure**
- **Deployment**: Docker container with nginx reverse proxy
- **Environment**: Production-ready environment variable validation
- **Security**: Row Level Security (RLS) policies, JWT authentication
- **Edge Functions**: Serverless functions for web scraping

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
# Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON
# Optional: VITE_DEMO_PASSWORD
```

4. **Start Development**
```bash
# Start development server
npm run dev
```

5. **Access the App**
- 🌐 **Frontend**: http://localhost:5173

---

## 📡 API Documentation

### **Supabase Database**
All data operations use Supabase client SDK with Row Level Security (RLS):
- Jobs are stored in the `jobs_table`
- Each user can only access their own jobs
- Authentication handled by Supabase Auth

### **Edge Functions**

| Function | Description | Auth Required |
|----------|-------------|---------------|
| `linkedin-scrape_func` | Import job details from LinkedIn URL | ✅ |

### **LinkedIn Integration**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/linkedin-scrape_func \
  -H "Authorization: Bearer <your-anon-key>" \
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
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: jobtrackr_frontend
    ports:
      - "80:80"
    restart: unless-stopped
    environment:
      VITE_SUPABASE_URL: https://your-project.supabase.co
      VITE_SUPABASE_ANON: your-anon-key
      VITE_SUPABASE_JOBS_TABLE: jobs_table
      VITE_SUPABASE_LINKEDIN_FUNCTION: v1/linkedin-scrape_func
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
├── frontend/               # React PWA
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── lib/           # Utilities & API calls
│   │   └── main.tsx       # App entry point
│   ├── public/            # Static assets & service worker
│   └── Dockerfile
├── edge_functions/        # Supabase Edge Functions
│   └── supabase/
│       └── functions/
│           └── linkedin-scraper/  # LinkedIn scraping function
├── compose.yaml           # Docker Compose configuration
└── README.md
```

---

## 🚀 Future Roadmap

### **Completed Features** ✅
- [✔] Supabase authentication integration
- [✔] Advanced search and filtering
- [✔] LinkedIn job import functionality
- [✔] Rich markdown editor
- [✔] PWA capabilities
- [✔] Docker deployment
- [✔] Context / Theme Improvements
- [✔] Supabase database integration

### **In Development** 🚧
- [ ] Unit Testing
- [ ] Limiting free users

### **Planned Features** 📋
- [ ] Interview Scheduling with calendar integration
- [ ] Email notifications for interview reminders
- [ ] Job application analytics dashboard
- [ ] Job list export functionality

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

- **Supabase** - Backend services (database, auth, edge functions)
- **Material-UI** - React component library
- **Mapbox** - Mapping and location services
- **Vite** - Fast build tool and development server

---

## 📞 Support

- 🌐 **Live App**: [JobTrackr.online](https://jobtrackr.online)
- 📧 **Contact**: [Contact Page](https://jobtrackr.online/contact)
- 🐛 **Issues**: [GitHub Issues](https://github.com/jbrink90/job_tracker_node_react/issues)
- 📖 **Documentation**: Check the `/docs` folder for detailed guides

---

**Built with ❤️ for job seekers everywhere** 🎯
