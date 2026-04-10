document.addEventListener("DOMContentLoaded", () => {
    const navShell = document.querySelector(".nav-shell");
    const links = document.querySelectorAll(".site-nav a");
    const current = window.location.pathname.split("/").pop() || "index.html";
    const inProjectDetails = window.location.pathname.includes("/pages/projects/");

    const themeToggle = document.createElement("button");
    themeToggle.className = "theme-toggle";
    themeToggle.type = "button";

    function applyTheme(mode) {
        const dark = mode === "dark";
        document.body.classList.toggle("theme-dark", dark);
        themeToggle.textContent = dark ? "☀" : "☾";
        themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
        themeToggle.setAttribute("title", dark ? "Light mode" : "Dark mode");
    }

    const storedTheme = localStorage.getItem("theme-mode");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
    applyTheme(initialTheme);

    themeToggle.addEventListener("click", () => {
        const next = document.body.classList.contains("theme-dark") ? "light" : "dark";
        localStorage.setItem("theme-mode", next);
        applyTheme(next);
    });

    if (navShell) {
        navShell.appendChild(themeToggle);
    }

    links.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;

        const hrefFile = href.split("/").pop();
        if (hrefFile === current) {
            link.classList.add("active");
        }

        if (inProjectDetails && hrefFile === "projects.html") {
            link.classList.add("active");
        }
    });
});
