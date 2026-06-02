// main.js — Arrow (1962) Clean Academic Style (subpages)
// Minimal: theme toggle + mobile nav + smooth scroll

function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("a1962-t", t);
    var btn = document.getElementById("themeBtn");
    if (btn) btn.textContent = t === "dark" ? "☀️" : "🌙";
}
var saved = localStorage.getItem("a1962-t") || "light";
applyTheme(saved);
document.getElementById("themeBtn")?.addEventListener("click", function() {
    applyTheme(saved === "dark" ? "light" : "dark");
});
document.getElementById("navToggle")?.addEventListener("click", function() {
    document.getElementById("navLinks")?.classList.toggle("open");
});
document.querySelectorAll(".nav-links a").forEach(function(link) {
    link.addEventListener("click", function() {
        document.getElementById("navLinks")?.classList.remove("open");
    });
});