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

document.addEventListener('DOMContentLoaded', () => {
    // Handle sidebar link clicks
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Skip dropdown toggles (href="#") and let Bootstrap handle them
            if (href && href !== '#' && !this.hasAttribute('data-bs-toggle')) {
                e.preventDefault();
                loadContent(href);
            }
        });
    });

    // Load content into the content-area div
    function loadContent(url) {
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(html => {
                document.getElementById('content-area').innerHTML = html;
            })
            .catch(error => {
                console.error('Error loading content:', error);
                document.getElementById('content-area').innerHTML = '<p>Error loading content.</p>';
            });
    }

    // Optional: Load initial content (e.g., tables) on page load
    loadContent('{{ url_for("tables") }}');
});

