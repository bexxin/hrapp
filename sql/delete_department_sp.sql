CREATE OR REPLACE PROCEDURE delete_department(p_dept_id HR_DEPARTMENTS.DEPARTMENT_ID%TYPE)
IS
BEGIN
    DELETE FROM hr_departments WHERE department_id = p_dept_id;

    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20003, 'No department found with this ID.');
    END IF;

    COMMIT;
END delete_department;
/
