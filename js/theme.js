const theme = document.querySelectorAll(".theme-mode button");

theme.forEach((btn) => {
  btn.addEventListener("click", changeTheme);
});

function changeTheme(e) {
  const theme = e.target.dataset.id;
  document.documentElement.setAttribute("data-theme", theme);
  saveThemeLocalStorage(theme);
}

function saveThemeLocalStorage(theme) {
  localStorage.setItem("theme", JSON.stringify(theme));
}

function getThemeLocalStorage() {
  return JSON.parse(localStorage.getItem("theme")) || "dark";
}

export function changeDocumentThem() {
  const theme = getThemeLocalStorage();
  document.documentElement.setAttribute("data-theme", theme);
}
