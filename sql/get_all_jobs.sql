CREATE OR REPLACE FUNCTION get_all_jobs RETURN SYS_REFCURSOR
IS
    v_cursor SYS_REFCURSOR;
BEGIN
    OPEN v_cursor FOR
        SELECT job_id, job_title, min_salary, max_salary 
        FROM hr_jobs;
    RETURN v_cursor;
EXCEPTION
    WHEN OTHERS THEN
        IF v_cursor%ISOPEN THEN
            CLOSE v_cursor;
        END IF;
        RAISE_APPLICATION_ERROR(-20001, 'Error retrieving jobs: ' || SQLERRM);
END get_all_jobs;
/