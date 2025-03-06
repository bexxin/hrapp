--TASK 2.3
CREATE OR REPLACE PROCEDURE new_job(p_jobid HR_JOBS.JOB_ID%TYPE,
    p_title HR_JOBS.JOB_TITLE%TYPE,
    p_minsal HR_JOBS.MIN_SALARY%TYPE
)
IS
    v_maxsal HR_JOBS.MAX_SALARY%TYPE := p_minsal *2;
BEGIN
    INSERT INTO hr_jobs (job_id, job_title, min_salary, max_salary)
        VALUES (p_jobid, p_title, p_minsal, v_maxsal);
        DBMS_OUTPUT.PUT_LINE('New row added to jobs table');
        COMMIT;
END new_job;
/