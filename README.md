# 🍳 RecipeAi - AI-Powered Recipe Management Platform

A modern, full-stack web application that combines traditional recipe management with cutting-edge AI technology to help users discover, create, and plan their culinary journey. Built with Next.js 15, React 19, and TypeScript for optimal performance and developer experience.

![RecipeAi Banner](https://via.placeholder.com/800x200/FF7F7F/FFFFFF?text=RecipeAi+-+AI+Powered+Recipe+Management)

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Future Enhancements](#future-enhancements)
- [Contributors](#contributors)
- [License](#license)

## 🎯 Overview

RecipeAi is a comprehensive recipe management platform that empowers users to:
- **Manage Recipes**: Create, read, update, and delete personal recipes with a beautiful, intuitive interface
- **AI Recipe Generation**: Get AI-powered recipe suggestions based on available ingredients
- **Meal Planning**: Generate personalized meal plans using AI technology
- **Secure Authentication**: Robust user authentication and authorization system
- **Responsive Design**: Seamless experience across all devices

The application demonstrates modern full-stack development practices, including server-side rendering, type safety, and optimized performance.

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons

### Backend & Database
- **Node.js** - JavaScript runtime
- **MongoDB** - NoSQL database for flexible data storage
- **JWT Authentication** - Secure token-based authentication

### Development & Testing
- **Jest** - JavaScript testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code linting and formatting
- **Babel** - JavaScript compiler

### Deployment
- **Vercel** - Frontend deployment platform
- **CI/CD** - Automated testing and deployment

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login system
- JWT-based secure authentication
- Protected routes and API endpoints
- Persistent login sessions

### 📝 Recipe Management (CRUD)
- **Create**: Add new recipes with ingredients and instructions
- **Read**: View all personal recipes in a responsive grid
- **Update**: Edit existing recipes with real-time validation
- **Delete**: Remove recipes with confirmation

### 🤖 AI-Powered Features
- **Recipe Suggestions**: AI generates recipes based on available ingredients
- **Meal Planning**: Personalized meal plans with dietary preferences
- **Smart Input**: Dynamic ingredient input with chips/tags interface

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: Comprehensive error management and user feedback

### ⚡ Performance & Optimization
- **Server-Side Rendering (SSR)**: Fast initial page loads
- **Static Generation**: Optimized static assets
- **Code Splitting**: Efficient bundle loading
- **TypeScript**: Compile-time error checking

### 🔒 Security
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Secure API communication
- **Environment Variables**: Secure configuration management

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/kulsoomrasheed/Recipe-Meal-Planner-App.git
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 5: Run the Application
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## 📱 Usage

### Getting Started
1. **Register**: Create a new account with username, email, and password
2. **Login**: Access your account with your credentials
3. **Dashboard**: View your recipe collection and AI tools

### Key User Flows

#### Recipe Management
1. Navigate to "My Recipes" tab
2. Click "Add Recipe" to create a new recipe
3. Fill in title, ingredients, and cooking steps
4. Save and view in your recipe collection
5. Edit or delete recipes as needed

#### AI Recipe Generation
1. Go to "AI Suggestions" tab
2. Add available ingredients using the input chips
3. Click "Generate Recipe" for AI-powered suggestions
4. View detailed recipe instructions

#### Meal Planning
1. Switch to "AI Meal Planner" tab
2. Set dietary preferences and calorie goals
3. Choose planning duration (days)
4. Generate personalized meal plans

## 🌐 Deployment

### Live Deployment
- **Frontend**: [Vercel Deployment](https://recipeandmealplannerai.vercel.app)
- **Status**: ✅ Live and operational

### CI/CD Setup
The project includes automated testing and deployment:

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests for CI
npm run test:ci

# Lint code
npm run lint
```

### Environment Configuration
- Production environment variables configured in Vercel
- MongoDB Atlas for production database
- Automated builds on git push to main branch

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── app/               # Main application
│   │   └── page.tsx       # Dashboard page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── providers.tsx      # Context providers
├── components/            # Reusable UI components
│   ├── FormModal.tsx      # Modal for forms
│   ├── InputChips.tsx     # Tag input component
│   ├── Logo.tsx           # Application logo
│   ├── RecipeCard.tsx     # Recipe display card
│   ├── Spinner.tsx        # Loading spinner
│   └── TabNavigation.tsx  # Tab navigation
├── context/               # React Context providers
│   ├── AuthContext.tsx    # Authentication state
│   └── RecipesContext.tsx # Recipes state management
└── lib/                   # Utility functions
    └── api.ts             # API client and endpoints
```

### Key Files
- `src/app/layout.tsx` - Root layout with providers
- `src/app/app/page.tsx` - Main dashboard component
- `src/context/AuthContext.tsx` - Authentication logic
- `src/lib/api.ts` - API communication layer
- `package.json` - Dependencies and scripts
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## 🧪 Testing

### Test Coverage
- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: API endpoint testing
- **E2E Tests**: User flow testing (planned)

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:ci
```

### Test Files
- `__tests__/app-page.tabs.test.js` - Tab navigation tests
- `__tests__/smoke.test.js` - Basic functionality tests
- `jest.config.js` - Jest configuration
- `jest.setup.js` - Test setup file

## 🔮 Future Enhancements

### Planned Features
- [ ] **Recipe Sharing**: Share recipes with other users
- [ ] **Nutritional Analysis**: Calculate nutritional information
- [ ] **Recipe Ratings**: User rating and review system
- [ ] **Shopping Lists**: Generate shopping lists from meal plans
- [ ] **Recipe Categories**: Organize recipes by cuisine type
- [ ] **Image Upload**: Add photos to recipes
- [ ] **Offline Support**: PWA capabilities
- [ ] **Social Features**: Follow other users and their recipes

### Technical Improvements
- [ ] **Performance**: Implement React Query for better caching
- [ ] **Testing**: Add comprehensive E2E tests with Playwright
- [ ] **Monitoring**: Add error tracking and analytics
- [ ] **Accessibility**: Improve WCAG compliance
- [ ] **Internationalization**: Multi-language support

## 👥 Contributors

### Developer
**Kulsoom Rasheed** - Full-Stack Developer

- 🌐 **Portfolio**: [kulsoomrasheed.netlify.app](https://kulsoomrasheed.netlify.app)
- 💼 **LinkedIn**: [linkedin.com/in/kulsoom-rasheed-a5b5a0278](https://www.linkedin.com/in/kulsoom-rasheed-a5b5a0278/)
- 🐙 **GitHub**: [github.com/kulsoomrasheed](https://github.com/kulsoomrasheed)
- 📧 **Email**: rasheedamaan111@gmail.com

### About the Developer
Kulsoom is a passionate MERN stack developer with expertise in modern web technologies. She specializes in creating full-stack applications with beautiful UI/UX and robust backend logic. This project demonstrates her skills in React, Next.js, TypeScript, and AI integration.

## 📄 License

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

---

<div align="center">

**Built with ❤️ by [Kulsoom Rasheed](https://github.com/kulsoomrasheed)**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kulsoom-rasheed-a5b5a0278/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/kulsoomrasheed)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=todoist&logoColor=white)](https://kulsoomrasheed.netlify.app)

</div>