# 🚀 Code Guardian Deployment Guide

**Deploy your Code Guardian project for FREE using Vercel + Render**

This guide will help you deploy your Spring Boot + React project without spending any money and without complex DevOps knowledge.

---

## 📋 Prerequisites Checklist

- [x] **GitHub Account**: For repository hosting
- [x] **Vercel Account**: Free account at [vercel.com](https://vercel.com)
- [x] **Render Account**: Free account at [render.com](https://render.com)
- [x] **Git**: Installed on your computer
- [x] **Project Ready**: Your Code Guardian project working locally

---

## 🎯 Deployment Architecture

```
┌─────────────────────────────┐
│  Frontend (React)           │
│  ✅ Deployed on Vercel      │
│  🌐 https://your-app.vercel.app
└─────────────────────────────┘
              │
              │ HTTP Requests
              ▼
┌─────────────────────────────┐
│  Backend (Spring Boot)      │
│  ✅ Deployed on Render      │
│  🌐 https://your-backend.onrender.com
└─────────────────────────────┘
```

---

## 🏗️ Step 1: Prepare Your Project

### 1.1 Verify Your Project Structure
```
code-guardian/
├── backend/          # Spring Boot application
├── frontend/         # React application
├── README.md
└── .gitignore
```

### 1.2 Check Current Configuration
Your project is already configured for deployment with:
- ✅ Dynamic port configuration: `server.port=${PORT:8085}`
- ✅ CORS configured for Vercel: `https://*.vercel.app`
- ✅ Environment variable support in React: `REACT_APP_API_URL`

---

## 📦 Step 2: Push to GitHub

### 2.1 Create GitHub Repository
1. Go to [github.com](https://github.com) and click **"New Repository"**
2. Name it: `code-guardian` (or your preferred name)
3. Make it **Public** (required for free Render deployment)
4. Don't initialize with README (you already have one)
5. Click **"Create Repository"**

### 2.2 Push Your Code
```bash
# Navigate to your project directory
cd C:\Project\Code-Guardian

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your code
git commit -m "Initial Code Guardian project"

# Add GitHub remote (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/code-guardian.git

# Push to GitHub
git push -u origin main
```

---

## 🚀 Step 3: Deploy Backend on Render

### 3.1 Sign Up for Render
1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with your GitHub account

### 3.2 Deploy Spring Boot Backend
1. **Click "New Web Service"**
2. **Connect Repository**: Select your `code-guardian` repository
3. **Configure Service**:
   ```
   Name: code-guardian-backend
   Region: Oregon (US West) - Free tier
   Branch: main
   Root Directory: backend
   Runtime: Java
   Build Command: ./mvnw package -DskipTests
   Start Command: java -jar target/code-guardian-backend-0.0.1-SNAPSHOT.jar
   ```
4. **Instance Type**: Select **"Free"** ($0/month)
5. **Click "Create Web Service"**

### 3.3 Configure Environment Variables
In your Render service dashboard:
1. Go to **Environment** tab
2. Add these variables:
   ```
   JAVA_OPTS=-Xmx256m -Xms128m
   SPRING_PROFILES_ACTIVE=production
   ```

### 3.4 Wait for Deployment
- ⏱️ First deployment takes 5-10 minutes
- ✅ Success: You'll see "Your service is live"
- 📝 Note your backend URL: `https://code-guardian-backend.onrender.com`

### 3.5 Test Backend
```bash
# Test health endpoint (replace with your actual URL)
curl https://code-guardian-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "UP",
  "service": "Code Guardian Scanner",
  "version": "1.0.0"
}
```

---

## 🌐 Step 4: Deploy Frontend on Vercel

### 4.1 Sign Up for Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Start Deploying"**
3. Sign up with your GitHub account

### 4.2 Deploy React Frontend
1. **Click "New Project"**
2. **Import Repository**: Select your `code-guardian` repository
3. **Configure Project**:
   ```
   Framework Preset: Create React App
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```
4. **Environment Variables**: Click "Add" and set:
   ```
   Name: REACT_APP_API_URL
   Value: https://code-guardian-backend.onrender.com/api
   ```
   ⚠️ **Replace with your actual Render backend URL!**

5. **Click "Deploy"**

### 4.3 Wait for Deployment
- ⏱️ Deployment takes 2-3 minutes
- ✅ Success: You'll see "Your project is live"
- 📝 Note your frontend URL: `https://code-guardian.vercel.app`

---

## ✅ Step 5: Test Your Deployment

### 5.1 Test Frontend
1. **Open your Vercel URL** in browser
2. **Verify**:
   - ✅ Page loads correctly
   - ✅ No console errors
   - ✅ UI looks correct

### 5.2 Test Full Integration
1. **Paste some test code** in the code editor:
   ```javascript
   const apiKey = "sk-1234567890abcdef";
   const password = "mypassword123";
   console.log("Testing security scan");
   ```
2. **Click "Scan Code"**
3. **Verify**:
   - ✅ Scan completes successfully
   - ✅ Results show security findings
   - ✅ No connection errors

---

## 🛠️ Step 6: Custom Domain (Optional)

### 6.1 Vercel Custom Domain
1. In Vercel dashboard → **Settings** → **Domains**
2. Add your domain (e.g., `codeguardian.com`)
3. Follow DNS setup instructions

### 6.2 Render Custom Domain
1. In Render dashboard → **Settings** → **Custom Domains**
2. Add your API subdomain (e.g., `api.codeguardian.com`)
3. Update frontend environment variable

---

## 🚨 Troubleshooting

### Backend Issues

**❌ Build Failed**
```bash
# Check Maven build locally
cd backend
./mvnw package -DskipTests
```

**❌ Service Won't Start**
- Check Render logs in dashboard
- Verify Java version compatibility
- Ensure port configuration: `server.port=${PORT:8085}`

**❌ CORS Errors**
- Verify CORS configuration includes `*.vercel.app`
- Check frontend URL in environment variables

### Frontend Issues

**❌ Build Failed**
```bash
# Test build locally
cd frontend
npm install
npm run build
```

**❌ API Connection Failed**
- Verify `REACT_APP_API_URL` environment variable
- Check backend URL is correct and accessible
- Test backend health endpoint manually

**❌ Environment Variables Not Working**
- Environment variables must start with `REACT_APP_`
- Redeploy after adding environment variables
- Check browser Network tab for actual request URLs

---

## 📊 Platform Limitations (Free Tiers)

### Render Free Tier
- ✅ **Good**: 512MB RAM, 0.1 CPU
- ⚠️ **Limitation**: Sleeps after 15 minutes of inactivity
- ⚠️ **Limitation**: 750 hours/month (about 25 days)
- 💡 **Tip**: First request after sleep takes ~30 seconds

### Vercel Free Tier
- ✅ **Good**: 100GB bandwidth, Global CDN
- ✅ **Good**: Instant deployment, No sleep
- ⚠️ **Limitation**: 6,000 build minutes/month
- 💡 **Tip**: More than enough for personal projects

---

## 🎉 Congratulations!

Your Code Guardian project is now live and accessible worldwide!

### 📋 What You Have Now:
- ✅ **Frontend**: Fast, globally distributed React app
- ✅ **Backend**: Scalable Spring Boot API
- ✅ **Free**: $0 monthly cost
- ✅ **Professional**: Real URLs for your portfolio
- ✅ **Shareable**: Send links to employers or teammates

### 🔗 Share Your Project:
- **Live Demo**: `https://your-project.vercel.app`
- **GitHub Repo**: `https://github.com/username/code-guardian`
- **Portfolio**: Add both links to your resume!

---

## 🔄 Making Updates

### Frontend Updates
```bash
# Make changes to frontend
git add frontend/
git commit -m "Update frontend feature"
git push origin main
# ✅ Vercel auto-deploys in ~2 minutes
```

### Backend Updates
```bash
# Make changes to backend
git add backend/
git commit -m "Update backend API"
git push origin main
# ✅ Render auto-deploys in ~5 minutes
```

---

## 📚 Next Steps

1. **Custom Domain**: Consider getting a custom domain
2. **Monitoring**: Set up uptime monitoring (Render can sleep)
3. **Analytics**: Add Google Analytics to track usage
4. **Documentation**: Update README with live demo links
5. **Showcase**: Add to your portfolio and LinkedIn

---

**Need Help?** Open an issue in your GitHub repository or check the platform-specific documentation:
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs) 