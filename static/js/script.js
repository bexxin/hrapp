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

    // Department Table and Form Setup
    const deptTable = document.getElementById("deptTable");
    const deptForm = document.getElementById("deptForm");
    if (deptTable && deptForm) {
        console.log("Department table and form found");
        setupTable(deptTable, deptForm, "dept");
    } else {
        console.log("Department table or form not found");
    }

    // User Table and Form Setup
    const userTable = document.getElementById("userTable");
    const userForm = document.getElementById("userForm");
    if (userTable && userForm) {
        console.log("User table and form found");
        setupTable(userTable, userForm, "user");
    } else {
        console.log("User table or form not found");
    }

});

// Function to reset form fields to view mode
function resetToViewMode(type, initialValues) {
    console.log(`Resetting to view mode for ${type}`);

    // Generic reset for inputs and selects
    Object.keys(initialValues).forEach(id => {
        const element = document.getElementById(id);
        if (element && element.tagName === "INPUT") {
            element.value = initialValues[id];
            element.readOnly = true; // Inputs should be readonly in view mode
        } else if (element && element.tagName === "SELECT") {
            element.value = initialValues[id];
            element.style.display = "none"; // Hide selects in view mode
            element.disabled = true;
        }
    });

    // Type-specific reset logic (employee, job, dept)
    if (type === "employee") {
        // Employee-specific resets...
    } else if (type === "job") {
        // Job-specific resets...
    } else if (type === "dept") {
        // Department-specific resets...
    } else if (type === "user") {
        // User-specific resets...
    }
    // Toggle button visibility
    document.getElementById("saveButton").style.display = "none";
    document.getElementById("cancelButton").style.display = "none";
    document.getElementById("deleteButton").style.display = "none";
    document.getElementById("editButton").style.display = "inline-block";

    console.log(`${type} reset completed.`);
}

// Generalized Table Setup Function
function setupTable(table, form, type) {
    // Use the existing initialValues variable
    const tbody = table.querySelector("tbody");
    const headers = table.querySelectorAll(".sortable");
    let selectedRow = null;


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
                if ((type === "job" && (colIndex === 2 || colIndex === 3)) ||
                    (type === "dept" && (colIndex === 2 || colIndex === 3))) {
                    return isAscending
                        ? parseFloat(aValue || 0) - parseFloat(bValue || 0)
                        : parseFloat(bValue || 0) - parseFloat(aValue || 0);
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
            if (selectedRow) {
                selectedRow.classList.remove("table-active");
            }
            row.classList.add("table-active");
            selectedRow = row;
            console.log("there is a row selected", selectedRow)

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
                } else if (type === "dept") {
                    document.getElementById("Department_ID").value = details.department_id || "";
                    document.getElementById("Department_Name").value = details.department_name || "";
                    document.getElementById("Manager_ID").value = details.employee_id || details.manager_id || "";
                    document.getElementById("Manager_ID_select").value = details.employee_id || details.manager_id || "";
                    document.getElementById("First_Name").value = details.first_name || "";
                    document.getElementById("First_Name_select").value = details.first_name || "";
                    document.getElementById("Last_Name").value = details.last_name || "";
                    document.getElementById("Last_Name_select").value = details.last_name || "";
                    document.getElementById("Loc_ID").value = details.loc_id || details.location_id || "";
                    document.getElementById("Loc_ID_select").value = details.loc_id || details.location_id || "";
                    document.getElementById("Street_Address").value = details.street_address || "";
                    document.getElementById("Postal_Code").value = details.postal_code || "";
                    document.getElementById("City").value = details.city || "";
                    document.getElementById("State_Province").value = details.state_province || "";
                    document.getElementById("Country_Name").value = details.country_name || "";
                    document.getElementById("Region_Name").value = details.region_name || "";
                } else if (type === "user") {
                    document.getElementById("User_ID").value = details.user_id || "";
                    document.getElementById("Username").value = details.username || "";
                    document.getElementById("Email").value = details.email || "";
                    document.getElementById("Created_At").value = details.created_at || "";
                }
            } catch (e) {
                console.error(`${type} JSON parse error:`, e.message, "Raw data:", row.dataset.details);
            }
        });
    });

    // Edit button setup with Save, Delete and Cancel
    const editButton = document.getElementById("editButton");
    const saveButton = document.getElementById("saveButton");
    const deleteButton = document.getElementById("deleteButton");
    const cancelButton = document.getElementById("cancelButton");
    const alertContainer = document.getElementById("alertContainer");


    // Store initial form values for Cancel
    const initialValues = {};

    if (editButton && saveButton && deleteButton && cancelButton && alertContainer) {
        console.log(`${type} Edit, Save, Cancel buttons and alert container found`);

        // Store initial values on load
        const inputs = form.querySelectorAll("input");
        const selects = form.querySelectorAll("select");
        inputs.forEach(input => initialValues[input.id] = input.value);
        selects.forEach(select => initialValues[select.id] = select.value);

        editButton.addEventListener("click", () => {
            console.log(`${type} Edit button clicked`);
            saveButton.style.display = "inline-block";
            cancelButton.style.display = "inline-block";
            deleteButton.style.display = "inline-block";
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
                jobIdInput.readOnly = true;
                jobTitleInput.readOnly = false;
                minSalaryInput.readOnly = false;
                maxSalaryInput.readOnly = false;
            } else if (type === "dept") {
                const deptIdInput = document.getElementById("Department_ID");
                const deptNameInput = document.getElementById("Department_Name");
                const managerIdSelect = document.getElementById("Manager_ID_select");
                const managerIdInput = document.getElementById("Manager_ID");
                const firstNameSelect = document.getElementById("First_Name_select");
                const firstNameInput = document.getElementById("First_Name");
                const lastNameSelect = document.getElementById("Last_Name_select");
                const lastNameInput = document.getElementById("Last_Name");
                const locIdSelect = document.getElementById("Loc_ID_select");
                const locIdInput = document.getElementById("Loc_ID");
                const streetAddressInput = document.getElementById("Street_Address");
                const postalCodeInput = document.getElementById("Postal_Code");
                const cityInput = document.getElementById("City");
                const stateProvinceInput = document.getElementById("State_Province");
                const countryNameInput = document.getElementById("Country_Name");
                const regionNameInput = document.getElementById("Region_Name");

                console.log("Switching to edit mode for department");
                deptIdInput.readOnly = true; // ID remains readonly
                deptNameInput.readOnly = false; // Editable text input
                managerIdSelect.style.display = "block";
                managerIdSelect.disabled = false;
                managerIdInput.style.display = "none";
                firstNameSelect.style.display = "block";
                firstNameSelect.disabled = false;
                firstNameInput.style.display = "none";
                lastNameSelect.style.display = "block";
                lastNameSelect.disabled = false;
                lastNameInput.style.display = "none";
                locIdSelect.style.display = "block";
                locIdSelect.disabled = false;
                locIdInput.style.display = "none";
                // Keep location details as readonly inputs
                streetAddressInput.readOnly = true;
                postalCodeInput.readOnly = true;
                cityInput.readOnly = true;
                stateProvinceInput.readOnly = true;
                countryNameInput.readOnly = true;
                regionNameInput.readOnly = true;

                // Synchronize Manager dropdowns
                managerIdSelect.addEventListener("change", () => {
                    const selectedOption = managerIdSelect.options[managerIdSelect.selectedIndex];
                    managerIdInput.value = selectedOption.value || "";
                    firstNameSelect.value = selectedOption.getAttribute("data-first-name") || "";
                    firstNameInput.value = selectedOption.getAttribute("data-first-name") || "";
                    lastNameSelect.value = selectedOption.getAttribute("data-last-name") || "";
                    lastNameInput.value = selectedOption.getAttribute("data-last-name") || "";
                });
                firstNameSelect.addEventListener("change", () => {
                    const selectedOption = firstNameSelect.options[firstNameSelect.selectedIndex];
                    managerIdSelect.value = selectedOption.getAttribute("data-employee-id") || "";
                    managerIdInput.value = selectedOption.getAttribute("data-employee-id") || "";
                    lastNameSelect.value = selectedOption.getAttribute("data-last-name") || "";
                    lastNameInput.value = selectedOption.getAttribute("data-last-name") || "";
                });
                lastNameSelect.addEventListener("change", () => {
                    const selectedOption = lastNameSelect.options[lastNameSelect.selectedIndex];
                    managerIdSelect.value = selectedOption.getAttribute("data-employee-id") || "";
                    managerIdInput.value = selectedOption.getAttribute("data-employee-id") || "";
                    firstNameSelect.value = selectedOption.getAttribute("data-first-name") || "";
                    firstNameInput.value = selectedOption.getAttribute("data-first-name") || "";
                });

                // Synchronize Location dropdown and update readonly fields
                locIdSelect.addEventListener("change", () => {
                    const selectedOption = locIdSelect.options[locIdSelect.selectedIndex];
                    locIdInput.value = selectedOption.value || "";
                    streetAddressInput.value = selectedOption.getAttribute("data-street-address") || "";
                    postalCodeInput.value = selectedOption.getAttribute("data-postal-code") || "";
                    cityInput.value = selectedOption.getAttribute("data-city") || "";
                    stateProvinceInput.value = selectedOption.getAttribute("data-state-province") || "";
                    countryNameInput.value = selectedOption.getAttribute("data-country-name") || "";
                    regionNameInput.value = selectedOption.getAttribute("data-region-name") || "";
                });
            } else if (type === "user") {
                // Unlock fields for editing
                console.log("Switching to edit mode for user");
                const usernameInput = document.getElementById("Username");
                const emailInput = document.getElementById("Email");

                usernameInput.readOnly = false;
                emailInput.readOnly = false;

                // Ensure ID and Created_At remain locked
                document.getElementById("User_ID").readOnly = true;
                document.getElementById("Created_At").readOnly = true;
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
                deleteButton.style.display = "none";
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
                            deleteButton.style.display = "none";
                            editButton.style.display = "inline-block";

                            alertContainer.innerHTML = `
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                ${data.message}
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        `;

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
            } else if (type === "dept") {
                const deptIdInput = document.getElementById("Department_ID");
                const deptNameInput = document.getElementById("Department_Name");
                const managerIdSelect = document.getElementById("Manager_ID_select");
                const managerIdInput = document.getElementById("Manager_ID");
                const firstNameSelect = document.getElementById("First_Name_select");
                const firstNameInput = document.getElementById("First_Name");
                const lastNameSelect = document.getElementById("Last_Name_select");
                const lastNameInput = document.getElementById("Last_Name");
                const locIdSelect = document.getElementById("Loc_ID_select");
                const locIdInput = document.getElementById("Loc_ID");
                const streetAddressInput = document.getElementById("Street_Address");
                const postalCodeInput = document.getElementById("Postal_Code");
                const cityInput = document.getElementById("City");
                const stateProvinceInput = document.getElementById("State_Province");
                const countryNameInput = document.getElementById("Country_Name");
                const regionNameInput = document.getElementById("Region_Name");

                // Update input fields with selected values
                managerIdInput.value = managerIdSelect.value;
                firstNameInput.value = firstNameSelect.value;
                lastNameInput.value = lastNameSelect.value;
                locIdInput.value = locIdSelect.value;

                const deptData = {
                    dept_id: deptIdInput.value,
                    new_name: deptNameInput.value || null,
                    manager_id: managerIdSelect.value || null,
                    location_id: locIdSelect.value || null
                };

                fetch('/update_department', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(deptData)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        alertContainer.style.display = "block";
                        if (data.success) { // Success case based on your Flask result
                            deptNameInput.readOnly = true;
                            managerIdSelect.style.display = "none";
                            managerIdSelect.disabled = true;
                            managerIdInput.style.display = "block";
                            firstNameSelect.style.display = "none";
                            firstNameSelect.disabled = true;
                            firstNameInput.style.display = "block";
                            lastNameSelect.style.display = "none";
                            lastNameSelect.disabled = true;
                            lastNameInput.style.display = "block";
                            locIdSelect.style.display = "none";
                            locIdSelect.disabled = true;
                            locIdInput.style.display = "block";
                            saveButton.style.display = "none";
                            cancelButton.style.display = "none";
                            deleteButton.style.display = "none";
                            editButton.style.display = "inline-block";

                            alertContainer.innerHTML = `
                                <div class="alert alert-success alert-dismissible fade show" role="alert">
                                    Department updated successfully
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            `;

                            const row = tbody.querySelector(`tr[data-details*="${deptData.dept_id}"]`);
                            if (row) {
                                row.cells[1].textContent = deptData.new_name || '';
                                row.cells[2].textContent = deptData.manager_id || '';
                                row.cells[3].textContent = deptData.location_id || '';
                                const updatedDetails = JSON.parse(row.dataset.details);
                                updatedDetails.department_name = deptData.new_name;
                                updatedDetails.employee_id = deptData.manager_id; // or manager_id
                                updatedDetails.loc_id = deptData.location_id; // or location_id
                                row.dataset.details = JSON.stringify(updatedDetails);
                            }
                        } else {
                            alertContainer.innerHTML = `
                                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                    ${data.error || "Failed to update department"}
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
                                Error updating department: ${error.message}
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        `;
                    });
            } else if (type === "user") {
                const updatedDetails = {
                    user_id: document.getElementById("User_ID").value,
                    username: document.getElementById("Username").value,
                    email: document.getElementById("Email").value
                };

                fetch("/update_user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedDetails),
                })
                    .then(response => response.json())
                    .then(data => {
                        alertContainer.style.display = "block";
                        if (data.success) {
                            alertContainer.innerHTML = `
                                <div class="alert alert-success alert-dismissible fade show" role="alert">
                                    User updated successfully!
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            `;
                            selectedRow.dataset.details = JSON.stringify(updatedDetails);
                        } else {
                            alertContainer.innerHTML = `
                                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                    Error updating user: ${data.error}
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            `;
                        }

                        // Reset fields to view mode
                        document.getElementById("Username").readOnly = true;
                        document.getElementById("Email").readOnly = true;

                        saveButton.style.display = "none";
                        cancelButton.style.display = "none";
                        deleteButton.style.display = "none";
                        editButton.style.display = "inline-block";
                    })
                    .catch(error => {
                        console.error("Save error:", error);
                        alertContainer.style.display = "block";
                        alertContainer.innerHTML = `
                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                Error: ${error}
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        `;
                    });
            }
        });


        if (deleteButton) {
            console.log(`${type} Delete button found`);
            deleteButton.addEventListener("click", () => {
                if (!selectedRow) {
                    alert("No row selected for deletion!");
                    return;
                }
                console.log(selectedRow)

                try {
                    details = JSON.parse(selectedRow.dataset.details)
                    console.log("Parsed details:", details);
                } catch (error) {
                    console.error("Error parsing dataset.details:", error);
                    alert("Error: Could not parse row details.");
                    return;
                }

                let apiEndpoint = "";
                let idValue;


                if (type === "employee") {
                    idValue = details.employee_id || details[0]
                    apiEndpoint = "/delete_employee";
                } else if (type === "job") {
                    idValue = details.job_id || details[0]
                    apiEndpoint = "/delete_job";
                } else if (type === "dept") {
                    idValue = details.department_id || details[0]
                    apiEndpoint = "/delete_department";
                } else if (type === "user") {
                    idValue = details.user_id || details[0];
                    apiEndpoint = "/delete_user"; // Update endpoint for user deletion
                }


                if (!idValue) {
                    alert("No valid ID found for deletion.", { idValue });
                    return;
                }

                if (!confirm(`Are you sure you want to delete this ${type} (ID: ${idValue})?`)) {
                    return;
                }

                console.log(`Deleting ${type} with ID: ${idValue}`);

                fetch(apiEndpoint, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: idValue }),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            alert(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
                            selectedRow.remove(); // Remove the row from table
                            selectedRow = null; // Reset selection
                            resetToViewMode(type, initialValues);
                            alertContainer.innerHTML = `
                                <div class="alert alert-success alert-dismissible fade show" role="alert">
                                    Deleted successfully
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            `;
                            alertContainer.style.display = "block";
                        } else {
                            alert(`Error: ${data.error || "Failed to delete"}`);
                        }
                    })
                    .catch(error => {
                        console.error(`Error deleting ${type}:`, error);
                        alert("Server error. Please try again.");
                    });
            });
        } else {
            console.log(`${type} Delete button not found`);
        }


        cancelButton.addEventListener("click", () => {
            console.log(`${type} Cancel button clicked`);
            Object.keys(initialValues).forEach(id => {
                const element = document.getElementById(id);
                if (element && element.tagName === "INPUT") {
                    element.value = initialValues[id];
                } else if (element && element.tagName === "SELECT") {
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

                // Add button visibility toggling logic here
                saveButton.style.display = "none";
                cancelButton.style.display = "none";
                deleteButton.style.display = "none";
                editButton.style.display = "inline-block";

                alertContainer.innerHTML = `
                    <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        Edit mode cancelled
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                alertContainer.style.display = "block";
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

                // Add button visibility toggling logic here
                saveButton.style.display = "none";
                cancelButton.style.display = "none";
                deleteButton.style.display = "none";
                editButton.style.display = "inline-block";

                alertContainer.innerHTML = `
                    <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        Edit mode cancelled
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                alertContainer.style.display = "block";
            } else if (type === "dept") {
                const deptIdInput = document.getElementById("Department_ID");
                const deptNameInput = document.getElementById("Department_Name");
                const managerIdSelect = document.getElementById("Manager_ID_select");
                const managerIdInput = document.getElementById("Manager_ID");
                const firstNameSelect = document.getElementById("First_Name_select");
                const firstNameInput = document.getElementById("First_Name");
                const lastNameSelect = document.getElementById("Last_Name_select");
                const lastNameInput = document.getElementById("Last_Name");
                const locIdSelect = document.getElementById("Loc_ID_select");
                const locIdInput = document.getElementById("Loc_ID");
                const streetAddressInput = document.getElementById("Street_Address");
                const postalCodeInput = document.getElementById("Postal_Code");
                const cityInput = document.getElementById("City");
                const stateProvinceInput = document.getElementById("State_Province");
                const countryNameInput = document.getElementById("Country_Name");
                const regionNameInput = document.getElementById("Region_Name");

                console.log("Switching to view mode for department");
                deptNameInput.readOnly = true;
                managerIdSelect.style.display = "none";
                managerIdSelect.disabled = true;
                managerIdInput.style.display = "block";
                firstNameSelect.style.display = "none";
                firstNameSelect.disabled = true;
                firstNameInput.style.display = "block";
                lastNameSelect.style.display = "none";
                lastNameSelect.disabled = true;
                lastNameInput.style.display = "block";
                locIdSelect.style.display = "none";
                locIdSelect.disabled = true;
                locIdInput.style.display = "block";
                streetAddressInput.readOnly = true;
                postalCodeInput.readOnly = true;
                cityInput.readOnly = true;
                stateProvinceInput.readOnly = true;
                countryNameInput.readOnly = true;
                regionNameInput.readOnly = true;

                // Ensure location details revert to initial values
                const initialLocId = initialValues["Loc_ID"];
                const matchingOption = Array.from(locIdSelect.options).find(option => option.value === initialLocId);
                if (matchingOption) {
                    streetAddressInput.value = matchingOption.getAttribute("data-street-address") || "";
                    postalCodeInput.value = matchingOption.getAttribute("data-postal-code") || "";
                    cityInput.value = matchingOption.getAttribute("data-city") || "";
                    stateProvinceInput.value = matchingOption.getAttribute("data-state-province") || "";
                    countryNameInput.value = matchingOption.getAttribute("data-country-name") || "";
                    regionNameInput.value = matchingOption.getAttribute("data-region-name") || "";
                }

                // Add button visibility toggling logic here
                saveButton.style.display = "none";
                cancelButton.style.display = "none";
                deleteButton.style.display = "none";
                editButton.style.display = "inline-block";

                alertContainer.innerHTML = `
                    <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        Edit mode cancelled
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                alertContainer.style.display = "block";
            } else if (type === "user") {
                console.log("Switching to view mode for user");

                // Resetting readonly fields
                document.getElementById("Username").readOnly = true;
                document.getElementById("Email").readOnly = true;

                // Ensuring ID and Created_At stay readonly
                document.getElementById("User_ID").readOnly = true;
                document.getElementById("Created_At").readOnly = true;

                // Button visibility toggling
                saveButton.style.display = "none";
                cancelButton.style.display = "none";
                deleteButton.style.display = "none";
                editButton.style.display = "inline-block";

                alertContainer.innerHTML = `
                    <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        Edit mode cancelled
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                alertContainer.style.display = "block";
            }
        });
    } else {
        console.log(`${type} Edit, Save, Cancel buttons or alert container not found`);
    }
}