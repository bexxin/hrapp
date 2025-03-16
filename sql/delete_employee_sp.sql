CREATE OR REPLACE PROCEDURE delete_employee(p_emp_id HR_EMPLOYEES.EMPLOYEE_ID%TYPE)
IS
BEGIN
    DELETE FROM hr_employees WHERE employee_id = p_emp_id;
    
    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'No employee found with this ID.');
    END IF;

    COMMIT;
END delete_employee;
/
