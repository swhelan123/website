// Theme toggle functionality
const themeSwitch = document.getElementById("theme-switch");
const body = document.body;

// Check for saved theme preference or default to light mode
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  if (savedTheme === "dark") {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
   