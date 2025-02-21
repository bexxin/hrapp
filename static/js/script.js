// Open/close sidebar with toggler button
const toggler = document.querySelector(".toggler-btn");
toggler.addEventListener("click", function() {
    document.querySelector("#sidebar").classList.toggle("collapsed");
});

// Close sidebar with mobile close button
const mobileCloseBtn = document.querySelector(".mobile-toggle-btn");
mobileCloseBtn.addEventListener("click", function() {
    document.querySelector("#sidebar").classList.add("collapsed");
});