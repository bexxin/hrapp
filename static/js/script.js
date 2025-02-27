// static/js/script.js
console.log("Script loaded");

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");

    // Toggler for sidebar
    const toggler = document.querySelector(".toggler-btn");
    if (toggler) {
        console.log("Toggler found");
        toggler.addEventListener("click", () => {
            console.log("Toggler clicked");
            document.querySelector("#sidebar").classList.toggle("collapsed");
        });
    } else {
        console.log("Toggler not found");
    }

    // Mobile close button
    const mobileCloseBtn = document.querySelector(".mobile-toggle-btn");
    if (mobileCloseBtn) {
        console.log("Mobile close button found");
        mobileCloseBtn.addEventListener("click", () => {
            console.log("Mobile close clicked");
            document.querySelector("#sidebar").classList.add("collapsed");
        });
    } else {
        console.log("Mobile close button not found");
    }

    // Theme toggle
    const themeToggle = document.querySelector("#theme-toggle");
    if (themeToggle) {
        console.log("Theme toggle found");
        const moonIcon = themeToggle.querySelector(".bi-moon-stars-fill");
        const sunIcon = themeToggle.querySelector(".bi-sun-fill");
        themeToggle.addEventListener("click", () => {
            console.log("Theme toggle clicked");
            document.body.classList.toggle("light-mode");
            moonIcon.classList.toggle("d-none");
            sunIcon.classList.toggle("d-none");
        });
    } else {
        console.log("Theme toggle not found");
    }

    // Table and form setup
    const table = document.getElementById("employeeTable");
    const form = document.getElementById("employeeForm");
    if (table && form) {
        console.log("Table and form found");
        const tbody = table.querySelector("tbody");
        const headers = table.querySelectorAll(".sortable");

        // Sorting headers
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

        // Row click to update form
        const rows = tbody.querySelectorAll(".employee-row");
        console.log("Rows found:", rows.length);
        rows.forEach(row => {
            row.addEventListener("click", () => {
                console.log("Row clicked, raw data-details:", row.dataset.details);
                try {
                    const details = JSON.parse(row.dataset.details);
                    console.log("Parsed details:", details);
                    document.getElementById("ID").value = details[0] || "";
                    document.getElementById("First_Name").value = details[1] || "";
                    document.getElementById("Last_Name").value = details[2] || "";
                    document.getElementById("Email").value = details[3] || "";
                    document.getElementById("Phone_Number").value = details[4] || "";
                    document.getElementById("Hire_Date").value = details[5] || "";
                    document.getElementById("Job_ID").value = details[6] || "";
                    document.getElementById("Job_ID_select").value = details[6] || "";
                    document.getElementById("Job_Title").value = details[11] || "";
                    document.getElementById("Job_Title_select").value = details[11] || "";
                    document.getElementById("Salary").value = details[7] || "";
                    const managerId = details[9];
                    const manager = Array.from(tbody.querySelectorAll(".employee-row"))
                        .map(r => JSON.parse(r.dataset.details))
                        .find(emp => emp[0] === managerId) || [];
                    document.getElementById("Manager_Employee_ID").value = manager[0] || "";
                    document.getElementById("Manager_Employee_ID_select").value = manager[0] || "";
                    document.getElementById("Manager_First_Name").value = manager[1] || "";
                    document.getElementById("Manager_First_Name_select").value = manager[1] || "";
                    document.getElementById("Manager_Last_Name").value = manager[2] || "";
                    document.getElementById("Manager_Last_Name_select").value = manager[2] || "";
                    document.getElementById("Department_ID").value = details[10] || "";
                    document.getElementById("Department_ID_select").value = details[10] || "";
                    document.getElementById("Department_Name").value = details[12] || "";
                    document.getElementById("Department_Name_select").value = details[12] || "";
                } catch (e) {
                    console.error("JSON parse error:", e.message, "Raw data:", row.dataset.details);
                }
            });
        });

        // Edit button setup with Save and Cancel
        const editButton = document.getElementById("editButton");
        const saveButton = document.getElementById("saveButton");
        const cancelButton = document.getElementById("cancelButton");
        const alertContainer = document.getElementById("alertContainer");

        // Store initial form values for Cancel
        const initialValues = {};

        if (editButton && saveButton && cancelButton && alertContainer) {
            console.log("Edit, Save, Cancel buttons and alert container found");

            // Store initial values on load
            const inputs = form.querySelectorAll("input");
            inputs.forEach(input => {
                initialValues[input.id] = input.value;
            });
            initialValues["Job_ID_select"] = document.getElementById("Job_ID").value;
            initialValues["Job_Title_select"] = document.getElementById("Job_Title").value;
            initialValues["Manager_Employee_ID_select"] = document.getElementById("Manager_Employee_ID").value;
            initialValues["Manager_First_Name_select"] = document.getElementById("Manager_First_Name").value;
            initialValues["Manager_Last_Name_select"] = document.getElementById("Manager_Last_Name").value;
            initialValues["Department_ID_select"] = document.getElementById("Department_ID").value;
            initialValues["Department_Name_select"] = document.getElementById("Department_Name").value;

            editButton.addEventListener("click", () => {
                console.log("Edit button clicked");

                // Show Save and Cancel buttons
                saveButton.style.display = "inline-block";
                cancelButton.style.display = "inline-block";

                // Toggle inputs and dropdowns
                const idInput = document.getElementById("ID");
                const firstNameInput = document.getElementById("First_Name");
                const lastNameInput = document.getElementById("Last_Name");
                const emailInput = document.getElementById("Email");
                const phoneInput = document.getElementById("Phone_Number");
                const hireDateInput = document.getElementById("Hire_Date");
                const salaryInput = document.getElementById("Salary");
                const jobIdSelect = document.getElementById("Job_ID_select");
                const jobIdInput = document.getElementById("Job_ID");
                const jobTitleSelect = document.getElementById("Job_Title_select");
                const jobTitleInput = document.getElementById("Job_Title");
                const managerIdSelect = document.getElementById("Manager_Employee_ID_select");
                const managerIdInput = document.getElementById("Manager_Employee_ID");
                const managerFirstNameSelect = document.getElementById("Manager_First_Name_select");
                const managerFirstNameInput = document.getElementById("Manager_First_Name");
                const managerLastNameSelect = document.getElementById("Manager_Last_Name_select");
                const managerLastNameInput = document.getElementById("Manager_Last_Name");
                const deptIdSelect = document.getElementById("Department_ID_select");
                const deptIdInput = document.getElementById("Department_ID");
                const deptNameSelect = document.getElementById("Department_Name_select");
                const deptNameInput = document.getElementById("Department_Name");

                console.log("Switching to edit mode");
                // Keep ID readonly
                firstNameInput.readOnly = false;
                lastNameInput.readOnly = false;
                emailInput.readOnly = false;
                phoneInput.readOnly = false;
                hireDateInput.readOnly = false;
                salaryInput.readOnly = false;
                jobIdSelect.style.display = "block";
                jobIdSelect.disabled = false;
                jobIdInput.style.display = "none";
                jobTitleSelect.style.display = "block";
                jobTitleSelect.disabled = false;
                jobTitleInput.style.display = "none";
                managerIdSelect.style.display = "block";
                managerIdSelect.disabled = false;
                managerIdInput.style.display = "none";
                managerFirstNameSelect.style.display = "block";
                managerFirstNameSelect.disabled = false;
                managerFirstNameInput.style.display = "none";
                managerLastNameSelect.style.display = "block";
                managerLastNameSelect.disabled = false;
                managerLastNameInput.style.display = "none";
                deptIdSelect.style.display = "block";
                deptIdSelect.disabled = false;
                deptIdInput.style.display = "none";
                deptNameSelect.style.display = "block";
                deptNameSelect.disabled = false;
                deptNameInput.style.display = "none";

                // Update Job_Title when Job_ID_select changes
                jobIdSelect.addEventListener("change", () => {
                    const selectedOption = jobIdSelect.options[jobIdSelect.selectedIndex];
                    jobTitleSelect.value = selectedOption.getAttribute("data-title") || "";
                    jobTitleInput.value = selectedOption.getAttribute("data-title") || "";
                    console.log("Job_ID changed, Job_Title updated to:", jobTitleInput.value);
                });

                // Update Job_ID when Job_Title_select changes
                jobTitleSelect.addEventListener("change", () => {
                    const selectedOption = jobTitleSelect.options[jobTitleSelect.selectedIndex];
                    jobIdSelect.value = selectedOption.getAttribute("data-id") || "";
                    jobIdInput.value = selectedOption.getAttribute("data-id") || "";
                    console.log("Job_Title changed, Job_ID updated to:", jobIdInput.value);
                });

                // Update Manager fields when Manager_Employee_ID_select changes
                managerIdSelect.addEventListener("change", () => {
                    const selectedOption = managerIdSelect.options[managerIdSelect.selectedIndex];
                    managerFirstNameSelect.value = selectedOption.getAttribute("data-first-name") || "";
                    managerFirstNameInput.value = selectedOption.getAttribute("data-first-name") || "";
                    managerLastNameSelect.value = selectedOption.getAttribute("data-last-name") || "";
                    managerLastNameInput.value = selectedOption.getAttribute("data-last-name") || "";
                    console.log("Manager_Employee_ID changed, Manager_First_Name updated to:", managerFirstNameInput.value, "Manager_Last_Name updated to:", managerLastNameInput.value);
                });

                // Update Manager fields when Manager_First_Name_select changes
                managerFirstNameSelect.addEventListener("change", () => {
                    const selectedOption = managerFirstNameSelect.options[managerFirstNameSelect.selectedIndex];
                    managerIdSelect.value = selectedOption.getAttribute("data-id") || "";
                    managerIdInput.value = selectedOption.getAttribute("data-id") || "";
                    managerLastNameSelect.value = selectedOption.getAttribute("data-last-name") || "";
                    managerLastNameInput.value = selectedOption.getAttribute("data-last-name") || "";
                    console.log("Manager_First_Name changed, Manager_Employee_ID updated to:", managerIdInput.value, "Manager_Last_Name updated to:", managerLastNameInput.value);
                });

                // Update Manager fields when Manager_Last_Name_select changes
                managerLastNameSelect.addEventListener("change", () => {
                    const selectedOption = managerLastNameSelect.options[managerLastNameSelect.selectedIndex];
                    managerIdSelect.value = selectedOption.getAttribute("data-id") || "";
                    managerIdInput.value = selectedOption.getAttribute("data-id") || "";
                    managerFirstNameSelect.value = selectedOption.getAttribute("data-first-name") || "";
                    managerFirstNameInput.value = selectedOption.getAttribute("data-first-name") || "";
                    console.log("Manager_Last_Name changed, Manager_Employee_ID updated to:", managerIdInput.value, "Manager_First_Name updated to:", managerFirstNameInput.value);
                });

                // Update Department_Name when Department_ID_select changes
                deptIdSelect.addEventListener("change", () => {
                    const selectedOption = deptIdSelect.options[deptIdSelect.selectedIndex];
                    deptNameSelect.value = selectedOption.getAttribute("data-name") || "";
                    deptNameInput.value = selectedOption.getAttribute("data-name") || "";
                    console.log("Department_ID changed, Department_Name updated to:", deptNameInput.value);
                });

                // Update Department_ID when Department_Name_select changes
                deptNameSelect.addEventListener("change", () => {
                    const selectedOption = deptNameSelect.options[deptNameSelect.selectedIndex];
                    deptIdSelect.value = selectedOption.getAttribute("data-id") || "";
                    deptIdInput.value = selectedOption.getAttribute("data-id") || "";
                    console.log("Department_Name changed, Department_ID updated to:", deptIdInput.value);
                });

                // Show edit mode alert
                alertContainer.innerHTML = `
                    <div class="alert alert-primary alert-dismissible fade show" role="alert">
                        Entering edit mode
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                alertContainer.style.display = "block";
            });

            saveButton.addEventListener("click", () => {
                console.log("Save button clicked");

                // Update inputs from dropdowns
                const idInput = document.getElementById("ID");
                const firstNameInput = document.getElementById("First_Name");
                const lastNameInput = document.getElementById("Last_Name");
                const emailInput = document.getElementById("Email");
                const phoneInput = document.getElementById("Phone_Number");
                const hireDateInput = document.getElementById("Hire_Date");
                const salaryInput = document.getElementById("Salary");
                const jobIdSelect = document.getElementById("Job_ID_select");
                const jobIdInput = document.getElementById("Job_ID");
                const jobTitleSelect = document.getElementById("Job_Title_select");
                const jobTitleInput = document.getElementById("Job_Title");
                const managerIdSelect = document.getElementById("Manager_Employee_ID_select");
                const managerIdInput = document.getElementById("Manager_Employee_ID");
                const managerFirstNameSelect = document.getElementById("Manager_First_Name_select");
                const managerFirstNameInput = document.getElementById("Manager_First_Name");
                const managerLastNameSelect = document.getElementById("Manager_Last_Name_select");
                const managerLastNameInput = document.getElementById("Manager_Last_Name");
                const deptIdSelect = document.getElementById("Department_ID_select");
                const deptIdInput = document.getElementById("Department_ID");
                const deptNameSelect = document.getElementById("Department_Name_select");
                const deptNameInput = document.getElementById("Department_Name");

                jobIdInput.value = jobIdSelect.value;
                jobTitleInput.value = jobTitleSelect.value;
                managerIdInput.value = managerIdSelect.value;
                managerFirstNameInput.value = managerFirstNameSelect.value;
                managerLastNameInput.value = managerLastNameSelect.value;
                deptIdInput.value = deptIdSelect.value;
                deptNameInput.value = deptNameSelect.value;

                // Disable inputs and show them
                console.log("Switching to save mode");
                idInput.readOnly = true;
                firstNameInput.readOnly = true;
                lastNameInput.readOnly = true;
                emailInput.readOnly = true;
                phoneInput.readOnly = true;
                hireDateInput.readOnly = true;
                salaryInput.readOnly = true;
                jobIdSelect.style.display = "none";
                jobIdSelect.disabled = true;
                jobIdInput.style.display = "block";
                jobTitleSelect.style.display = "none";
                jobTitleSelect.disabled = true;
                jobTitleInput.style.display = "block";
                managerIdSelect.style.display = "none";
                managerIdSelect.disabled = true;
                managerIdInput.style.display = "block";
                managerFirstNameSelect.style.display = "none";
                managerFirstNameSelect.disabled = true;
                managerFirstNameInput.style.display = "block";
                managerLastNameSelect.style.display = "none";
                managerLastNameSelect.disabled = true;
                managerLastNameInput.style.display = "block";
                deptIdSelect.style.display = "none";
                deptIdSelect.disabled = true;
                deptIdInput.style.display = "block";
                deptNameSelect.style.display = "none";
                deptNameSelect.disabled = true;
                deptNameInput.style.display = "block";

                // Hide Save and Cancel buttons
                saveButton.style.display = "none";
                cancelButton.style.display = "none";

                // Show success alert
                alertContainer.innerHTML = `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        Updated successfully
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                alertContainer.style.display = "block";

                console.log("Save clicked - updated data:", {
                    ID: idInput.value,
                    First_Name: firstNameInput.value,
                    Last_Name: lastNameInput.value,
                    Email: emailInput.value,
                    Phone_Number: phoneInput.value,
                    Hire_Date: hireDateInput.value,
                    Job_ID: jobIdInput.value,
                    Job_Title: jobTitleInput.value,
                    Salary: salaryInput.value,
                    Manager_Employee_ID: managerIdInput.value,
                    Manager_First_Name: managerFirstNameInput.value,
                    Manager_Last_Name: managerLastNameInput.value,
                    Department_ID: deptIdInput.value,
                    Department_Name: deptNameInput.value
                });
            });

            cancelButton.addEventListener("click", () => {
                console.log("Cancel button clicked");

                // Restore initial values
                Object.keys(initialValues).forEach(id => {
                    const element = document.getElementById(id);
                    if (element && (element.tagName === "INPUT" || element.tagName === "SELECT")) {
                        element.value = initialValues[id];
                    }
                });

                // Disable inputs and show them
                console.log("Switching to view mode");
                const idInput = document.getElementById("ID");
                const firstNameInput = document.getElementById("First_Name");
                const lastNameInput = document.getElementById("Last_Name");
                const emailInput = document.getElementById("Email");
                const phoneInput = document.getElementById("Phone_Number");
                const hireDateInput = document.getElementById("Hire_Date");
                const salaryInput = document.getElementById("Salary");
                const jobIdSelect = document.getElementById("Job_ID_select");
                const jobIdInput = document.getElementById("Job_ID");
                const jobTitleSelect = document.getElementById("Job_Title_select");
                const jobTitleInput = document.getElementById("Job_Title");
                const managerIdSelect = document.getElementById("Manager_Employee_ID_select");
                const managerIdInput = document.getElementById("Manager_Employee_ID");
                const managerFirstNameSelect = document.getElementById("Manager_First_Name_select");
                const managerFirstNameInput = document.getElementById("Manager_First_Name");
                const managerLastNameSelect = document.getElementById("Manager_Last_Name_select");
                const managerLastNameInput = document.getElementById("Manager_Last_Name");
                const deptIdSelect = document.getElementById("Department_ID_select");
                const deptIdInput = document.getElementById("Department_ID");
                const deptNameSelect = document.getElementById("Department_Name_select");
                const deptNameInput = document.getElementById("Department_Name");

                idInput.readOnly = true;
                firstNameInput.readOnly = true;
                lastNameInput.readOnly = true;
                emailInput.readOnly = true;
                phoneInput.readOnly = true;
                hireDateInput.readOnly = true;
                salaryInput.readOnly = true;
                jobIdSelect.style.display = "none";
                jobIdSelect.disabled = true;
                jobIdInput.style.display = "block";
                jobTitleSelect.style.display = "none";
                jobTitleSelect.disabled = true;
                jobTitleInput.style.display = "block";
                managerIdSelect.style.display = "none";
                managerIdSelect.disabled = true;
                managerIdInput.style.display = "block";
                managerFirstNameSelect.style.display = "none";
                managerFirstNameSelect.disabled = true;
                managerFirstNameInput.style.display = "block";
                managerLastNameSelect.style.display = "none";
                managerLastNameSelect.disabled = true;
                managerLastNameInput.style.display = "block";
                deptIdSelect.style.display = "none";
                deptIdSelect.disabled = true;
                deptIdInput.style.display = "block";
                deptNameSelect.style.display = "none";
                deptNameSelect.disabled = true;
                deptNameInput.style.display = "block";

                // Hide Save and Cancel buttons
                saveButton.style.display = "none";
                cancelButton.style.display = "none";

                // Show cancel alert
                alertContainer.innerHTML = `
                    <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        Edit mode cancelled
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                alertContainer.style.display = "block";
            });
        } else {
            console.log("Edit, Save, Cancel buttons or alert container not found");
        }
    } else {
        console.log("Table or form not found");
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
            row.addEventListener("click", () => {
                console.log("Setup raw data-details:", row.dataset.details);
                try {
                    const details = JSON.parse(row.dataset.details);
                    console.log("Setup parsed details:", details);
                    document.getElementById("ID").value = details[0] || "";
                    document.getElementById("First_Name").value = details[1] || "";
                    document.getElementById("Last_Name").value = details[2] || "";
                    document.getElementById("Email").value = details[3] || "";
                    document.getElementById("Phone_Number").value = details[4] || "";
                    document.getElementById("Hire_Date").value = details[5] || "";
                    document.getElementById("Job_ID").value = details[6] || "";
                    document.getElementById("Job_ID_select").value = details[6] || "";
                    document.getElementById("Job_Title").value = details[11] || "";
                    document.getElementById("Job_Title_select").value = details[11] || "";
                    document.getElementById("Salary").value = details[7] || "";
                    const managerId = details[9];
                    const manager = Array.from(tbody.querySelectorAll(".employee-row"))
                        .map(r => JSON.parse(r.dataset.details))
                        .find(emp => emp[0] === managerId) || [];
                    document.getElementById("Manager_Employee_ID").value = manager[0] || "";
                    document.getElementById("Manager_Employee_ID_select").value = manager[0] || "";
                    document.getElementById("Manager_First_Name").value = manager[1] || "";
                    document.getElementById("Manager_First_Name_select").value = manager[1] || "";
                    document.getElementById("Manager_Last_Name").value = manager[2] || "";
                    document.getElementById("Manager_Last_Name_select").value = manager[2] || "";
                    document.getElementById("Department_ID").value = details[10] || "";
                    document.getElementById("Department_ID_select").value = details[10] || "";
                    document.getElementById("Department_Name").value = details[12] || "";
                    document.getElementById("Department_Name_select").value = details[12] || "";
                } catch (e) {
                    console.error("Setup JSON parse error:", e.message, "Raw data:", row.dataset.details);
                }
            });
        });
    } else {
        console.log("Setup table not found");
    }
}