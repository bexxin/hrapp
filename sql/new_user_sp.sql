CREATE
OR REPLACE PROCEDURE new_user (
    p_username IN VARCHAR2,
    p_email IN VARCHAR2,
    p_password_hash IN VARCHAR2
) AS BEGIN
-- Insert the user into the HR_USERS table
INSERT INTO
    HR_USERS (USERNAME, EMAIL, PASSWORD_HASH, CREATED_AT)
VALUES
    (p_username, p_email, p_password_hash, SYSDATE);

COMMIT;

-- Commit the transaction
END new_user;

/