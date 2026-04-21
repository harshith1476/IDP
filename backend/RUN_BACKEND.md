# How to Run the Backend (Maven Wrapper Method)

## ✅ Maven Wrapper is Already Set Up!

You can now run the backend **without installing Maven globally**.

## 🚀 Quick Start

### Step 1: Set JAVA_HOME (One-time setup)

**Option A: Set for this session only (temporary)**
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-22"
```

**Option B: Set permanently (recommended)**
1. Press `Win + X` → System → Advanced system settings
2. Click "Environment Variables"
3. Under "System variables", click "New"
4. Variable name: `JAVA_HOME`
5. Variable value: `C:\Program Files\Java\jdk-22`
6. Click OK on all dialogs
7. **Restart PowerShell/Terminal**

### Step 2: Navigate to backend folder
```powershell
cd C:\Users\vemul\OneDrive\Desktop\AJP-Pro\backend
```

### Step 3: Run the backend
```powershell
.\mvnw.cmd spring-boot:run
```

Or if JAVA_HOME is set permanently:
```powershell
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run
```

## 📝 Available Commands

Instead of `mvn`, use `.\mvnw.cmd`:

```powershell
.\mvnw.cmd --version          # Check Maven version
.\mvnw.cmd clean install      # Build the project
.\mvnw.cmd spring-boot:run    # Run the application
.\mvnw.cmd test               # Run tests
```

## ⚠️ Troubleshooting

### If you get "JAVA_HOME not found":
1. Set JAVA_HOME (see Step 1 above)
2. Or run this in PowerShell:
   ```powershell
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-22"
   ```

### If you get "Maven Wrapper JAR not found":
Run this to download it:
```powershell
powershell -ExecutionPolicy Bypass -File download-wrapper.ps1
```

### If MongoDB connection fails:
1. Make sure MongoDB is running
2. Check `application.properties` for correct MongoDB URI

## ✅ Success Indicators

When the backend starts successfully, you'll see:
```
Started DRIMSApplication in X.XXX seconds
```

The backend will be available at: `http://localhost:8080`

---

## Alternative: Install Maven Globally

If you prefer to install Maven globally (so you can use `mvn` anywhere):

1. Download from: https://maven.apache.org/download.cgi
2. Extract to: `C:\Program Files\Apache\maven`
3. Add to PATH: `C:\Program Files\Apache\maven\bin`
4. Restart terminal
5. Then use: `mvn spring-boot:run`

But **Maven Wrapper is easier** - no installation needed! 🎉

