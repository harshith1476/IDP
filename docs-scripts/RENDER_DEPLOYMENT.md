# 🚀 Render.com Deployment Guide for DRIMS Backend

This guide will walk you through deploying the DRIMS backend to Render.com.

## 📋 Prerequisites

1. **GitHub Account** - Your code must be pushed to GitHub
2. **Render Account** - Sign up at [render.com](https://render.com) (free tier available)
3. **MongoDB Atlas Account** - For cloud database (or use Render's MongoDB service)

## 🔧 Step-by-Step Deployment

### Step 1: Prepare Your Code

Ensure your code is pushed to GitHub:
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin master
```

### Step 2: Set Up MongoDB

#### Option A: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP addresses (or use `0.0.0.0/0` for all IPs)
5. Get your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/drims?retryWrites=true&w=majority
   ```

#### Option B: Render MongoDB Service
1. In Render dashboard, create a new MongoDB service
2. Render will provide the connection string automatically

### Step 3: Deploy to Render

1. **Log in to Render**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Sign in or create an account

2. **Create New Web Service**
   - Click "New +" button
   - Select "Web Service"
   - Connect your GitHub repository
   - Select the repository: `harshith1476/DRIMS`

3. **Configure the Service**
   - **Name:** `drims-backend`
   - **Region:** Choose closest to your users (e.g., `Oregon`)
   - **Branch:** `master` (or your main branch)
   - **Root Directory:** `backend`
   - **Environment:** `Java`
   - **Build Command:** `chmod +x build.sh && ./build.sh`
   - **Start Command:** `chmod +x start.sh && ./start.sh`

4. **Set Environment Variables**
   Click "Advanced" and add these environment variables:

   | Key | Value | Description |
   |-----|-------|-------------|
   | `SPRING_DATA_MONGODB_URI` | `mongodb+srv://...` | Your MongoDB connection string |
   | `JWT_SECRET` | `your-secure-random-string` | A secure random string (at least 32 characters) |
   | `CORS_ALLOWED_ORIGINS` | `https://ajp-pro.vercel.app,http://localhost:5173` | Your frontend URLs (comma-separated) |
   | `PORT` | (Auto-set by Render) | Port number (Render sets this automatically) |

   **Generate JWT Secret:**
   ```bash
   # On Linux/Mac
   openssl rand -base64 32
   
   # Or use an online generator
   # https://www.random.org/strings/
   ```

5. **Select Plan**
   - Choose **Free** plan (or paid if you need more resources)

6. **Deploy**
   - Click "Create Web Service"
   - Render will start building and deploying your application
   - This process takes 5-10 minutes

### Step 4: Verify Deployment

1. **Check Build Logs**
   - Watch the build process in Render dashboard
   - Ensure build completes successfully

2. **Check Service Status**
   - Service should show "Live" status
   - Your backend URL will be: `https://drims-backend.onrender.com` (or similar)

3. **Test the API**
   ```bash
   # Test health endpoint (if available)
   curl https://your-service.onrender.com/api/auth/login
   
   # Or test in browser
   # https://your-service.onrender.com
   ```

### Step 5: Update Frontend Configuration

Update your frontend API base URL to point to Render:

**File:** `frontend/src/services/api.js`

```javascript
const API_BASE_URL = 'https://your-service.onrender.com/api';
```

Then redeploy your frontend to Vercel.

## 🔍 Troubleshooting

### Build Fails

**Issue:** Maven not found
- **Solution:** The build script installs Maven automatically. Check build logs for errors.

**Issue:** JAR file not found
- **Solution:** Ensure `pom.xml` has correct artifact name: `drims-backend-1.0.0.jar`

### Application Won't Start

**Issue:** Port binding error
- **Solution:** Ensure `application.properties` uses `${PORT:8080}`

**Issue:** MongoDB connection failed
- **Solution:** 
  - Verify MongoDB connection string is correct
  - Check MongoDB Atlas IP whitelist includes Render IPs
  - Ensure database user has correct permissions

**Issue:** CORS errors
- **Solution:** Update `CORS_ALLOWED_ORIGINS` environment variable with your frontend URL

### Service Keeps Restarting

**Issue:** Application crashes on startup
- **Solution:** 
  - Check logs in Render dashboard
  - Verify all environment variables are set
  - Check MongoDB connection

## 📝 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SPRING_DATA_MONGODB_URI` | ✅ Yes | - | MongoDB connection string |
| `JWT_SECRET` | ✅ Yes | - | Secret key for JWT tokens (min 32 chars) |
| `CORS_ALLOWED_ORIGINS` | ✅ Yes | - | Comma-separated list of allowed origins |
| `PORT` | ❌ No | 8080 | Server port (auto-set by Render) |

## 🔐 Security Best Practices

1. **Never commit secrets** - Use environment variables only
2. **Use strong JWT secret** - At least 32 random characters
3. **Restrict CORS origins** - Only include your frontend URLs
4. **Use MongoDB authentication** - Always use username/password
5. **Enable MongoDB IP whitelist** - Restrict database access

## 📊 Monitoring

Render provides:
- **Logs:** Real-time application logs
- **Metrics:** CPU, memory, and request metrics
- **Events:** Deployment and service events

Access these from your service dashboard.

## 🔄 Updating Your Deployment

To update your deployment:

1. Push changes to GitHub
2. Render automatically detects changes
3. Triggers new build and deployment
4. Service restarts with new version

Or manually trigger deployment:
- Go to service dashboard
- Click "Manual Deploy" → "Deploy latest commit"

## 💰 Free Tier Limitations

Render free tier includes:
- ✅ 750 hours/month (enough for 24/7 operation)
- ✅ Automatic SSL certificates
- ✅ Custom domains
- ⚠️ Services spin down after 15 minutes of inactivity
- ⚠️ First request after spin-down may be slow (cold start)

**Note:** For production, consider upgrading to paid plan for:
- No spin-downs
- Better performance
- More resources

## 📞 Support

- **Render Docs:** [render.com/docs](https://render.com/docs)
- **Render Support:** [render.com/support](https://render.com/support)
- **Project Issues:** [GitHub Issues](https://github.com/harshith1476/DRIMS/issues)

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string obtained
- [ ] JWT secret generated
- [ ] Render account created
- [ ] Web service created on Render
- [ ] Environment variables set
- [ ] Build successful
- [ ] Service is live
- [ ] API endpoints tested
- [ ] Frontend updated with new API URL
- [ ] CORS configured correctly

---

**Your backend URL will be:** `https://drims-backend.onrender.com` (or similar)

**Remember to update your frontend's API base URL!**

