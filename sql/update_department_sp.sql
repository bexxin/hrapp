CREATE OR REPLACE PROCEDURE update_department(
    p_dept_id HR_DEPARTMENTS.DEPARTMENT_ID%TYPE,
    p_new_name HR_DEPARTMENTS.DEPARTMENT_NAME%TYPE DEFAULT NULL,
    p_manager_id HR_DEPARTMENTS.MANAGER_ID%TYPE DEFAULT NULL,
    p_location_id HR_DEPARTMENTS.LOCATION_ID%TYPE DEFAULT NULL
)
IS
    v_dept_name HR_DEPARTMENTS.DEPARTMENT_NAME%TYPE;
    v_manager_id HR_DEPARTMENTS.MANAGER_ID%TYPE;
    v_location_id HR_DEPARTMENTS.LOCATION_ID%TYPE;
BEGIN
    -- Fetch current values
    SELECT department_name, manager_id, location_id
    INTO v_dept_name, v_manager_id, v_location_id
    FROM hr_departments 
    WHERE department_id = p_dept_id;

    -- Update fields only if new values are provided
    UPDATE hr_departments
    SET department_name = NVL(p_new_name, v_dept_name),
        manager_id = NVL(p_manager_id, v_manager_id),
        location_id = NVL(p_location_id, v_location_id)
    WHERE department_id = p_dept_id;

    COMMIT;
END update_department;
/
