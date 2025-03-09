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

    // Employee Table and Form Setup
    const employeeTable = document.getElementById("employeeTable");
    const employeeForm = document.getElementById("employeeForm");
    if (employeeTable && employeeForm) {
        console.log("Employee table and form found");
        setupTable(employeeTable, employeeForm, "employee");
    } else {
        console.log("Employee table or form not found");
    }

    // Job Table and Form Setup
    const jobTable = document.getElementById("jobTable");
    const jobForm = document.getElementById("jobForm");
    if (jobTable && jobForm) {
        console.log("Job table and form found");
        setupTable(jobTable, jobForm, "job");
    } else {
        console.log("Job table or form not found");
    }
});

// Generalized Table Setup Function
function setupTable(table, form, type) {
    const tbody = table.querySelector("tbody");
    const headers = table.querySelectorAll(".sortable");

    // Sorting headers
    headers.forEach(header => {
        header.addEventListener("click", () => {
            console.log(`Sorting ${type} header clicked:`, header.dataset.sort);
            const colIndex = parseInt(header.dataset.sort);
            const rows = Array.from(tbody.querySelectorAll("tr"));
            const isAscending = header.classList.toggle("asc");
            const columnName = header.querySelector("span").textContent;

            header.title = isAscending
                ? `Sorted by ${columnName} (A-Z/Low-High)`
                : `Sorted by ${columnName} (Z-A/High-Low)`;

            rows.sort((a, b) => {
                const aValue = a.cells[colIndex].textContent.trim();
                const bValue = b.cells[colIndex].textContent.trim();
                if (type === "job" && (colIndex === 2 || colIndex === 3)) {
                    return isAscending
                        ? parseFloat(aValue) - parseFloat(bValue)
                        : parseFloat(bValue) - parseFloat(aValue);
                }
                return isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            });

            rows.forEach(row => tbody.appendChild(row));
            headers.forEach(h => h.classList.remove("asc", "desc"));
            header.classList.add(isAscending ? "asc" : "desc");
        });
    });

    // Row click to update form
    const rows = tbody.querySelectorAll(`.${type}-row`);
    console.log(`${type} rows found:`, rows.length);
    rows.forEach(row => {
        row.addEventListener("click", () => {
            console.log(`${type} row clicked, raw data-details:`, row.dataset.details);
            try {
                const details = JSON.parse(row.dataset.details);
                console.log(`${type} parsed details:`, details);
                if (type === "employee") {
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
                } else if (type === "job") {
                    document.getElementById("Job_ID").value = details.job_id || "";
                    document.getElementById("Job_Title").value = details.job_title || "";
                    document.getElementById("Min_Salary").value = details.min_salary || "";
                    document.getElementById("Max_Salary").value = details.max_salary || "";
                }
            } catch (e) {
                console.error(`${type} JSON parse error:`, e.message, "Raw data:", row.dataset.details);
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
        console.log(`${type} Edit, Save, Cancel buttons and alert container found`);

        // Store initial values on load
        const inputs = form.querySelectorAll("input");
        inputs.forEach(input => {
            initialValues[input.id] = input.value;
        });

        editButton.addEventListener("click", () => {
            console.log(`${type} Edit button clicked`);
            saveButton.style.display = "inline-block";
            cancelButton.style.display = "inline-block";
            editButton.style.display = "none";

            if (type === "employee") {
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

                console.log("Switching to edit mode for employee");
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

                // Event listeners for employee dropdowns
                jobIdSelect.addEventListener("change", () => {
                    const selectedOption = jobIdSelect.options[jobIdSelect.selectedIndex];
                    jobTitleSelect.value = selectedOption.getAttribute("data-title") || "";
                    jobTitleInput.value = selectedOption.getAttribute("data-title") || "";
                });
                jobTitleSelect.addEventListener("change", () => {
                    const selectedOption = jobTitleSelect.options[jobTitleSelect.selectedIndex];
                    jobIdSelect.value = selectedOption.getAttribute("data-id") || "";
                    jobIdInput.value = selectedOption.getAttribute("data-id") || "";
                });
                managerIdSelect.addEventListener("change", () => {
                    const selectedOption = managerIdSelect.options[managerIdSelect.selectedIndex];
                    managerFirstNameSelect.value = selectedOption.getAttribute("data-first-name") || "";
                    managerFirstNameInput.value = selectedOption.getAttribute("data-first-name") || "";
                    managerLastNameSelect.value = selectedOption.getAttribute("data-last-name") || "";
                    managerLastNameInput.value = selectedOption.getAttribute("data-last-name") || "";
                });
                managerFirstNameSelect.addEventListener("change", () => {
                    const selectedOption = managerFirstNameSelect.options[managerFirstNameSelect.selectedIndex];
                    managerIdSelect.value = selectedOption.getAttribute("data-id") || "";
                    managerIdInput.value = selectedOption.getAttribute("data-id") || "";
                    managerLastNameSelect.value = selectedOption.getAttribute("data-last-name") || "";
                    managerLastNameInput.value = selectedOption.getAttribute("data-last-name") || "";
                });
                managerLastNameSelect.addEventListener("change", () => {
                    const selectedOption = managerLastNameSelect.options[managerLastNameSelect.selectedIndex];
                    managerIdSelect.value = selectedOption.getAttribute("data-id") || "";
                    managerIdInput.value = selectedOption.getAttribute("data-id") || "";
                    managerFirstNameSelect.value = selectedOption.getAttribute("data-first-name") || "";
                    managerFirstNameInput.value = selectedOption.getAttribute("data-first-name") || "";
                });
                deptIdSelect.addEventListener("change", () => {
                    const selectedOption = deptIdSelect.options[deptIdSelect.selectedIndex];
                    deptNameSelect.value = selectedOption.getAttribute("data-name") || "";
                    deptNameInput.value = selectedOption.getAttribute("data-name") || "";
                });
                deptNameSelect.addEventListener("change", () => {
                    const selectedOption = deptNameSelect.options[deptNameSelect.selectedIndex];
                    deptIdSelect.value = selectedOption.getAttribute("data-id") || "";
                    deptIdInput.value = selectedOption.getAttribute("data-id") || "";
                });
            } else if (type === "job") {
                const jobIdInput = document.getElementById("Job_ID");
                const jobTitleInput = document.getElementById("Job_Title");
                const minSalaryInput = document.getElementById("Min_Salary");
                const maxSalaryInput = document.getElementById("Max_Salary");

                console.log("Switching to edit mode for job");
                jobIdInput.readOnly = true; // Job ID typically not editable
                jobTitleInput.readOnly = false;
                minSalaryInput.readOnly = false;
                maxSalaryInput.readOnly = false;
            }

            alertContainer.innerHTML = `
                <div class="alert alert-primary alert-dismissible fade show" role="alert">
                    Entering edit mode
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            alertContainer.style.display = "block";
        });

        saveButton.addEventListener("click", () => {
            console.log(`${type} Save button clicked`);

            if (type === "employee") {
                // Employee save logic (unchanged for now)
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

                console.log("Switching to save mode for employee");
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

                saveButton.style.display = "none";
                cancelButton.style.display = "none";
                editButton.style.display = "inline-block";

                alertContainer.innerHTML = `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        Updated successfully
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                alertContainer.style.display = "block";
            } else if (type === "job") {
                const jobIdInput = document.getElementById("Job_ID");
                const jobTitleInput = document.getElementById("Job_Title");
                const minSalaryInput = document.getElementById("Min_Salary");
                const maxSalaryInput = document.getElementById("Max_Salary");

                const jobData = {
                    job_id: jobIdInput.value,
                    job_title: jobTitleInput.value || null,
                    min_salary: minSalaryInput.value ? parseFloat(minSalaryInput.value) : null,
                    max_salary: maxSalaryInput.value ? parseFloat(maxSalaryInput.value) : null
                };

                fetch('/update_job', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(jobData)
                })
                .then(response => response.json())
                .then(data => {
                    alertContainer.style.display = "block";
                    if (data.status === "success") {
                        jobIdInput.readOnly = true;
                        jobTitleInput.readOnly = true;
                        minSalaryInput.readOnly = true;
                        maxSalaryInput.readOnly = true;
                        saveButton.style.display = "none";
                        cancelButton.style.display = "none";
                        editButton.style.display = "inline-block";

                        alertContainer.innerHTML = `
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                ${data.message}
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        `;

                        // Update table row
                        const row = tbody.querySelector(`tr[data-details*="${jobData.job_id}"]`);
                        if (row) {
                            row.cells[1].textContent = jobData.job_title || '';
                            row.cells[2].textContent = jobData.min_salary || '';
                            row.cells[3].textContent = jobData.max_salary || '';
                            row.dataset.details = JSON.stringify(jobData);
                        }
                    } else {
                        alertContainer.innerHTML = `
                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                ${data.message || data.error}
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        `;
                    }
                })
                .catch(error => {
                    console.error("Save error:", error);
                    alertContainer.style.display = "block";
                    alertContainer.innerHTML = `
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            Error updating job: ${error}
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    `;
                });
            }
        });

        cancelButton.addEventListener("click", () => {
            console.log(`${type} Cancel button clicked`);
            Object.keys(initialValues).forEach(id => {
                const element = document.getElementById(id);
                if (element && element.tagName === "INPUT") {
                    element.value = initialValues[id];
                }
            });

            if (type === "employee") {
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

                console.log("Switching to view mode for employee");
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
            } else if (type === "job") {
                const jobIdInput = document.getElementById("Job_ID");
                const jobTitleInput = document.getElementById("Job_Title");
                const minSalaryInput = document.getElementById("Min_Salary");
                const maxSalaryInput = document.getElementById("Max_Salary");

                console.log("Switching to view mode for job");
                jobIdInput.readOnly = true;
                jobTitleInput.readOnly = true;
                minSalaryInput.readOnly = true;
                maxSalaryInput.readOnly = true;
            }

            saveButton.style.display = "none";
            cancelButton.style.display = "none";
            editButton.style.display = "inline-block";

            alertContainer.innerHTML = `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    Edit mode cancelled
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            alertContainer.style.display = "block";
        });
    } else {
        console.log(`${type} Edit, Save, Cancel buttons or alert container not found`);
    }
}