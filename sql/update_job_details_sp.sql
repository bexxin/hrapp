--Task 2.2
CREATE OR REPLACE PROCEDURE update_job_details_sp(
    p_job_id HR_JOBS.JOB_ID%TYPE,
    p_new_job_title HR_JOBS.JOB_TITLE%TYPE DEFAULT NULL,
    p_min_salary HR_JOBS.MIN_SALARY%TYPE DEFAULT NULL,
    p_max_salary HR_JOBS.MAX_SALARY%TYPE DEFAULT NULL
)
IS
    v_current_title HR_JOBS.JOB_TITLE%TYPE;
    v_min_salary HR_JOBS.MIN_SALARY%TYPE;
    v_max_salary HR_JOBS.MAX_SALARY%TYPE;
BEGIN
    -- Fetch existing job details
    SELECT JOB_TITLE, MIN_SALARY, MAX_SALARY
    INTO v_current_title, v_min_salary, v_max_salary
    FROM HR_JOBS
    WHERE JOB_ID = p_job_id;

    -- update fields that have new values
    UPDATE HR_JOBS
    SET JOB_TITLE = NVL(p_new_job_title, v_current_title),
        MIN_SALARY = NVL(p_min_salary, v_min_salary),
        MAX_SALARY = NVL(p_max_salary, v_max_salary)
    WHERE JOB_ID = p_job_id;

    COMMIT;
END update_job_details_sp;
/