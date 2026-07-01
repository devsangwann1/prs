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
  }, 250);
}

function getRedirectUrl() {
  return window.location.href.split("?")[0];
}

function showHome(user) {
  const name =
    user.fullName ||
    user.username ||
    user.primaryEmailAddress?.emailAddress ||
    "Player";

  const email = user.primaryEmailAddress?.emailAddress || "";
  const avatar = user.imageUrl;

  if (userName) userName.textContent = name;
  if (welcomeNameInline) welcomeNameInline.textContent = `, ${name}`;
  if (userEmail) userEmail.textContent = email;

  if (userAvatar) {
    userAvatar.src =
      avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=2f5cff&color=ffffff`;
  }

  loginScreen?.classList.remove("screen--active");
  homeScreen?.classList.add("screen--active");
}

function showLogin() {
  homeScreen?.classList.remove("screen--active");
  loginScreen?.classList.add("screen--active");
  setButtonsDisabled(false);
}

async function signInWithGoogle() {
  try {
    setButtonsDisabled(true);
    document.body.classList.add("auth-loading");

    const clerk = window.Clerk;

    if (!clerk) throw new Error("Clerk not loaded");

    await clerk.openSignIn({
      strategy: "oauth_google",
      redirectUrl: getRedirectUrl(),
      afterSignInUrl: getRedirectUrl(),
      afterSignUpUrl: getRedirectUrl()
    });
  } catch (error) {
    console.error("Login error:", error);
    alert("Google login failed. Try again.");
    document.body.classList.remove("auth-loading");
    setButtonsDisabled(false);
  }
}

async function logout() {
  try {
    const clerk = window.Clerk;
    if (!clerk) return;

    await clerk.signOut();
    showLogin();
  } catch (error) {
    console.error("Logout error:", error);
  }
}

async function initClerk() {
  const clerk = window.Clerk;

  if (!clerk) {
    console.error("Clerk failed to load");
    hideLoading();
    showLogin();
    return;
  }

  await clerk.load();

  try {
    await clerk.handleRedirectCallback();
  } catch (e) {
    // ignore if no redirect
  }

  hideLoading();
  document.body.classList.remove("auth-loading");

  const user = clerk.user;

  if (user) {
    showHome(user);
  } else {
    showLogin();
  }

  clerk.addListener(({ user }) => {
    if (user) showHome(user);
    else showLogin();
  });
}

googleBtn?.addEventListener("click", signInWithGoogle);
logoutBtn?.addEventListener("click", logout);

window.addEventListener("load", initClerk);