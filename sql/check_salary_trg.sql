CREATE OR REPLACE TRIGGER check_salary_trg
BEFORE INSERT OR UPDATE OF job_id, salary 
ON hr_employees
FOR EACH ROW
BEGIN
    DBMS_OUTPUT.PUT_LINE('TRIGGER WORKING');
    check_salary(:new.job_id, :new.salary);
END;
/