# 🚀 Ajeet Prasad — Personal Portfolio

A modern, fully functional personal portfolio website built with **React.js + Firebase**.

Features glassmorphism + neumorphism design, dark/light mode, multi-language (EN/HI),
Firebase backend, admin panel, and one-click deployment to Netlify or Firebase Hosting.

---

## 📁 Project Structure

```
portfolio/
├── public/
│   └── favicon.svg
│   └── resume.pdf              ← Add your resume here!
├── src/
│   ├── components/
│   │   ├── Navbar.jsx / .css
│   │   ├── Hero.jsx / .css
│   │   ├── About.jsx / .css
│   │   ├── Skills.jsx / .css
│   │   ├── Projects.jsx / .css
│   │   ├── Certificates.jsx / .css
│   │   ├── Contact.jsx / .css
│   │   ├── Footer.jsx / .css
│   │   └── Preloader.jsx / .css
│   ├── pages/
│   │   ├── Login.jsx / .css
│   │   └── AdminPanel.jsx / .css
│   ├── context/
│   │   ├── ThemeContext.jsx
│   │   ├── AuthContext.jsx
│   │   └── LanguageContext.jsx
│   ├── firebase/
│   │   └── config.js           ← ⚠️ Add your Firebase config here
│   ├── hooks/
│   │   ├── useScrollAnimation.js
│   │   └── useTypingEffect.js
│   ├── locales/
│   │   ├── en.json
│   │   └── hi.json
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── firestore.rules
├── storage.rules
├── firebase.json
├── netlify.toml
├── vite.config.js
└── package.json
```

---

## ⚡ STEP 1 — Install Dependencies

```bash
# Clone / unzip the project, then:
cd portfolio
npm install
```

---

## 🔥 STEP 2 — Firebase Setup (10 minutes)

### 2.1 Create a Firebase Project

1. Go to **https://console.firebase.google.com**
2. Click **"Add Project"** → Enter name (e.g. `ajeet-portfolio`) → Continue
3. Disable Google Analytics (optional) → **Create Project**

### 2.2 Enable Authentication

1. In Firebase Console → **Build → Authentication**
2. Click **"Get Started"**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** → Save
5. Go to **Users** tab → Click **"Add User"**
6. Enter your admin email + password → **Add User**
   > ⚠️ This is your admin login. Keep it safe!

### 2.3 Create Firestore Database

1. Firebase Console → **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"** → Next
4. Select your region (e.g. `asia-south1` for India) → **Enable**

### 2.4 Enable Firebase Storage

1. Firebase Console → **Build → Storage**
2. Click **"Get Started"**
3. Choose **"Start in production mode"** → Next
4. Select your region → **Done**

### 2.5 Get Your Firebase Config

1. Firebase Console → ⚙️ **Project Settings** (gear icon)
2. Scroll down to **"Your apps"** → Click **"</>  Web"**
3. Register app (any name) → Copy the config object

### 2.6 Add Config to Project

Open `src/firebase/config.js` and replace:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",           // ← Your actual API key
  authDomain: "ajeet-portfolio.firebaseapp.com",
  projectId: "ajeet-portfolio",
  storageBucket: "ajeet-portfolio.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 2.7 Deploy Security Rules

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project folder
firebase init

# Select: Firestore, Storage, Hosting
# Use existing project → select your project

# Deploy rules
firebase deploy --only firestore:rules,storage
```

---

## 📧 STEP 3 — EmailJS Setup (Contact Form)

1. Go to **https://www.emailjs.com** → Create free account
2. **Email Services** → Add Service → Select Gmail → Connect your Gmail
3. **Email Templates** → Create Template:
   - Template content:
     ```
     From: {{name}} ({{email}})
     Message: {{message}}
     ```
4. Go to **Account** → Copy your **Public Key**

5. Open `src/components/Contact.jsx` and replace:

```js
const EMAILJS_SERVICE_ID  = 'service_xxxxxxx';   // Your Service ID
const EMAILJS_TEMPLATE_ID = 'template_xxxxxxx';  // Your Template ID
const EMAILJS_PUBLIC_KEY  = 'your_public_key';   // Your Public Key
```

---

## 📄 STEP 4 — Add Your Resume

Place your resume PDF in the `public/` folder:

```
public/
└── resume.pdf    ← Rename your file to exactly this
```

The "Download Resume" button will automatically link to it.

---

## 🖼️ STEP 5 — Add Profile Photo (Optional)

To add your photo in the About section:

1. Add your photo to `public/profile.jpg`
2. Open `src/components/About.jsx`
3. Find the `avatar-placeholder` div and replace with:

```jsx
<img src="/profile.jpg" alt="Ajeet Prasad" />
```

---

## 🏃 STEP 6 — Run Locally

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🔐 STEP 7 — Access Admin Panel

1. Go to `http://localhost:3000/login`
2. Enter the admin email + password you created in Firebase Auth
3. You'll be redirected to the **Admin Panel** at `/admin`
4. From there you can:
   - ➕ Add / Edit / Delete Skills
   - ➕ Add / Edit / Delete Projects (with image/video/PPT uploads)
   - ➕ Add / Edit / Delete Certificates
   - All changes appear on the portfolio **in real-time**!

---

## 🌐 STEP 8 — Deploy

### Option A: Netlify (Recommended — Easiest)

1. Push your code to GitHub
2. Go to **https://netlify.com** → "Add new site" → "Import from Git"
3. Connect GitHub → Select your repo
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **Deploy Site** 🎉

### Option B: Firebase Hosting

```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

Your site will be live at: `https://YOUR_PROJECT_ID.web.app`

---

## 🌏 Multi-Language Support

- Click **EN | HI** toggle in the navbar
- Add more languages by:
  1. Creating `src/locales/fr.json` (or any language)
  2. Adding it to `LanguageContext.jsx` imports
  3. Adding a button in `Navbar.jsx`

---

## 🎨 Customization Quick Guide

| What to change          | File                          |
|-------------------------|-------------------------------|
| Colors / theme          | `src/index.css` (CSS vars)    |
| Hero typing texts       | `src/locales/en.json`         |
| Social links            | `src/components/Hero.jsx`     |
| About text              | `src/locales/en.json`         |
| Contact email           | `src/locales/en.json`         |
| Add a new section       | Create component, add to App  |
| Change fonts            | `index.html` + `index.css`    |

---

## ❓ Common Issues

| Issue | Fix |
|-------|-----|
| Firebase permission denied | Deploy `firestore.rules` |
| Images not uploading | Deploy `storage.rules` |
| Contact form not sending | Check EmailJS credentials |
| Blank page on Netlify | Ensure `netlify.toml` is present |
| Admin login fails | Check Firebase Auth → correct email/password |

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Pure CSS (Glassmorphism + Neumorphism)
- **Backend**: Firebase (Auth + Firestore + Storage)
- **Email**: EmailJS
- **Icons**: React Icons
- **Routing**: React Router v6
- **Notifications**: React Hot Toast
- **Deploy**: Netlify / Firebase Hosting

---

Made with ❤️ by Ajeet Prasad | [LinkedIn](https://www.linkedin.com/in/ajeet-prasad-dev) | [GitHub](https://github.com/Ajeet2611)
