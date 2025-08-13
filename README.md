# Mindflip

Mindflip is a modern vocabulary learning platform that helps users efficiently memorize and master new words through spaced repetition and interactive flashcards. Built with a Next.js 15 frontend and NestJS backend, the application provides a comprehensive learning experience with progress tracking and analytics.

## 🌟 Overview

Mindflip is an intelligent vocabulary learning platform designed to help users efficiently memorize and master new words through evidence-based learning techniques. The application combines interactive flashcards with spaced repetition algorithms to optimize long-term retention while providing comprehensive progress tracking and analytics.

With a clean, responsive interface and personalized learning paths, Mindflip makes vocabulary acquisition engaging and effective for learners of all levels.

## 🏗️ Architecture

- **Frontend**: Next.js 15 with App Router, TypeScript, and Tailwind CSS
- **Backend**: NestJS with modular architecture and MongoDB/Mongoose
- **Authentication**: JWT-based authentication with Passport.js and Google OAuth
- **API Communication**: RESTful API with Swagger documentation
- **State Management**: Zustand for frontend state management
- **Data Visualization**: Recharts for analytics and progress tracking
- **Deployment**: Ready for deployment on Vercel (frontend) and cloud platforms (backend)

## 🚀 Core Features

### 📚 Vocabulary Management
- **Create Custom Sets**: Build personalized vocabulary sets with terms and definitions
- **Import/Export Functionality**: Easily import vocabulary from external sources or export your sets
- **Public/Private Sharing**: Share your vocabulary sets with the community or keep them private
- **Rich Media Support**: Add images, audio, and examples to enhance learning experience

### 🧠 Intelligent Learning System
- **Spaced Repetition**: Advanced SRS algorithm optimizes review timing for long-term retention
- **Adaptive Flashcards**: Interactive cards with flip animation and audio pronunciation
- **Progressive Difficulty**: System adapts to your learning pace and proficiency level
- **Multiple Learning Modes**: Study through flashcards, quizzes, matching games, and writing exercises

### 📊 Analytics & Insights
- **Learning Dashboard**: Comprehensive overview of your study progress and achievements
- **Activity Tracking**: Detailed statistics on study time, mastered terms, and learning patterns
- **Performance Metrics**: Visual charts showing skill distribution and term mastery progress
- **Heatmap Calendar**: Track your daily learning activity and maintain streaks

### 🔐 Authentication & Security
- **Secure Login/Registration**: JWT-based authentication with encrypted password storage
- **Google OAuth Integration**: One-click sign-in with Google account
- **Email Verification**: Secure email confirmation for new accounts
- **Session Management**: Automatic token refresh and secure session handling

### 🎨 User Experience
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between color schemes based on preference
- **Intuitive Navigation**: Clean interface with easy access to all features
- **Keyboard Shortcuts**: Efficient navigation and interaction using keyboard controls

## 📁 Project Structure

```
mindflip/
├── backend/                    # NestJS server application
│   ├── src/                    # Backend source code
│   │   ├── modules/            # Feature modules (auth, sets, users, etc.)
│   │   ├── common/             # Shared utilities and interceptors
│   │   ├── config/             # Configuration files
│   │   └── main.ts             # Application entry point
│   ├── package.json            # Backend dependencies
│   └── ...
└── frontend/                   # Next.js client application
    ├── src/                    # Frontend source code
    │   ├── app/                # App router pages and layouts
    │   │   ├── dashboard/      # User dashboard with analytics
    │   │   ├── sets/           # Vocabulary sets management
    │   │   ├── login/          # Authentication pages
    │   │   └── ...             # Other pages
    │   ├── components/         # Reusable UI components
    │   ├── hooks/              # Custom React hooks
    │   ├── libs/               # Utility libraries and API clients
    │   └── ...
    ├── package.json            # Frontend dependencies
    └── ...
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB instance (local or cloud)
- npm or yarn package manager

### Installation

1. **Backend Setup**:
```bash
cd backend
npm install
# Configure environment variables in .env
npm run start:dev
```

2. **Frontend Setup**:
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Create `.env` files in both `backend` and `frontend` directories with appropriate configuration values.

## 🔐 Authentication Flow

1. User registers via `/api/auth/register`
2. Backend validates credentials and creates user with hashed password
3. User logs in via `/api/auth/login`
4. Backend generates JWT token upon successful authentication
5. Frontend stores token and includes it in subsequent requests
6. Backend validates token on protected routes

## 🛠️ Technologies Used

### Backend
- **NestJS** - Progressive Node.js framework with modular architecture
- **MongoDB/Mongoose** - NoSQL database and ODM for data persistence
- **Passport.js** - Authentication middleware supporting multiple strategies
- **JWT** - Token-based authentication and authorization
- **bcrypt.js** - Secure password hashing and verification
- **Swagger** - API documentation and testing interface
- **Jest** - Unit and integration testing framework
- **Class Validator** - Request payload validation and sanitization

### Frontend
- **Next.js 15** - React framework with App Router and Server Components
- **TypeScript** - Static typing for improved code quality and developer experience
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Hooks** - State management and side effects handling
- **Axios** - HTTP client for API communication
- **Zustand** - Lightweight state management solution
- **Lucide React** - Beautiful SVG icon components
- **Recharts** - Declarative charting library built on D3
- **React Markdown** - Markdown rendering component

## 📱 Screenshots

*(Add screenshots of your application here)*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Backend framework
- [Next.js](https://nextjs.org/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework