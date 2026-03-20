# ✅ Deployment Checklist - SafeNet AI

## Changes Made to Your Project ✨

### ✓ Frontend Updates
- [x] Updated `src/components/AIEngine.ts` to use `VITE_API_BASE_URL` environment variable
- [x] Frontend now falls back to `http://localhost:8000/api` in development
- [x] Build tested and successful (2246 modules)

### ✓ Backend Updates  
- [x] Updated `Dockerfile` to use port 7860 (Hugging Face Spaces standard)
- [x] Updated `.env.example` with Groq AI settings and Vercel URL placeholder
- [x] Backend configuration already supports dynamic CORS origins

### ✓ Documentation
- [x] Created `DEPLOYMENT_GUIDE.md` with step-by-step instructions
- [x] All files ready for deployment

---

## What You Need to Do (Step-by-Step Like a Child) 👶➡️👨

### PHASE 1: Get Accounts (5 minutes)

**Step 1: GitHub**
- Go to https://github.com
- Click "Sign Up"
- Create account with email/username/password
- Verify email ✓

**Step 2: Vercel** 
- Go to https://vercel.com
- Click "Sign Up"
- Choose "Continue with GitHub"
- Approve access ✓

**Step 3: Hugging Face**
- Go to https://huggingface.co
- Click "Sign Up"
- Create account with email/username
- Verify email ✓

---

### PHASE 2: Upload Code to GitHub (10 minutes)

**In PowerShell, in your project folder, run:**

```bash
git init
git add .
git commit -m "SafeNet AI - Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/SafeNetAI.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

**Result**: Your code is now on GitHub ✓

---

### PHASE 3: Deploy Backend on Hugging Face Spaces (15 minutes)

**Step A: Create Space**
1. Go to https://huggingface.co/spaces
2. Click "Create new Space"
3. Fill in:
   - Name: `safenet-ai-backend`
   - SDK: **Docker** ← Important!
   - Visibility: Public
4. Click "Create Space" ✓

**Step B: Push Code to HF**
1. In PowerShell, go to a NEW folder:
   ```bash
   mkdir hf-deploy
   cd hf-deploy
   ```

2. Clone the Hugging Face space:
   ```bash
   git clone https://huggingface.co/spaces/YOUR_USERNAME/safenet-ai-backend .
   ```

3. Copy files from your main project:
   - Copy `app/` folder
   - Copy `requirements.txt`
   - Copy `Dockerfile`
   - Copy `.env` file

4. Push to Hugging Face:
   ```bash
   git add .
   git commit -m "Deploy SafeNet AI backend"
   git push
   ```

5. **Wait 3-5 minutes** for HF to build ⏳

6. Go to your Space and check: **"Running"** ✓

**Your backend URL**: `https://YOUR_USERNAME-safenet-ai-backend.hf.space`

---

### PHASE 4: Deploy Frontend on Vercel (5 minutes)

1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Select your `SafeNetAI` repository from GitHub
4. Vercel auto-detects Vite ✓
5. **Before clicking Deploy**, add environment variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://YOUR_USERNAME-safenet-ai-backend.hf.space/api` (from PHASE 3)
6. Click "Deploy" ⏳

7. **Wait 1-2 minutes** for deployment

**Your frontend URL**: `https://safenet-ai-RANDOM.vercel.app`

---

### PHASE 5: Set Backend Secrets in HF (5 minutes)

Your Groq API key needs to be in Hugging Face Spaces as a "secret".

1. Go to your HF Space
2. Click "Settings" (gear icon)
3. Find "Variables and secrets" section
4. Add these secrets:
   - `OPENAI_API_KEY`: Your Groq key (from your current `.env` file)
   - `OPENAI_MODEL`: `llama-3.3-70b-versatile`
   - `OPENAI_BASE_URL`: `https://api.groq.com/openai/v1`
   - `CORS_ALLOWED_ORIGINS`: Use the backend URL and frontend URL
     ```
     http://localhost:5173,http://127.0.0.1:5173,https://your-vercel-frontend.vercel.app
     ```

5. Restart Space ✓

---

### PHASE 6: Test Everything (5 minutes)

1. **Visit your frontend**: `https://safenet-ai-RANDOM.vercel.app`
2. **Test Phishing Detector**: Type a message → Should work ✓
3. **Test Nmap Translator**: Paste some text → Should work ✓
4. **Test AI Tutor**: Ask a question → Should work ✓

If all work: **CONGRATULATIONS!** 🎉

---

## Troubleshooting 🔧

| Issue | Fix |
|-------|-----|
| "Cannot reach backend" | Check CORS_ALLOWED_ORIGINS includes your Vercel URL |
| "HF Space error" | Check logs in HF Space, ensure Docker builds |
| "Vercel rejects" | Ensure all secrets are set in Vercel settings |

---

## Your Final URLs 🌍

After deployment, share these with your professor:

- **Frontend** (Live App): `https://your-vercel-url.vercel.app`
- **Backend** (API): `https://YOUR_USERNAME-safenet-ai-backend.hf.space`

---

**Total Time: ~45 minutes**

Good luck! 🚀
