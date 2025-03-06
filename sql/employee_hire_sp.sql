--TASK1.1
CREATE OR REPLACE PROCEDURE employee_hire_sp(p_first_name HR_EMPLOYEES.FIRST_NAME%TYPE, 
    p_last_name HR_EMPLOYEES.LAST_NAME%TYPE, 
    p_email HR_EMPLOYEES.EMAIL%TYPE,
    p_phone HR_EMPLOYEES.PHONE_NUMBER%TYPE, 
    p_hire_date HR_EMPLOYEES.HIRE_DATE%TYPE, 
    p_job_id  HR_EMPLOYEES.JOB_ID%TYPE,
    p_salary HR_EMPLOYEES.SALARY%TYPE,
    p_manager_id HR_EMPLOYEES.MANAGER_ID%TYPE, 
    p_department_id HR_EMPLOYEES.DEPARTMENT_ID%TYPE)
IS
    var_new_emp_id NUMBER;
BEGIN
    SELECT MAX(employee_id)+1 INTO var_new_emp_id FROM hr_employees;
    INSERT INTO hr_employees (EMPLOYEE_ID, FIRST_NAME, LAST_NAME, EMAIL, 
        PHONE_NUMBER, HIRE_DATE,JOB_ID, SALARY, MANAGER_ID, DEPARTMENT_ID) 
    VALUES (var_new_emp_id,
        p_first_name, 
        p_last_name,
        p_email, 
        p_phone,
        p_hire_date,
        p_job_id , 
        p_salary,
        p_manager_id, 
        p_department_id); 
        COMMIT;
    END employee_hire_sp;
/