CREATE OR REPLACE PROCEDURE create_department_sp(
    p_dept_name HR_DEPARTMENTS.DEPARTMENT_NAME%TYPE,
    p_manager_id HR_DEPARTMENTS.MANAGER_ID%TYPE DEFAULT NULL,
    p_location_id HR_DEPARTMENTS.LOCATION_ID%TYPE DEFAULT NULL
)
IS
    --Automatically generate new dept_id
    v_dept_id HR_DEPARTMENTS.DEPARTMENT_ID%TYPE;
BEGIN
    SELECT MAX(department_id) + 10
    INTO v_dept_id
    FROM hr_departments;

    INSERT INTO hr_departments (department_id, department_name, manager_id,location_id)
    VALUES (v_dept_id, p_dept_name, p_manager_id,p_location_id);

    COMMIT;
END create_department_sp;
/
