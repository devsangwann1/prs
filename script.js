import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_tBLuDe9dQnz7HRTmYgl7kn33Ywfsv6w",
  authDomain: "persian-65b9a.firebaseapp.com",
  projectId: "persian-65b9a",
  storageBucket: "persian-65b9a.firebasestorage.app",
  messagingSenderId: "236039497167",
  appId: "1:236039497167:web:ce270a122a13bf9d4d9eba",
  measurementId: "G-71XSB7SYKT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});

const loginScreen = document.getElementById("login-screen");
const homeScreen = document.getElementById("home-screen");
const googleBtn = document.getElementById("google-btn");
const logoutBtn = document.getElementById("logout-btn");
const userAvatar = document.getElementById("user-avatar");
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const welcomeNameInline = document.getElementById("welcome-name-inline");
const loadingScreen = document.getElementById("loading-screen");

function setButtonsDisabled(state) {
  if (googleBtn) googleBtn.disabled = state;
}

function hideLoading() {
  if (!loadingScreen) return;
  loadingScreen.style.opacity = "0";
  setTimeout(() => {
    loadingScreen.style.display = "none";
  }, 300);
}

function showHome(user) {
  const name = user.displayName || user.email || "Player";
  const email = user.email || "";
  const avatar = user.photoURL || "";

  if (userName) userName.textContent = name;
  if (welcomeNameInline) welcomeNameInline.textContent = `, ${name}`;
  if (userEmail) userEmail.textContent = email;

  if (userAvatar) {
    if (avatar) {
      userAvatar.src = avatar;
    } else {
      userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2f5cff&color=ffffff`;
    }
  }

  if (loginScreen) loginScreen.classList.remove("screen--active");
  if (homeScreen) homeScreen.classList.add("screen--active");
}

function showLogin() {
  if (homeScreen) homeScreen.classList.remove("screen--active");
  if (loginScreen) loginScreen.classList.add("screen--active");
  setButtonsDisabled(false);
}

async function signInWithGoogle() {
  try {
    setButtonsDisabled(true);
    document.body.classList.add("auth-loading");
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error(error);
    alert("Google login failed.");
  } finally {
    document.body.classList.remove("auth-loading");
    setButtonsDisabled(false);
  }
}

async function logout() {
  try {
    if (homeScreen) homeScreen.classList.remove("screen--active");
    await signOut(auth);
  } catch (error) {
    console.error(error);
  }
}

onAuthStateChanged(auth, (user) => {
  hideLoading();
  if (user) {
    showHome(user);
  } else {
    showLogin();
  }
});

if (googleBtn) {
  googleBtn.addEventListener("click", signInWithGoogle);
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}
