CREATE OR REPLACE PROCEDURE create_department(
    p_dept_id HR_DEPARTMENTS.DEPARTMENT_ID%TYPE,
    p_dept_name HR_DEPARTMENTS.DEPARTMENT_NAME%TYPE,
    p_manager_id HR_DEPARTMENTS.MANAGER_ID%TYPE DEFAULT NULL
    p_location_id HR_DEPARTMENTS.LOCATION_ID%TYPE DEFAULT NULL
)
IS
BEGIN
    INSERT INTO hr_departments (department_id, department_name, manager_id,loation_id)
    VALUES (p_dept_id, p_dept_name, p_manager_id,p_location_id);

    COMMIT;
END create_department;
/
