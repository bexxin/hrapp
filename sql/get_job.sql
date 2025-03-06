CREATE OR REPLACE FUNCTION get_job(p_job_id HR_JOBS.JOB_ID%TYPE) RETURN VARCHAR2
IS
    var_job_title HR_JOBS.JOB_TITLE%TYPE;
BEGIN
    SELECT job_title INTO var_job_title
    FROM hr_jobs
    WHERE job_id=p_job_id;
    RETURN var_job_title;
END get_job;
/