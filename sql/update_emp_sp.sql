CREATE OR REPLACE PROCEDURE update_employee_sp(
    p_emp_id HR_EMPLOYEES.EMPLOYEE_ID%TYPE,
    p_first_name HR_EMPLOYEES.FIRST_NAME%TYPE DEFAULT NULL,
    p_last_name HR_EMPLOYEES.LAST_NAME%TYPE DEFAULT NULL,
    p_email HR_EMPLOYEES.EMAIL%TYPE DEFAULT NULL,
    p_phone HR_EMPLOYEES.PHONE_NUMBER%TYPE DEFAULT NULL,
    p_job_id HR_EMPLOYEES.JOB_ID%TYPE DEFAULT NULL,
    p_salary HR_EMPLOYEES.SALARY%TYPE DEFAULT NULL,
    p_commission_pct HR_EMPLOYEES.COMMISSION_PCT%TYPE DEFAULT NULL,
    p_manager_id HR_EMPLOYEES.MANAGER_ID%TYPE DEFAULT NULL,
    p_department_id HR_EMPLOYEES.DEPARTMENT_ID%TYPE DEFAULT NULL
)
IS
    v_emp_exists NUMBER;
    v_current HR_EMPLOYEES%ROWTYPE;
BEGIN
    -- raise error if employee does not exist
    SELECT COUNT(*) INTO v_emp_exists FROM hr_employees WHERE employee_id = p_emp_id;
    IF v_emp_exists = 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Employee ID not found.');
    END IF;

    
    SELECT * INTO v_current FROM hr_employees WHERE employee_id = p_emp_id;


    UPDATE hr_employees
    SET first_name = NVL(p_first_name, v_current.first_name),
        last_name = NVL(p_last_name, v_current.last_name),
        email = NVL(p_email, v_current.email),
        phone_number = NVL(p_phone, v_current.phone_number),
        job_id = NVL(p_job_id, v_current.job_id),
        salary = NVL(p_salary, v_current.salary),
        commission_pct = NVL(p_commission_pct, v_current.commission_pct),
        manager_id = NVL(p_manager_id, v_current.manager_id),
        department_id = NVL(p_department_id, v_current.department_id)
    WHERE employee_id = p_emp_id;

    COMMIT;
END update_employee_sp;
/
