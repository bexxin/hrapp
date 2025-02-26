// static/js/script.js
console.log("Script loaded");

const toggler = document.querySelector(".toggler-btn");
if (toggler) {
    toggler.addEventListener("click", function () {
        document.querySelector("#sidebar").classList.toggle("collapsed");
    });
} else {
    console.log("Toggler not found");
}

const mobileCloseBtn = document.querySelector(".mobile-toggle-btn");
if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener("click", function () {
        document.querySelector("#sidebar").classList.add("collapsed");
    });
} else {
    console.log("Mobile close button not found");
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");

    document.querySelectorAll(".sidebar-link").forEach((link) => {
        link.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (href && href !== "#" && !this.hasAttribute("data-bs-toggle")) {
                e.preventDefault();
                loadContent(href);
            }
        });
    });

    const themeToggle = document.querySelector("#theme-toggle");
    if (themeToggle) {
        const moonIcon = themeToggle.querySelector(".bi-moon-stars-fill");
        const sunIcon = themeToggle.querySelector(".bi-sun-fill");
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            moonIcon.classList.toggle("d-none");
            sunIcon.classList.toggle("d-none");
            console.log("Theme toggled");
        });
    } else {
        console.log("Theme toggle not found");
    }

    const table = document.getElementById("employeeTable");
    if (table) {
        console.log("Table found:", table);
        const tbody = table.querySelector("tbody");
        const headers = table.querySelectorAll(".sortable");

        headers.forEach(header => {
            header.addEventListener("click", () => {
                console.log("Sorting header clicked:", header.dataset.sort);
                const colIndex = parseInt(header.dataset.sort);
                const rows = Array.from(tbody.querySelectorAll("tr"));
                const isAscending = header.classList.toggle("asc");
                const columnName = header.querySelector("span").textContent;

                header.title = isAscending ? 
                    `Sorted by ${columnName} (A-Z/Oldest-Newest)` : 
                    `Sorted by ${columnName} (Z-A/Newest-Oldest)`;

                rows.sort((a, b) => {
                    const aValue = a.cells[colIndex].textContent.trim();
                    const bValue = b.cells[colIndex].textContent.trim();
                    return isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                });

                rows.forEach(row => tbody.appendChild(row));
                headers.forEach(h => h.classList.remove("asc", "desc"));
                header.classList.add(isAscending ? "asc" : "desc");
            });
        });

        const rows = tbody.querySelectorAll(".employee-row");
        console.log("Rows found:", rows.length);
        const form = document.getElementById("employeeForm");
        console.log("Form found:", form ? "Yes" : "No");

        rows.forEach(row => {
            row.addEventListener("dblclick", () => {
                console.log("Raw data-details:", row.dataset.details);
                try {
                    const details = JSON.parse(row.dataset.details);
                    console.log("Parsed details:", details);
                    form.style.display = "block";
                    document.getElementById("ID").value = details[0] || ""; // employee_id
                    document.getElementById("First_Name").value = details[1] || ""; // first_name
                    document.getElementById("Last_Name").value = details[2] || ""; // last_name
                    document.getElementById("Email").value = details[3] || ""; // email
                    document.getElementById("Phone_Number").value = details[4] || ""; // phone_number
                    document.getElementById("Hire_Date").value = details[5] || ""; // hire_date
                    document.getElementById("Job_ID").value = details[6] || ""; // job_id
                    document.getElementById("Job_Title").value = details[11] || ""; // job_title
                    document.getElementById("Salary").value = details[7] || ""; // salary
                    // Manager fields (fetch from emp_data where employee_id = manager_id)
                    const managerId = details[9]; // manager_id
                    const manager = Array.from(tbody.querySelectorAll(".employee-row"))
                        .map(r => JSON.parse(r.dataset.details))
                        .find(emp => emp[0] === managerId) || [];
                    document.getElementById("Manager_Employee_ID").value = manager[0] || "";
                    document.getElementById("Manager_First_Name").value = manager[1] || "";
                    document.getElementById("Manager_Last_Name").value = manager[2] || "";
                    document.getElementById("Department_ID").value = details[10] || ""; // department_id
                    document.getElementById("Department_Name").value = details[12] || ""; // department_name
                } catch (e) {
                    console.error("JSON parse error:", e.message, "Raw data:", row.dataset.details);
                }
            });
        });
    } else {
        console.log("Table not found");
    }
});

function loadContent(url) {
    fetch(url)
        .then((response) => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.text();
        })
        .then((html) => {
            document.getElementById("content-area").innerHTML = html;
            console.log("Content loaded from:", url);
            setupEmployeeTable();
        })
        .catch((error) => {
            console.error("Error loading content:", error);
            document.getElementById("content-area").innerHTML = "<p>Error loading content.</p>";
        });
}

function setupEmployeeTable() {
    const table = document.getElementById("employeeTable");
    if (table) {
        console.log("Setup table found:", table);
        const tbody = table.querySelector("tbody");
        const headers = table.querySelectorAll(".sortable");

        headers.forEach(header => {
            header.addEventListener("click", () => {
                console.log("Setup sorting header clicked:", header.dataset.sort);
                const colIndex = parseInt(header.dataset.sort);
                const rows = Array.from(tbody.querySelectorAll("tr"));
                const isAscending = header.classList.toggle("asc");
                const columnName = header.querySelector("span").textContent;

                header.title = isAscending ? 
                    `Sorted by ${columnName} (A-Z/Oldest-Newest)` : 
                    `Sorted by ${columnName} (Z-A/Newest-Oldest)`;

                rows.sort((a, b) => {
                    const aValue = a.cells[colIndex].textContent.trim();
                    const bValue = b.cells[colIndex].textContent.trim();
                    return isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                });

                rows.forEach(row => tbody.appendChild(row));
                headers.forEach(h => h.classList.remove("asc", "desc"));
                header.classList.add(isAscending ? "asc" : "desc");
            });
        });

        const rows = tbody.querySelectorAll(".employee-row");
        console.log("Setup rows found:", rows.length);
        const form = document.getElementById("employeeForm");
        console.log("Setup form found:", form ? "Yes" : "No");

        rows.forEach(row => {
            row.addEventListener("dblclick", () => {
                console.log("Setup raw data-details:", row.dataset.details);
                try {
                    const details = JSON.parse(row.dataset.details);
                    console.log("Setup parsed details:", details);
                    form.style.display = "block";
                    document.getElementById("ID").value = details[0] || "";
                    document.getElementById("First_Name").value = details[1] || "";
                    document.getElementById("Last_Name").value = details[2] || "";
                    document.getElementById("Email").value = details[3] || "";
                    document.getElementById("Phone_Number").value = details[4] || "";
                    document.getElementById("Hire_Date").value = details[5] || "";
                    document.getElementById("Job_ID").value = details[6] || "";
                    document.getElementById("Job_Title").value = details[11] || "";
                    document.getElementById("Salary").value = details[7] || "";
                    const managerId = details[9];
                    const manager = Array.from(tbody.querySelectorAll(".employee-row"))
                        .map(r => JSON.parse(r.dataset.details))
                        .find(emp => emp[0] === managerId) || [];
                    document.getElementById("Manager_Employee_ID").value = manager[0] || "";
                    document.getElementById("Manager_First_Name").value = manager[1] || "";
                    document.getElementById("Manager_Last_Name").value = manager[2] || "";
                    document.getElementById("Department_ID").value = details[10] || "";
                    document.getElementById("Department_Name").value = details[12] || "";
                } catch (e) {
                    console.error("Setup JSON parse error:", e.message, "Raw data:", row.dataset.details);
                }
            });
        });
    } else {
        console.log("Setup table not found");
    }
}