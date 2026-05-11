@echo off
echo Creating QuizVerse project structure...

:: Root folder
mkdir quizverse
cd quizverse

:: =========================
:: FRONTEND
:: =========================

mkdir frontend
cd frontend

mkdir public
mkdir public\sounds
mkdir public\thumbnails

type nul > public\sounds\correct.mp3
type nul > public\sounds\wrong.mp3
type nul > public\sounds\complete.mp3

mkdir src
cd src

:: Components
mkdir components
mkdir components\common
mkdir components\quiz
mkdir components\admin

type nul > components\common\Navbar.jsx
type nul > components\common\Sidebar.jsx
type nul > components\common\LoadingSpinner.jsx
type nul > components\common\Toast.jsx
type nul > components\common\ProtectedRoute.jsx

type nul > components\quiz\QuizCard.jsx
type nul > components\quiz\QuestionCard.jsx
type nul > components\quiz\Timer.jsx
type nul > components\quiz\ProgressBar.jsx
type nul > components\quiz\LeaderboardTable.jsx

type nul > components\admin\QuizForm.jsx
type nul > components\admin\QuestionForm.jsx
type nul > components\admin\UserManagementTable.jsx

:: Pages
mkdir pages

type nul > pages\Landing.jsx
type nul > pages\Login.jsx
type nul > pages\Register.jsx
type nul > pages\HomeDashboard.jsx
type nul > pages\QuizDetails.jsx
type nul > pages\QuizPlaying.jsx
type nul > pages\Result.jsx
type nul > pages\Leaderboard.jsx
type nul > pages\Profile.jsx
type nul > pages\AdminDashboard.jsx
type nul > pages\CreateQuiz.jsx
type nul > pages\EditQuiz.jsx
type nul > pages\NotFound.jsx

:: Context
mkdir context

type nul > context\AuthContext.jsx
type nul > context\ThemeContext.jsx
type nul > context\SocketContext.jsx

:: Services
mkdir services

type nul > services\api.js
type nul > services\authService.js
type nul > services\quizService.js
type nul > services\leaderboardService.js

:: Hooks
mkdir hooks

type nul > hooks\useAuth.js
type nul > hooks\useQuiz.js
type nul > hooks\useSound.js

:: Utils
mkdir utils

type nul > utils\constants.js
type nul > utils\helpers.js
type nul > utils\validators.js

:: Styles
mkdir styles
type nul > styles\globals.css

:: Root frontend files
type nul > App.jsx
type nul > main.jsx
type nul > routes.jsx

cd ..

type nul > .env
type nul > package.json
type nul > vite.config.js
type nul > tailwind.config.js

cd ..

:: =========================
:: BACKEND
:: =========================

mkdir backend
cd backend

mkdir src
cd src

:: Config
mkdir config

type nul > config\database.js
type nul > config\passport.js
type nul > config\socket.js

:: Models
mkdir models

type nul > models\User.js
type nul > models\Quiz.js
type nul > models\Question.js
type nul > models\Result.js
type nul > models\Leaderboard.js

:: Controllers
mkdir controllers

type nul > controllers\authController.js
type nul > controllers\quizController.js
type nul > controllers\questionController.js
type nul > controllers\resultController.js
type nul > controllers\leaderboardController.js
type nul > controllers\userController.js

:: Middleware
mkdir middleware

type nul > middleware\authMiddleware.js
type nul > middleware\errorMiddleware.js
type nul > middleware\validationMiddleware.js
type nul > middleware\uploadMiddleware.js

:: Routes
mkdir routes

type nul > routes\authRoutes.js
type nul > routes\quizRoutes.js
type nul > routes\questionRoutes.js
type nul > routes\resultRoutes.js
type nul > routes\leaderboardRoutes.js
type nul > routes\userRoutes.js

:: Services
mkdir services

type nul > services\emailService.js
type nul > services\aiQuizService.js
type nul > services\streakService.js

:: Utils
mkdir utils

type nul > utils\AppError.js
type nul > utils\catchAsync.js
type nul > utils\helpers.js

:: App file
type nul > app.js

cd ..

type nul > server.js
type nul > .env
type nul > package.json

cd ..

echo.
echo QuizVerse project structure created successfully!
pause