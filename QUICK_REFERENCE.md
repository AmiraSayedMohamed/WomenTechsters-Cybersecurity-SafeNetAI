# 🎯 QUICK DEPLOY REFERENCE CARD

## When You Get Stuck, Use This! 👇

---

### GITHUB - Upload Code
```
git init
git add .
git commit -m "SafeNet AI deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/SafeNetAI.git
git push -u origin main
```

---

### HUGGING FACE - Deploy Backend

**Step 1: Create Space**
- Go: https://huggingface.co/spaces
- Choose Docker
- Name: `safenet-ai-backend`

**Step 2: Push Code**
```bash
mkdir hf-deploy && cd hf-deploy
git clone https://huggingface.co/spaces/YOUR_USERNAME/safenet-ai-backend .
# Copy: app/ + requirements.txt + Dockerfile + .env
git add . && git commit -m "deploy" && git push
# ⏳ Wait 3-5 minutes
```

**Step 3: Add Secrets in HF Settings**
```
OPENAI_API_KEY = your_groq_key_here
OPENAI_MODEL = llama-3.3-70b-versatile
OPENAI_BASE_URL = https://api.groq.com/openai/v1
CORS_ALLOWED_ORIGINS = (see next section)
```

**Your Backend URL:**
```
https://YOUR_USERNAME-safenet-ai-backend.hf.space
```

---

### VERCEL - Deploy Frontend

**Step 1: Import GitHub Repo**
- Go: https://vercel.com/dashboard
- Click "Add New Project"
- Select `SafeNetAI` from GitHub

**Step 2: Add Environment Variable BEFORE Deploy**
```
Name: VITE_API_BASE_URL
Value: https://YOUR_USERNAME-safenet-ai-backend.hf.space/api
```

**Step 3: Deploy**
- Click "Deploy"
- ⏳ Wait 1-2 minutes

**Your Frontend URL:**
```
https://safenet-ai-RANDOM.vercel.app
```

---

### HF SPACES CORS - Update After Vercel Deploy

Go to HF Space Settings → Add this to `CORS_ALLOWED_ORIGINS`:
```
http://localhost:5173,http://127.0.0.1:5173,https://safenet-ai-RANDOM.vercel.app
```

Then click "Restart Space"

---

### TEST IT!

1. Visit: `https://safenet-ai-RANDOM.vercel.app`
2. Click Phishing Detector → Enter text → Should work ✅
3. Click Nmap Translator → Enter text → Should work ✅
4. Click AI Tutor → Ask question → Should work ✅

---

### COMMON ERRORS & FIXES

| Error | Fix |
|-------|-----|
| "Cannot find backend" | Check VITE_API_BASE_URL in Vercel settings |
| "CORS error" | Add Vercel URL to CORS_ALLOWED_ORIGINS in HF |
| "HF Space won't build" | Check Docker logs, ensure requirements.txt exists |
| "Vercel deployment fails" | Check build logs, try redeploy |

---

### WHAT'S YOUR BACKEND URL?

From HF Spaces dashboard, find your Space:
```
Your URL will be:
https://YOUR_USERNAME-safenet-ai-backend.hf.space
```

Example:
```
https://john-safenet-ai-backend.hf.space
```

---

### WHAT'S YOUR FRONTEND URL?

After Vercel deploys, you'll see it:
```
https://safenet-ai-RANDOM.vercel.app
```

Example:
```
https://safenet-ai-a1b2c3d4.vercel.app
```

---

**Print this card! 🖨️**

Keep it open while you deploy.

Good luck! 🚀
