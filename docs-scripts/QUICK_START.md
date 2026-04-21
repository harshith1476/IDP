# Quick Start Guide

## 🚀 Fast Setup (5 Minutes)

### Prerequisites Check
```bash
java -version    # Should show Java 17+
mvn -version     # Should show Maven 3.6+
node -version    # Should show Node 18+
npm -version     # Should show npm 9+
```

### Step 1: Start MongoDB
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod

# Or use MongoDB Atlas (cloud) - update connection string in application.properties
```

### Step 2: Start Backend
```bash
cd backend
mvn spring-boot:run
```
Wait for: `Started DRIMSApplication in X.XXX seconds`

### Step 3: Start Frontend (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

### Step 4: Login
Open browser: `http://localhost:5173`

**Admin:**
- Email: `admin@drims.edu`
- Password: `admin123`

**Faculty:**
- Email: `faculty@drims.edu`
- Password: `faculty123`

## ✅ Verification Checklist

- [ ] MongoDB is running
- [ ] Backend starts on port 8080
- [ ] Frontend starts on port 5173
- [ ] Can login with admin credentials
- [ ] Can login with faculty credentials
- [ ] Faculty can view dashboard
- [ ] Admin can view analytics

## 🐛 Common Issues

**Backend won't start:**
- Check MongoDB is running
- Check port 8080 is available
- Run `mvn clean install` first

**Frontend won't start:**
- Delete `node_modules` folder
- Run `npm install` again
- Check Node.js version (18+)

**Can't login:**
- Check backend is running
- Check MongoDB connection
- Verify credentials (case-sensitive)

**CORS errors:**
- Verify backend CORS config in `application.properties`
- Check `cors.allowed-origins` includes `http://localhost:5173`

## 📞 Need Help?

1. Check the full README.md
2. Verify all prerequisites are installed
3. Check MongoDB connection
4. Review console logs for errors

