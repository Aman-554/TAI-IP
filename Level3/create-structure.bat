@echo off
echo Creating Movie Recommendation App Project Structure...

REM Create main directory
mkdir movie-recommendation-app
cd movie-recommendation-app

REM Create backend structure
mkdir server\config server\controllers server\middleware server\models server\routes server\utils

REM Create backend files
cd server
type nul > server.js
type nul > .env
type nul > .env.example
type nul > package.json

cd config
type nul > db.js
type nul > tmdb.js
cd ..

cd controllers
type nul > authController.js
type nul > movieController.js
type nul > ratingController.js
type nul > recommendationController.js
type nul > watchlistController.js
cd ..

cd middleware
type nul > authMiddleware.js
type nul > errorMiddleware.js
type nul > validationMiddleware.js
cd ..

cd models
type nul > User.js
type nul > Rating.js
type nul > Watchlist.js
cd ..

cd routes
type nul > authRoutes.js
type nul > movieRoutes.js
type nul > ratingRoutes.js
type nul > recommendationRoutes.js
type nul > watchlistRoutes.js
cd ..

cd utils
type nul > recommendationEngine.js
type nul > helpers.js
cd ..

cd ..

REM Create frontend structure
mkdir client\css client\js

cd client
type nul > css\style.css

cd js
type nul > api.js
type nul > auth.js
type nul > components.js
type nul > main.js
type nul > movies.js
type nul > recommendations.js
type nul > watchlist.js
cd ..

type nul > index.html
type nul > login.html
type nul > register.html
type nul > movies.html
type nul > movie-details.html
type nul > recommendations.html
type nul > profile.html

cd ..

REM Create root files
type nul > .gitignore
type nul > README.md

echo Project structure created successfully!
echo Location: %cd%
pause