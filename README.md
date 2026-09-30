# LearnForge - EduRecover AI

- **Team Name:** LearnForge
- **Team Leader:** Keerthana
- **Members:** Keerthana, Dharshana, Gifta Alice, Preethi
- **College:** Dhaanish Chennai College of Engineering, Chennai
- **Contact:** kannaniron1977@gmail.com / 7845189245
- **GitHub Repo (Public):** https://github.com/kannaniron1977-alt/edurecover-ai
- **Live Demo:** https://edurecover-ai.onrender.com

## Problem
Students and employees repeat the same mistakes. A correct answer with wrong reasoning is not real mastery.

## Solution
EduRecover AI finds the exact concept a learner is weak in, coaches them with AI, and only counts mastery when the reasoning is right.

## Features

**Learning and Recovery**
- Concept diagnosis: detects the exact misconception behind a wrong answer
- AI coaching with rotating teaching styles (High / Medium / Low support levels)
- Mastery counted only when the reasoning is correct, not just the answer
- Concept Map (knowledge graph) with weak / repeated / mastered status
- Master quiz with revision summary and level result
- Learning Path, Daily Tasks, Analytics

**Career Preparation**
- Aptitude practice
- Company-style timed tests (TCS / Infosys / Wipro style) with negative marking and server-side timer
- Interview Question Bank and AI Mock Interview with feedback
- Resume Analyzer (ATS score + AI feedback)

**AI Assistants**
- AI Coaching and AI Chatbot (Tanglish friendly)
- Voice support and multi-language interface

**Engagement**
- Coins and rewards (2 tasks = 100 coins, 1000 coins to unlock a course)
- Leaderboard and badges

**Roles and Safety**
- Student, Employee, Interviewer, Teacher, Admin logins
- Teacher dashboard, Interviewer candidate view, Admin user management
- Face guard for exam integrity

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: SQLite (better-sqlite3)
- AI: Google Gemini API
- Deployment: Render (auto-deploy from GitHub)

## Security
- Passwords hashed with scrypt
- API keys in environment variables only (not in the repo)
- Aptitude answers are checked on the server; correct answers are never sent to the browser
- Role-based access for Teacher, Interviewer and Admin routes

## Run locally
    npm install
    cp server/.env.example server/.env    (add your GEMINI_API_KEY)
    npm run dev

Client: http://localhost:5173  |  API: http://localhost:3001

## Demo login
- Student: student@edurecover.ai / Student@123
- Interviewer: interviewer@edurecover.ai / Interview@123

## Note
The live demo runs on a free plan, so the first load may take 30 to 50 seconds and saved data can reset on restart. Aptitude tests are "company-style" practice questions, not real company papers.