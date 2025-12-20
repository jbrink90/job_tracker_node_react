export const MOCK_API_GET_ALL_JOBS = [
  {
    id: 1,
    company: "TechCorp",
    job_title: "Software Engineer",
    description: `# TechCorp Job Description

Develop and maintain web applications using **React**, **Node.js**, and **TypeScript**.

## Responsibilities
- Build scalable front-end components
- Optimize API interactions
- Collaborate in agile teams

\`\`\`ts
const greet = (name: string) => \`Hello, \${name}!\`;
\`\`\`
`,
    location: "San Francisco, CA",
    status: "Applied",
    applied: new Date("2025-03-01"),
    last_updated: new Date("2025-03-10"),
    supabase_id: "user_123"
  },
  {
    id: 2,
    company: "DataSolutions",
    job_title: "Data Analyst",
    description: `# DataSolutions Job Description

Analyze large datasets to extract business insights and provide actionable recommendations.

## Tasks
- SQL and Python data analysis
- Build dashboards with **PowerBI**
- Create predictive models

### Notes
- Must handle unstructured data
- Communicate findings to stakeholders
`,
    location: "New York, NY",
    status: "Interview Scheduled",
    applied: new Date("2025-02-20"),
    last_updated: new Date("2025-03-05"),
    supabase_id: "user_123"
  },
  {
    id: 3,
    company: "CreativeWorks",
    job_title: "UX Designer",
    description: `# CreativeWorks UX Designer

Design intuitive user interfaces and craft seamless experiences.

## Responsibilities
- Wireframes & prototypes in Figma
- Conduct user testing and surveys
- Document design decisions

## Markdown Example
- **Bold**
- *Italic*
- [Link](https://example.com)
`,
    location: "Austin, TX",
    status: "Rejected",
    applied: new Date("2025-01-15"),
    last_updated: new Date("2025-02-01"),
    supabase_id: "user_123"
  },
  {
    id: 4,
    company: "FinTech Inc.",
    job_title: "Backend Developer",
    description: `# FinTech Backend Developer

Build reliable backend services with **Node.js**, **Express**, and **PostgreSQL**.

### Responsibilities
- REST API development
- Database schema design
- Integrate third-party services

### Extra
Focus on **security** and **scalability**.
`,
    location: "Seattle, WA",
    status: "Offer Received",
    applied: new Date("2025-02-28"),
    last_updated: new Date("2025-03-15"),
    supabase_id: "user_123"
  },
  {
    id: 5,
    company: "GreenEnergy Co.",
    job_title: "DevOps Engineer",
    description: `# GreenEnergy DevOps Role

Automate deployment pipelines and manage cloud infrastructure.

- AWS, Docker, Kubernetes
- CI/CD pipelines
- Monitor performance and uptime
`,
    location: "Denver, CO",
    status: "Applied",
    applied: new Date("2025-04-01"),
    last_updated: new Date("2025-04-05"),
    supabase_id: "user_123"
  },
  {
    id: 6,
    company: "HealthSync",
    job_title: "Full Stack Developer",
    description: `# HealthSync Developer

Work across front-end and back-end to deliver patient management tools.

**Stack:** React, Node.js, PostgreSQL, GraphQL

- Feature development
- Bug fixes and code reviews
- Collaborate with UX/UI team
`,
    location: "Boston, MA",
    status: "Interview Scheduled",
    applied: new Date("2025-03-12"),
    last_updated: new Date("2025-03-20"),
    supabase_id: "user_123"
  },
  {
    id: 7,
    company: "EduTech Labs",
    job_title: "Product Manager",
    description: `# EduTech Labs Product Manager

Lead development of educational platforms.

## Responsibilities
- Define roadmap and strategy
- Gather requirements from teachers and students
- Coordinate cross-functional teams
`,
    location: "Chicago, IL",
    status: "Applied",
    applied: new Date("2025-05-01"),
    last_updated: new Date("2025-05-03"),
    supabase_id: "user_123"
  },
  {
    id: 8,
    company: "CyberNetics",
    job_title: "Security Analyst",
    description: `# CyberNetics Security Analyst

Monitor and protect systems against cyber threats.

- Penetration testing
- Log analysis
- Incident response planning

\`\`\`bash
# Example: scan network
nmap -sV 192.168.1.0/24
\`\`\`
`,
    location: "Los Angeles, CA",
    status: "Applied",
    applied: new Date("2025-03-25"),
    last_updated: new Date("2025-03-28"),
    supabase_id: "user_123"
  },
  {
    id: 9,
    company: "SmartHome Inc.",
    job_title: "IoT Engineer",
    description: `# SmartHome IoT Engineer

Develop firmware and cloud connectivity for smart devices.

- Embedded C/C++
- MQTT and REST integration
- Home automation platforms
`,
    location: "San Jose, CA",
    status: "Rejected",
    applied: new Date("2025-02-15"),
    last_updated: new Date("2025-02-20"),
    supabase_id: "user_123"
  },
  {
    id: 10,
    company: "FinAnalytics",
    job_title: "Quantitative Analyst",
    description: `# FinAnalytics Quantitative Analyst

Perform complex financial modeling and risk assessment.

- Python, R, and MATLAB
- Statistical analysis
- Predictive modeling
`,
    location: "New York, NY",
    status: "Interview Scheduled",
    applied: new Date("2025-01-28"),
    last_updated: new Date("2025-02-05"),
    supabase_id: "user_123"
  },
  {
    id: 11,
    company: "GameStudio X",
    job_title: "Game Developer",
    description: `# GameStudio X Developer

Create immersive game experiences with Unity and Unreal Engine.

- C#, C++
- Multiplayer networking
- AI character design
`,
    location: "Seattle, WA",
    status: "Applied",
    applied: new Date("2025-03-05"),
    last_updated: new Date("2025-03-12"),
    supabase_id: "user_123"
  },
  {
    id: 12,
    company: "AI Dynamics",
    job_title: "Machine Learning Engineer",
    description: `# AI Dynamics ML Engineer

Design and implement machine learning models for real-world applications.

- TensorFlow / PyTorch
- Data preprocessing pipelines
- Model deployment
`,
    location: "Palo Alto, CA",
    status: "Offer Received",
    applied: new Date("2025-04-10"),
    last_updated: new Date("2025-04-15"),
    supabase_id: "user_123"
  },
  {
    id: 13,
    company: "TravelGo",
    job_title: "Mobile App Developer",
    description: `# TravelGo Mobile Developer

Develop travel apps for iOS and Android platforms.

- Swift, Kotlin, Flutter
- Location-based services
- Push notifications
`,
    location: "Miami, FL",
    status: "Applied",
    applied: new Date("2025-02-10"),
    last_updated: new Date("2025-02-15"),
    supabase_id: "user_123"
  },
  {
    id: 14,
    company: "BioTech Labs",
    job_title: "Research Scientist",
    description: `# BioTech Labs Research Scientist

Conduct experiments and analyze biological data.
 
- Lab protocols and documentation
- Statistical analysis with Python/R
- Write scientific papers
`,
    location: "Boston, MA",
    status: "Rejected",
    applied: new Date("2025-01-20"),
    last_updated: new Date("2025-01-30"),
    supabase_id: "user_123"
  },
  {
    id: 15,
    company: "NextGen Robotics",
    job_title: "Robotics Engineer",
    description: `# NextGen Robotics Engineer

Design and implement robotic systems for industrial applications.

- Mechanical design
- Embedded systems
- Control algorithms
`,
    location: "Austin, TX",
    status: "Applied",
    applied: new Date("2025-03-18"),
    last_updated: new Date("2025-03-22"),
    supabase_id: "user_123"
  }
];