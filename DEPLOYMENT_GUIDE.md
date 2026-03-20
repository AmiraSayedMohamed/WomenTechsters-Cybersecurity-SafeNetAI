# 🚀 SafeNet AI - Deployment Guide

## Overview
- **Frontend**: Deploy on Vercel
- **Backend**: Deploy on Hugging Face Spaces

---

## ✅ STEP 1: Prepare Your Code (Do This Now)

### 1.1 Push Your Code to GitHub

1. **Install Git** (if not already installed)
2. **Create a GitHub account** at https://github.com
3. **Create a new repository** named `SafeNetAI`
4. **In your project folder**, run these commands:

```bash
git init
git add .
git commit -m "Initial commit - SafeNet AI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/SafeNetAI.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## 📱 STEP 2: Deploy Frontend on Vercel

### 2.1 Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "GitHub" and authorize
4. Click "Continue with GitHub"

### 2.2 Deploy Your Frontend
1. Click **"Add New Project"** on Vercel dashboard
2. **Import** your SafeNetAI GitHub repo
3. Vercel will auto-detect it's a Vite project ✓
4. Click **"Deploy"**
5. Wait for deployment to complete (usually 1-2 minutes)
6. You'll get a URL like: `https://safenet-ai.vercel.app`

### 2.3 Add Environment Variables to Vercel
1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Environment Variables"**
3. Add this variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://your-huggingface-backend-url` (You'll get this after deploying backend)
   - Click **"Add"**
4. Redeploy: Click **"Deployments"** → Go to latest → Click the **"..."** menu → **"Redeploy"**

---

## 🤗 STEP 3: Deploy Backend on Hugging Face Spaces

### 3.1 Create Hugging Face Account
1. Go to https://huggingface.co
2. Click **"Sign Up"**
3. Fill in your details and verify email
4. Go to your profile → **"Spaces"** tab

### 3.2 Create a New Space
1. Click **"Create new Space"**
2. Fill in:
   - **Space name**: `safenet-ai-backend`
   - **License**: Choose any (e.g., "openrail")
   - **Space SDK**: Choose **"Docker"**
   - **Visibility**: **"Public"**
3. Click **"Create Space"**

### 3.3 Push Your Backend Code to Hugging Face
1. **On your computer**, open PowerShell in your project folder
2. **Create a new folder** called `hf-space`:
   ```bash
   mkdir hf-space
   cd hf-space
   ```

3. **Initialize git for Hugging Face**:
   ```bash
   git clone https://huggingface.co/spaces/YOUR_USERNAME/safenet-ai-backend .
   cd safenet-ai-backend
   ```

   Replace `YOUR_USERNAME` with your Hugging Face username.

4. **Copy your backend files**:
   - Copy `app/` folder here
   - Copy `requirements.txt` here
   - Copy `Dockerfile` here
   - Copy `.env` file here (with your Groq API key)

5. **Push to Hugging Face**:
   ```bash
   git add .
   git commit -m "Deploy SafeNet AI backend"
   git push
   ```

6. **Wait for build** (this takes 3-5 minutes)
7. Your backend URL will be: `https://YOUR_USERNAME-safenet-ai-backend.hf.space`

### 3.4 Set Environment Variables in Hugging Face Space
1. In your Hugging Face Space, click **"Settings"** (gear icon)
2. Click **"Repository secrets"** or **"Space secrets"**
3. Add these variables:
   - **OPENAI_API_KEY**: Your Groq API key
   - **OPENAI_MODEL**: `llama-3.3-70b-versatile`
   - **OPENAI_BASE_URL**: `https://api.groq.com/openai/v1`
   - **CORS_ALLOWED_ORIGINS**: `https://your-vercel-domain.vercel.app`

4. **Restart your Space**: Click the restart button

---

## 🔗 STEP 4: Update Vercel with Backend URL

1. From Step 3.3, copy your HF Spaces backend URL
2. **Go back to Vercel**
3. **Project Settings** → **Environment Variables**
4. **Edit** the `VITE_API_BASE_URL` variable
5. **Paste** your HF Spaces URL: `https://YOUR_USERNAME-safenet-ai-backend.hf.space/api`
6. **Redeploy** your frontend

---

## ✨ STEP 5: Test Your Deployment

### Test Frontend
1. Visit: `https://your-vercel-frontend.vercel.app`
2. Try the Phishing Detector
3. Try the Nmap Translator
4. Try the AI Tutor
5. All should work! ✓

### Test Backend Directly (Optional)
1. Visit: `https://your-hf-space.hf.space/health`
2. Should see: `{"status":"ok","service":"SafeNet AI API"}`

---

## 🎉 You're Done!

Your SafeNet AI is now live on the internet! 🌍

- **Frontend**: https://your-vercel-domain.vercel.app
- **Backend**: https://your-hf-space.hf.space

---

## 📝 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot reach backend" | Check VITE_API_BASE_URL in Vercel settings, redeploy |
| "HF Space won't start" | Check Docker build logs, ensure requirements.txt has all packages |
| "API returns errors" | Check HF Space secrets - ensure OPENAI_API_KEY is correct |
| "CORS errors" | Add your Vercel URL to CORS_ALLOWED_ORIGINS in HF Space secrets |

---

## 🔑 Important: Secure Your API Key

⚠️ **Your Groq API key is now on Hugging Face Spaces**  
It's stored as a "secret" so it's not visible in code.

---

## 📞 Need Help?

If deployment fails:
1. Check the build logs on Vercel/HuggingFace
2. Ensure all environment variables are set
3. Make sure your GitHub repo has all required files
4. Restart both services

Good luck! 🚀
