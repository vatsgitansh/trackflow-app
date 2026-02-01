# TrackFlow - Habit & Expense Tracker

## 🚀 Features
- Habit tracking with streak counters
- Expense management with category filtering
- Beautiful dashboard with analytics
- Dark mode & Focus mode
- Premium subscription page (payment integration ready)
- JWT authentication

## 🛠️ Tech Stack
- **Frontend:** React, Tailwind CSS, Framer Motion
- **Backend:** FastAPI, Python
- **Database:** MongoDB
- **Design:** Outfit & DM Sans fonts, Glassmorphism effects

## 📦 Deployment on Railway

### Prerequisites
- GitHub account
- Railway account (free)

### Steps

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Railway:**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect and deploy both services

3. **Add MongoDB:**
   - In Railway dashboard, click "New"
   - Select "Database" → "Add MongoDB"
   - Copy the connection string

4. **Configure Environment Variables:**
   
   **Backend Service:**
   ```
   MONGO_URL=<your-railway-mongodb-url>
   DB_NAME=trackflow
   JWT_SECRET=your-secret-key-here
   CORS_ORIGINS=https://your-frontend-url.railway.app
   ```
   
   **Frontend Service:**
   ```
   REACT_APP_BACKEND_URL=https://your-backend-url.railway.app
   ```

5. **Deploy!** Railway will automatically deploy your app.

## 💰 Monetization
- AdSense integration spots ready
- Premium subscription infrastructure built
- Razorpay/Google Pay integration ready

## 🔮 Future Enhancements
- UPI auto-tracking via SMS/bank APIs
- Email reminders for habits
- Advanced analytics (charts, trends)
- Export data (PDF/Excel)

---

Built with ❤️ using Emergent