# ✅ Quick Next Steps - You're Almost There!

## Current Status:
- ✅ Java 21 installed (works fine!)
- ✅ Maven Wrapper available (use this instead of Maven)
- ✅ MongoDB running
- ⚠️ Maven not installed globally (but that's OK!)

---

## 🚀 Build and Run the Backend (3 Simple Commands)

Open PowerShell in the backend folder and run:

### Step 1: Navigate to backend folder
```powershell
cd C:\Users\yelet\Desktop\DRIMS-master\backend
```

### Step 2: Build the project
```powershell
.\mvnw.cmd clean install
```

**This will:**
- Download Maven automatically (first time only)
- Download all project dependencies
- Compile the code
- Create the executable

**Wait 2-5 minutes** (first time downloads everything)

**Expected output:**
```
[INFO] BUILD SUCCESS
```

### Step 3: Run the backend
```powershell
.\mvnw.cmd spring-boot:run
```

**Expected output:**
```
Started DRIMSApplication in X.XXX seconds
```

**✅ Backend is now running at:** `http://localhost:8080`

---

## 🎯 That's It!

Your backend should now be running. Keep the terminal open!

**To verify it's working:**
- Open browser: `http://localhost:8080`
- Or test in PowerShell: `Invoke-WebRequest -Uri http://localhost:8080 -UseBasicParsing`

---

## 📝 Optional: Install Maven Globally (Later)

If you want to use `mvn` instead of `.\mvnw.cmd`:

1. Download manually: https://maven.apache.org/download.cgi
2. Download: `apache-maven-3.9.6-bin.zip`
3. Extract to: `C:\Program Files\Apache\maven`
4. Add to PATH: `C:\Program Files\Apache\maven\bin`
5. Restart terminal

**But you don't need to do this now!** Maven Wrapper works perfectly.

---

## 🐛 If You Get Errors

### "JAVA_HOME not found"
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
```

### "Maven Wrapper JAR not found"
The script should have downloaded it, but if not:
```powershell
powershell -ExecutionPolicy Bypass -File download-wrapper.ps1
```

### "MongoDB connection failed"
MongoDB is running, but if you get connection errors:
- Check MongoDB is running: `Get-Service MongoDB`
- Or use MongoDB Atlas (cloud) instead

---

**You're ready to go! Run the 3 commands above and you'll have the backend running! 🎉**
