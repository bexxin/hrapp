// static/js/script.js
const toggler = document.querySelector(".toggler-btn");
toggler.addEventListener("click", function () {
    document.querySelector("#sidebar").classList.toggle("collapsed");
});

const mobileCloseBtn = document.querySelector(".mobile-toggle-btn");
mobileCloseBtn.addEventListener("click", function () {
    document.querySelector("#sidebar").classList.add("collapsed");
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".sidebar-link").forEach((link) => {
        link.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (href && href !== "#" && !this.hasAttribute("data-bs-toggle")) {
                e.preventDefault();
                loadContent(href);
            }
        });
    });

    // Theme toggle
    const themeToggle = document.querySelector("#theme-toggle");
    const moonIcon = themeToggle.querySelector(".bi-moon-stars-fill");
    const sunIcon = themeToggle.querySelector(".bi-sun-fill");

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        moonIcon.classList.toggle("d-none");
        sunIcon.classList.toggle("d-none");
    });
});

function loadContent(url) {
    fetch(url)
        .then((response) => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.text();
        })
        .then((html) => {
            document.getElementById("content-area").innerHTML = html;
        })
        .catch((error) => {
            console.error("Error loading content:", error);
            document.getElementById("content-area").innerHTML = "<p>Error loading content.</p>";
        });
}