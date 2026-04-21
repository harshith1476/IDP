# 🚀 Complete Setup Guide - From Zero to Running Backend

This guide will take you from having nothing installed to having a fully running backend.

---

## 📋 Step-by-Step Instructions

### **STEP 1: Run the Installation Script**

This will automatically download and install Java 17, Maven, and set up everything needed.

#### Option A: Double-Click Method (Easiest)
1. Open File Explorer
2. Navigate to: `C:\Users\yelet\Desktop\DRIMS-master\backend`
3. Find the file: `INSTALL_ALL.bat`
4. **Right-click** on `INSTALL_ALL.bat`
5. Select **"Run as administrator"** (recommended for permanent setup)
6. Click "Yes" if Windows asks for permission
7. Wait for the installation to complete (this may take 5-10 minutes)

#### Option B: PowerShell Method
1. Press `Win + X` and select "Windows PowerShell (Admin)" or "Terminal (Admin)"
2. Navigate to the backend folder:
   ```powershell
   cd C:\Users\yelet\Desktop\DRIMS-master\backend
   ```
3. Run the installation script:
   ```powershell
   powershell -ExecutionPolicy Bypass -File install-all-dependencies.ps1
   ```
4. Wait for the installation to complete

#### What the Script Does:
- ✅ Downloads and installs Java 17 JDK
- ✅ Downloads and installs Apache Maven
- ✅ Sets up Maven Wrapper (backup method)
- ✅ Configures environment variables (JAVA_HOME, PATH)
- ✅ Verifies everything is working

**Expected Output:**
You should see messages like:
- ✅ Java 17: [path]
- ✅ Maven: [path]
- ✅ Maven Wrapper: Available

---

### **STEP 2: Close and Reopen Your Terminal**

**IMPORTANT:** After installation, you MUST close and reopen your terminal/PowerShell for environment variables to take effect.

1. Close your current PowerShell/Command Prompt window
2. Open a new PowerShell window (as Administrator if possible)
3. Navigate to the backend folder again:
   ```powershell
   cd C:\Users\yelet\Desktop\DRIMS-master\backend
   ```

---

### **STEP 3: Verify Java is Installed**

Check if Java is working:

```powershell
java -version
```

**Expected Output:**
```
openjdk version "17.0.x" ...
```

If you see an error like `'java' is not recognized`, the installation didn't work. Try:
1. Restart your computer
2. Or manually set JAVA_HOME (see Troubleshooting section)

---

### **STEP 4: Verify Maven is Installed**

Check if Maven is working:

```powershell
mvn -version
```

**Expected Output:**
```
Apache Maven 3.9.6
Maven home: C:\Program Files\Apache\maven
Java version: 17.0.x
```

**If Maven is NOT found**, don't worry! You can use Maven Wrapper instead:
```powershell
.\mvnw.cmd -version
```

---

### **STEP 5: Set Up MongoDB**

The backend needs MongoDB to store data. You have two options:

#### **Option A: Install MongoDB Locally (Recommended for Development)**

1. **Download MongoDB:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select:
     - Version: Latest (7.0 or higher)
     - Platform: Windows
     - Package: MSI
   - Click "Download"

2. **Install MongoDB:**
   - Run the downloaded `.msi` file
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service"
   - Check "Install MongoDB Compass" (optional GUI tool)
   - Click "Install"
   - Wait for installation to complete

3. **Start MongoDB Service:**
   ```powershell
   net start MongoDB
   ```

   **Expected Output:**
   ```
   The MongoDB service was started successfully.
   ```

4. **Verify MongoDB is Running:**
   ```powershell
   Get-Service MongoDB
   ```
   
   Status should show: **Running**

#### **Option B: Use MongoDB Atlas (Cloud - Free)**

1. **Create Account:**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Click "Try Free"
   - Sign up for a free account

2. **Create a Cluster:**
   - Click "Build a Database"
   - Choose "M0 FREE" (Free tier)
   - Select a cloud provider and region
   - Click "Create"

3. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)

4. **Update application.properties:**
   - Open: `C:\Users\yelet\Desktop\DRIMS-master\backend\src\main\resources\application.properties`
   - Find the line: `spring.data.mongodb.uri=...`
   - Replace it with your Atlas connection string:
     ```properties
     spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/drims
     ```
   - Save the file

---

### **STEP 6: Build the Backend Project**

Now that everything is installed, build the project:

```powershell
cd C:\Users\yelet\Desktop\DRIMS-master\backend
```

**If Maven is installed:**
```powershell
mvn clean install
```

**If Maven is NOT installed (use Maven Wrapper):**
```powershell
.\mvnw.cmd clean install
```

**What This Does:**
- Downloads all project dependencies
- Compiles the Java code
- Runs tests
- Creates the executable JAR file

**Expected Output:**
```
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

**This may take 2-5 minutes the first time** (downloading dependencies).

**If you see errors:**
- Make sure Java 17 is installed: `java -version`
- Make sure you're in the `backend` folder
- Check your internet connection (needed to download dependencies)

---

### **STEP 7: Run the Backend**

Once the build is successful, start the backend:

**If Maven is installed:**
```powershell
mvn spring-boot:run
```

**If Maven is NOT installed (use Maven Wrapper):**
```powershell
.\mvnw.cmd spring-boot:run
```

**Expected Output:**
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)

...
Started DRIMSApplication in X.XXX seconds
```

**Success Indicators:**
- ✅ You see "Started DRIMSApplication"
- ✅ No error messages about MongoDB connection
- ✅ The terminal keeps running (don't close it!)

**The backend is now running at:** `http://localhost:8080`

---

### **STEP 8: Verify Backend is Working**

Open a new browser or use PowerShell to test:

**Option 1: Browser Test**
- Open your browser
- Go to: `http://localhost:8080`
- You might see an error page (that's OK - it means the server is running!)

**Option 2: PowerShell Test**
Open a NEW PowerShell window (keep the backend running in the first one):

```powershell
Invoke-WebRequest -Uri http://localhost:8080 -UseBasicParsing
```

If you get a response (even an error), the backend is running!

---

## ✅ Success Checklist

Before moving on, verify:

- [ ] Java 17 is installed (`java -version` shows version 17)
- [ ] Maven is installed OR Maven Wrapper works (`mvn -version` or `.\mvnw.cmd -version`)
- [ ] MongoDB is running (`net start MongoDB` or Atlas connection configured)
- [ ] Project builds successfully (`mvn clean install` completes without errors)
- [ ] Backend starts successfully (`mvn spring-boot:run` shows "Started DRIMSApplication")
- [ ] Backend is accessible at `http://localhost:8080`

---

## 🐛 Troubleshooting

### Problem: "java is not recognized"
**Solution:**
1. Restart your computer
2. Or manually set JAVA_HOME:
   ```powershell
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
   $env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
   ```

### Problem: "mvn is not recognized"
**Solution:**
Use Maven Wrapper instead:
```powershell
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run
```

### Problem: "MongoDB connection failed"
**Solution:**
1. If using local MongoDB:
   ```powershell
   net start MongoDB
   ```
2. If using Atlas, check your connection string in `application.properties`
3. Make sure MongoDB is actually running

### Problem: "Port 8080 is already in use"
**Solution:**
1. Find what's using port 8080:
   ```powershell
   netstat -ano | findstr :8080
   ```
2. Kill the process (replace PID with the number from above):
   ```powershell
   taskkill /PID [PID] /F
   ```
3. Or change the port in `application.properties`:
   ```properties
   server.port=8081
   ```

### Problem: Build fails with dependency errors
**Solution:**
1. Check your internet connection
2. Try again - sometimes downloads fail
3. Delete `.m2` folder (Maven cache) and rebuild:
   ```powershell
   Remove-Item -Recurse -Force $env:USERPROFILE\.m2\repository
   mvn clean install
   ```

---

## 📝 Quick Reference Commands

Once everything is set up, here are the commands you'll use:

```powershell
# Navigate to backend
cd C:\Users\yelet\Desktop\DRIMS-master\backend

# Build the project
mvn clean install
# OR
.\mvnw.cmd clean install

# Run the backend
mvn spring-boot:run
# OR
.\mvnw.cmd spring-boot:run

# Start MongoDB (if using local)
net start MongoDB

# Stop MongoDB (if needed)
net stop MongoDB

# Check if backend is running
Invoke-WebRequest -Uri http://localhost:8080 -UseBasicParsing
```

---

## 🎯 Next Steps

Once your backend is running:

1. **Keep the backend terminal open** - don't close it!

2. **Set up the frontend** (in a new terminal):
   ```powershell
   cd C:\Users\yelet\Desktop\DRIMS-master\frontend
   npm install
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

4. **Login with default credentials:**
   - Admin: `admin@drims.edu` / `admin123`
   - Faculty: `faculty@drims.edu` / `faculty123`

---

## 📞 Need Help?

If you encounter any issues:
1. Check the error message carefully
2. Review the Troubleshooting section above
3. Make sure all prerequisites are installed
4. Verify MongoDB is running
5. Check that port 8080 is available

---

**You're all set! Follow these steps in order, and you'll have the backend running in no time! 🚀**
