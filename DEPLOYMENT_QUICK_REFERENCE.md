# 🚀 Deployment Quick Reference

## 📋 Essential Commands

### 🔧 Backend (Render)
```bash
# Build Command
./mvnw package -DskipTests

# Start Command  
java -jar target/code-guardian-backend-0.0.1-SNAPSHOT.jar

# Test Health Check
curl https://your-backend.onrender.com/api/health
```

### 📱 Frontend (Vercel)
```bash
# Build Command
npm run build

# Environment Variable
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

## 🔗 Platform Settings

### Render Configuration
```yaml
Name: code-guardian-backend
Runtime: Java
Root Directory: backend
Instance Type: Free
Environment Variables:
  - JAVA_OPTS=-Xmx256m -Xms128m
  - SPRING_PROFILES_ACTIVE=production
```

### Vercel Configuration
```yaml
Framework: Create React App
Root Directory: frontend
Environment Variables:
  - REACT_APP_API_URL=https://your-backend.onrender.com/api
```

## ✅ Verification Checklist

- [ ] Backend health endpoint responds with 200
- [ ] Frontend loads without console errors
- [ ] Code scanning functionality works end-to-end
- [ ] CORS allows frontend to call backend
- [ ] Both services auto-deploy on git push

## 🔍 Quick Test
```bash
# Run verification script
node verify-deployment.js https://your-frontend.vercel.app https://your-backend.onrender.com

# Manual test
curl https://your-backend.onrender.com/api/health
```

## 📞 Support Links
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Code Guardian GitHub](https://github.com/your-username/code-guardian) 