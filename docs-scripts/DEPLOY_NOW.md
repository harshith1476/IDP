# 🚀 Quick Deploy to Render - Step by Step

Follow these steps to deploy your backend to Render RIGHT NOW:

## ⚡ Quick Steps

### 1. Push Your Code to GitHub
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin master
```

### 2. Get Your MongoDB Connection String

**Option A: MongoDB Atlas (Free)**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create account → Create free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Add database name: `?retryWrites=true&w=majority` → `drims?retryWrites=true&w=majority`

**Your connection string will look like:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/drims?retryWrites=true&w=majority
```

### 3. Generate JWT Secret

Run this command (or use online generator):
```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Or use:** https://www.random.org/strings/ (generate 32+ character random string)

### 4. Deploy to Render

1. **Go to:** https://dashboard.render.com
2. **Sign up/Login** (use GitHub to sign in)
3. **Click:** "New +" → "Web Service"
4. **Connect GitHub** → Select repository: `harshith1476/DRIMS`
5. **Configure:**
   - Name: `drims-backend`
   - Region: `Oregon` (or closest to you)
   - Branch: `master`
   - Root Directory: `backend` ⚠️ **IMPORTANT!**
   - Environment: `Java`
   - Build Command: `chmod +x build.sh && ./build.sh`
   - Start Command: `chmod +x start.sh && ./start.sh`
   - Plan: `Free`

6. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"
   
   Add these 3 variables:
   
   | Key | Value |
   |-----|-------|
   | `SPRING_DATA_MONGODB_URI` | `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/drims?retryWrites=true&w=majority` |
   | `JWT_SECRET` | `your-generated-secret-here` |
   | `CORS_ALLOWED_ORIGINS` | `https://ajp-pro.vercel.app,http://localhost:5173` |

7. **Click:** "Create Web Service"

### 5. Wait for Deployment

- Build takes 5-10 minutes
- Watch the logs in Render dashboard
- Wait for "Live" status

### 6. Get Your Backend URL

Once deployed, you'll get a URL like:
```
https://drims-backend.onrender.com
```

### 7. Test Your Backend

Open in browser or test with curl:
```bash
curl https://drims-backend.onrender.com
```

### 8. Update Frontend

Update `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'https://drims-backend.onrender.com/api';
```

Then redeploy frontend to Vercel.

## ✅ Done!

Your backend is now live on Render!

## 🆘 Having Issues?

1. **Build fails?** Check build logs in Render dashboard
2. **Service won't start?** Check environment variables are set correctly
3. **MongoDB error?** Verify connection string and IP whitelist
4. **CORS errors?** Update `CORS_ALLOWED_ORIGINS` with your frontend URL

See `RENDER_DEPLOYMENT.md` for detailed troubleshooting.

