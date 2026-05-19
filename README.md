# FlipMind — AI Flashcard Site

An AI-powered flashcard app with topic switching and score tracking.

## Deploy to Vercel (free)

### Step 1 — Get a FREE Google Gemini API Key
1. Go to https://aistudio.google.com
2. Sign up / log in
3. Go to **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)

### Step 2 — Add your API key to the site
Open `index.html` and find this line near the bottom:
```js
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
```
Replace `YOUR_API_KEY_HERE` with your actual key.

### Step 3 — Deploy to Vercel
**Option A — Drag & Drop (easiest):**
1. Go to https://vercel.com and sign up (free)
2. From your dashboard, click **Add New → Project**
3. Choose **"Deploy from folder"** or drag the entire `flashcard-site` folder
4. Click **Deploy**
5. Your site is live at `yourproject.vercel.app` in ~30 seconds!

**Option B — Via GitHub:**
1. Push this folder to a GitHub repo
2. Go to https://vercel.com → **Add New → Project**
3. Import your GitHub repo
4. Click **Deploy**

## Topics included
History, Philosophy, Law, Business, Science, Economics, Psychology, Art, Mathematics, Literature

## Features
- AI-generated cards (never the same card twice)
- Flip animation to reveal answers
- Score tracker: Got it / Missed it
- Streak counter
- Navigate previous cards
- Mobile responsive

## Customizing topics
In `index.html`, find the `.topics` div and add/remove buttons:
```html
<button class="topic-btn" data-topic="YourTopic">Your Topic</button>
```

## Note on API key security
This is a client-side app, meaning the API key is visible in the browser source.
For a personal or small project this is fine. For a public site with heavy traffic,
consider wrapping the API call in a Vercel serverless function to hide the key.
