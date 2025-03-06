CREATE OR REPLACE PROCEDURE check_salary(p_jobid HR_JOBS.JOB_ID%TYPE,
    p_salary NUMBER)
IS
    v_minsal hr_jobs.min_salary%TYPE;
    v_maxsal hr_jobs.max_salary%type;
BEGIN
    SELECT min_salary, max_salary INTO v_minsal, v_maxsal FROM hr_jobs
    WHERE job_id= UPPER(p_jobid);
    IF NOT (p_salary BETWEEN v_minsal AND v_maxsal) THEN
    RAISE_APPLICATION_ERROR(-20100, 'Invalid salary$ ' || p_salary || ' Please enter a salary between $' || v_minsal || ' and $' || v_maxsal);
    END IF;
END;
/