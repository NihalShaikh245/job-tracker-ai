## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub main branch
2. Vercel auto-deploys from `frontend/` directory
3. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
4. Access at: https://job-tracker-ai.vercel.app

### Backend (Render)
1. Connected via GitHub
2. Uses `render.yaml` configuration
3. Auto-deploys from `backend/` directory
4. Access at: https://job-tracker-api-stsv.onrender.com

## 🔧 Environment Variables

### Frontend (.env.local)