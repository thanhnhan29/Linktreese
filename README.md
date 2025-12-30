# VieLink - Link-in-Bio Platform

A modern, microservice-ready link-in-bio platform built with React, TypeScript, and Firebase. This project follows clean architecture principles with feature-based code organization.

## 🚀 Features

- **User Authentication**: Email/password sign up and login with Firebase Auth
- **Bio Page Creation**: Create personalized bio pages with unique usernames
- **Real-time Validation**: Live username availability checking
- **Responsive Design**: Clean, modern UI that works on all devices
- **Type Safety**: Full TypeScript coverage with strict mode enabled
- **AI Bio Writer**: AI-powered bio generation and improvement using Google Gemini
- **Theme System**: Comprehensive theme presets with customizable backgrounds, buttons, fonts, and colors
- **Local Image Storage**: Images stored locally using IndexedDB for MVP

## 📁 Project Structure

```
src/
├── app/                    # Application entry & providers
│   ├── App.tsx            # Main application component
│   └── providers/         # React context providers
├── features/              # Feature modules (business domains)
│   ├── auth/              # Authentication feature
│   │   ├── components/    # Login & Signup forms
│   │   ├── hooks/         # useAuth hook
│   │   ├── services/      # Auth business logic
│   │   └── types/         # Auth type definitions
│   └── bio-page/          # Bio page management
│       ├── components/    # Create username form
│       └── services/      # Bio page business logic
├── infrastructure/        # External service integrations
│   ├── firebase/          # Firebase configuration
│   └── repositories/      # Data access layer
├── shared/                # Shared/common code
│   ├── components/        # Reusable UI components
│   ├── lib/               # Utility libraries
│   └── types/             # Shared type definitions
└── main.tsx               # Application entry point
```

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI (shadcn/ui)
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Notifications**: Sonner
- **AI**: Google Gemini API
- **Local Storage**: IndexedDB for images

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project with Authentication and Firestore enabled

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd Linktreese
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** with Email/Password provider
3. Create a **Firestore** database
4. Copy your Firebase config values

### 4. Set up environment variables

```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 5. Configure Firestore Security Rules

In Firebase Console > Firestore > Rules, add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Bio pages collection
    match /bio_pages/{pageId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
  }
}
```

### 6. Run the development server

```bash
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Type check with TypeScript |

## 🏗️ Architecture

This project follows a **layered architecture** with **feature-based organization**:

### Layers

1. **Presentation Layer** (`app/`, `features/*/components/`)
   - React components
   - UI rendering and user interactions

2. **Application Layer** (`features/*/services/`, `features/*/hooks/`)
   - Business logic
   - React hooks for state management

3. **Data Access Layer** (`infrastructure/repositories/`)
   - Firestore CRUD operations
   - Data mapping

4. **Infrastructure Layer** (`infrastructure/firebase/`)
   - Firebase configuration
   - External service integrations

### Key Patterns

- **Repository Pattern**: Abstracts database operations
- **Service Layer**: Encapsulates business logic
- **Feature Modules**: Self-contained feature folders
- **Provider Pattern**: React context for auth state

## 🔐 Authentication Flow

1. **Sign Up**:
   - User enters email and password
   - Password validated (8+ chars, uppercase, lowercase, number)
   - Firebase creates auth account
   - User document created in Firestore
   - Redirected to create username

2. **Login**:
   - User enters credentials
   - Firebase validates
   - Check for existing bio pages
   - Redirect to dashboard or create username

3. **Create Username**:
   - Real-time availability checking
   - Username validation (3-30 chars, alphanumeric + underscore)
   - Bio page created in Firestore
   - Redirect to dashboard

## 📚 Documentation

See the `docs/` folder for detailed documentation:

- `user_story.md` - User stories and requirements
- `architecture.md` - System architecture details
- `data-model.md` - Database schema
- `business-rules.md` - Validation and business logic
- `code_structure.md` - Code organization guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

---

Built with ❤️ using React + TypeScript + Firebase
