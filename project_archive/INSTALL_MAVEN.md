# Installing Maven on Windows

## Option 1: Install Maven (Recommended)

### Step 1: Download Maven
1. Go to: https://maven.apache.org/download.cgi
2. Download: `apache-maven-3.9.6-bin.zip` (or latest version)
3. Extract to: `C:\Program Files\Apache\maven` (or your preferred location)

### Step 2: Set Environment Variables
1. Open **System Properties**:
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Or: Right-click "This PC" → Properties → Advanced system settings

2. Click **Environment Variables**

3. Under **System Variables**, click **New**:
   - Variable name: `MAVEN_HOME`
   - Variable value: `C:\Program Files\Apache\maven` (your Maven path)

4. Edit **Path** variable:
   - Click **Path** → **Edit**
   - Click **New**
   - Add: `%MAVEN_HOME%\bin`
   - Click **OK** on all dialogs

5. **Restart your terminal/PowerShell** (or restart computer)

### Step 3: Verify Installation
```powershell
mvn -version
```

You should see Maven version information.

---

## Option 2: Use Maven Wrapper (No Installation Required)

I'll set up Maven Wrapper for you so you can use `mvnw` instead of `mvn` without installing Maven globally.

---

## Option 3: Use Chocolatey (If you have it)

```powershell
choco install maven
```

---

## Quick Test After Installation

After installing Maven, test it:
```powershell
cd backend
mvn --version
mvn clean install
mvn spring-boot:run
```

