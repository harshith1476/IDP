# 🚀 Install Maven Automatically - Just 2 Clicks!

## ✅ Simple Steps:

### Step 1: Run the Installer
1. Go to: `C:\Users\yelet\Desktop\DRIMS-master\backend`
2. Find: **`INSTALL_MAVEN.bat`**
3. **Right-click** on it
4. Select **"Run as administrator"**
5. Click **"Yes"** when Windows asks for permission

### Step 2: Wait
- The script will automatically:
  - ✅ Download Maven 3.9.6
  - ✅ Install it to your computer
  - ✅ Set up all environment variables
  - ✅ Verify the installation

**This takes 2-5 minutes** (downloading ~10MB file)

### Step 3: Close and Reopen Terminal
- **Close** your current PowerShell/Command Prompt
- **Open** a new one
- This is needed for environment variables to work

### Step 4: Verify It Worked
```powershell
mvn -version
```

You should see:
```
Apache Maven 3.9.6
Maven home: C:\Program Files\Apache\maven
```

---

## ✅ That's It!

After this, you can use `mvn` commands instead of `.\mvnw.cmd`:

```powershell
mvn clean install
mvn spring-boot:run
```

---

## 🐛 If Something Goes Wrong

The script tries multiple download sources automatically. If all fail:
1. Check your internet connection
2. Try running the script again
3. The script will show you manual download instructions if needed

---

**Just double-click `INSTALL_MAVEN.bat` as Administrator and wait! 🎉**
