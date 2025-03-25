// script.js
const themeSwitch = document.getElementById("theme-switch");
themeSwitch.addEventListener("change", () => {
  if (themeSwitch.checked) {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
  } else {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
  }
});
