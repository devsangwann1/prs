
window.addEventListener("load", async () => {
  const clerk = window.Clerk;

  await clerk.load();

  const loginBox = document.getElementById("login-box");
  const homeBox = document.getElementById("home-box");
  const userInfo = document.getElementById("user-info");

  function showLogin() {
    loginBox.style.display = "flex";
    homeBox.style.display = "none";

    clerk.mountSignIn(document.getElementById("sign-in"), {
      afterSignInUrl: "/",
      afterSignUpUrl: "/"
    });
  }

  function showHome(user) {
    loginBox.style.display = "none";
    homeBox.style.display = "flex";

    userInfo.innerText = `Logged in as: ${user.primaryEmailAddress.emailAddress}`;
  }

  const user = clerk.user;

  if (user) {
    showHome(user);
  } else {
    showLogin();
  }

  clerk.addListener(({ user }) => {
    if (user) {
      showHome(user);
    } else {
      showLogin();
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await clerk.signOut();
  });
});