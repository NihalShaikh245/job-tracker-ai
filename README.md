# 🚀 JobTracker AI - AI-Powered Job Tracking System

An intelligent job tracking application with AI-powered matching, smart application tracking, and natural language search.

## ✨ Features

### 🤖 AI-Powered Features
- **Smart Job Matching**: AI scores jobs against your resume (0-100%)
- **AI Chat Assistant**: Natural language job search and app guidance
- **Match Explanations**: See why jobs match your skills

### 📋 Job Management
- **Real-time Job Feed**: Fetches from RapidAPI JSearch
- **Advanced Filters**: Role, skills, location, date, job type, work mode
- **Best Matches**: Highlights top 6 matching jobs

### 📊 Application Tracking
- **Smart Apply Popup**: Tracks when you apply to jobs
- **Status Pipeline**: Applied → Interview → Offer/Rejected
- **Dashboard**: Visual timeline and statistics

## 🏗️ Architecture

┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Frontend │────▶│ Backend │────▶│ APIs │
│ (Vercel) │◀────│ (Render) │◀────│ (RapidAPI, │
│ │ │ │ │ OpenAI) │
└─────────────┘ └─────────────┘ └─────────────┘
│ │
│ │
▼ ▼
┌─────────────┐ ┌─────────────┐
│ Browser │ │ Redis │
│ (React SPA) │ │ (Upstash) │
└─────────────┘ └─────────────┘

## 🚀 Live Demo

- **Frontend**: [https://jobtracker-ai.vercel.app](https://jobtracker-ai.vercel.app)
- **Backend API**: [https://jobtracker-api.onrender.com](https://jobtracker-api.onrender.com)

## 💻 Local Development

### Prerequisites
- Node.js 18+
- npm or yarn
- API Keys: RapidAPI, OpenAI, Upstash Redis

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/job-tracker-ai.git
cd job-tracker-ai