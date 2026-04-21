# Quick Fix: Maven Not Found

## 🚀 Fastest Solution (Choose One)

### Solution 1: Install Maven (5 minutes)

1. **Download Maven:**
   - Go to: https://maven.apache.org/download.cgi
   - Download: `apache-maven-3.9.6-bin.zip` (or latest)

2. **Extract:**
   - Extract to: `C:\Program Files\Apache\maven`

3. **Add to PATH:**
   - Press `Win + X` → System → Advanced system settings
   - Click "Environment Variables"
   - Under "System variables", find "Path" → Edit
   - Click "New" → Add: `C:\Program Files\Apache\maven\bin`
   - Click OK on all dialogs

4. **Restart PowerShell/Terminal**

5. **Test:**
   ```powershell
   mvn -version
   ```

---

### Solution 2: Use Chocolatey (If installed)

```powershell
choco install maven
```

Then restart terminal and test:
```powershell
mvn -version
```

---

### Solution 3: Manual Maven Wrapper Setup

If you can't install Maven, I can help you set up Maven Wrapper. Let me know and I'll create the wrapper files.

---

### Solution 4: Run with Java Directly (Temporary)

You can compile and run manually, but it's complex. Installing Maven is much easier.

---

## ✅ After Installing Maven

Once Maven is installed, run:

```powershell
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

---

## Need Help?

If you're having trouble, let me know and I can:
1. Create Maven Wrapper files for you
2. Provide step-by-step screenshots guide
3. Help troubleshoot installation issues

