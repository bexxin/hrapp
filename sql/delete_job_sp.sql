CREATE OR REPLACE PROCEDURE delete_job(p_job_id HR_JOBS.JOB_ID%TYPE)
IS
BEGIN
    DELETE FROM hr_jobs WHERE job_id = p_job_id;

    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20002, 'No job found with this ID.');
    END IF;

    COMMIT;
END delete_job;
/
