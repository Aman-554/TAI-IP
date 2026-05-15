-- Create database
CREATE DATABASE IF NOT EXISTS learnhub_lms;
USE learnhub_lms;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    streak INT DEFAULT 0,
    last_login DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roadmaps table
CREATE TABLE IF NOT EXISTS roadmaps (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    category ENUM('MERN', 'DSA', 'AI/ML', 'Java', 'Python') NOT NULL,
    description TEXT,
    thumbnail VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modules table
CREATE TABLE IF NOT EXISTS modules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    roadmap_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    order_index INT DEFAULT 0,
    FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    module_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    youtube_url VARCHAR(500),
    playlist_url VARCHAR(500),
    resources TEXT,
    notes TEXT,
    duration VARCHAR(50),
    order_index INT DEFAULT 0,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    roadmap_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (user_id, roadmap_id)
);

-- Completed lessons table
CREATE TABLE IF NOT EXISTS completed_lessons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    lesson_id INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    UNIQUE KEY unique_completion (user_id, lesson_id)
);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    lesson_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    UNIQUE KEY unique_bookmark (user_id, lesson_id)
);

-- Insert sample data
INSERT INTO roadmaps (title, category, description, thumbnail) VALUES
('Complete MERN Stack Developer', 'MERN', 'Master MongoDB, Express.js, React, and Node.js to become a full-stack developer', 'https://via.placeholder.com/300x200'),
('DSA Mastery', 'DSA', 'Master Data Structures and Algorithms for coding interviews', 'https://via.placeholder.com/300x200'),
('AI/ML Fundamentals', 'AI/ML', 'Learn Artificial Intelligence and Machine Learning basics', 'https://via.placeholder.com/300x200'),
('Java Spring Boot', 'Java', 'Master Java and Spring Boot framework', 'https://via.placeholder.com/300x200'),
('Python for Data Science', 'Python', 'Learn Python programming and data science libraries', 'https://via.placeholder.com/300x200');

INSERT INTO modules (roadmap_id, title, description, order_index) VALUES
(1, 'HTML/CSS Fundamentals', 'Learn the basics of web development', 1),
(1, 'JavaScript Essentials', 'Master JavaScript programming', 2),
(1, 'React.js Mastery', 'Build modern UIs with React', 3);

INSERT INTO lessons (module_id, title, youtube_url, resources, duration) VALUES
(1, 'HTML Crash Course', 'https://www.youtube.com/embed/UB1O30fR-EE', 'https://www.w3schools.com/html/', '1 hour'),
(1, 'CSS Flexbox & Grid', 'https://www.youtube.com/embed/JJSoEo8JSnc', 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', '1.5 hours'),
(2, 'JavaScript Basics', 'https://www.youtube.com/embed/PkZNo7MFNFg', 'https://javascript.info/', '2 hours');