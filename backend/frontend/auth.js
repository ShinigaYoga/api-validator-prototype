// backend/frontend/auth.js
// Uses firebase-compat loaded in login.html

// ---- Replace with your Firebase config (already provided earlier) ----
const firebaseConfig = {
  apiKey: "AIzaSyCxNOGihrgrdOgYNsI5S7YrjaZS4xocW2E",
  authDomain: "hermes-f8d74.firebaseapp.com",
  projectId: "hermes-f8d74",
  storageBucket: "hermes-f8d74.firebasestorage.app",
  messagingSenderId: "312989523960",
  appId: "1:312989523960:web:63694bc8c884ccf61c800d",
  measurementId: "G-ZZNG5S580J"
};
// --------------------------------------------------------------------

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// UI elements
const tabSignIn = document.getElementById('tabSignIn');
const tabSignUp = document.getElementById('tabSignUp');
const authForm = document.getElementById('authForm');
const submitBtn = document.getElementById('submitBtn');
const msg = document.getElementById('msg');
const googleBtn = document.getElementById('googleBtn');
const switchToSignUp = document.getElementById('switchToSignUp');

let mode = 'signin'; // or 'signup'

// toggle tabs
function setMode(m) {
  mode = m;
  if (m === 'signin') {
    tabSignIn.classList.add('active');
    tabSignUp.classList.remove('active');
    submitBtn.textContent = 'Sign In';
  } else {
    tabSignUp.classList.add('active');
    tabSignIn.classList.remove('active');
    submitBtn.textContent = 'Create Account';
  }
  msg.textContent = '';
}

tabSignIn.addEventListener('click', () => setMode('signin'));
tabSignUp.addEventListener('click', () => setMode('signup'));
switchToSignUp.addEventListener('click', () => setMode('signup'));

// On form submit
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = '';
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    msg.textContent = 'Email and password required.';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = (mode === 'signin') ? 'Signing in...' : 'Creating account...';

  try {
    if (mode === 'signin') {
      await auth.signInWithEmailAndPassword(email, password);
    } else {
      // Create account
      await auth.createUserWithEmailAndPassword(email, password);
      // Optionally set displayName or send email verification
      const user = auth.currentUser;
      if (user && !user.emailVerified) {
        try { await user.sendEmailVerification(); } catch(e){ /* ignore */ }
      }
    }
    // success -> auth state change handler will redirect
  } catch (error) {
    msg.textContent = error.message;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = (mode === 'signin') ? 'Sign In' : 'Create Account';
  }
});

// Google Sign-in
googleBtn.addEventListener('click', async () => {
  msg.textContent = '';
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    await auth.signInWithPopup(provider);
    // auth state handler will redirect
  } catch (error) {
    msg.textContent = error.message || 'Google sign-in failed';
  }
});

// Redirect if already logged in
auth.onAuthStateChanged(user => {
  if (user) {
    // user is signed in
    // redirect to main app
    // you can optionally check emailVerified here
    window.location.href = 'index.html';
  } else {
    // not signed in — stay on page
  }
});
