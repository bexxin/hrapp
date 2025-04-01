CREATE
OR REPLACE PROCEDURE update_user (
    p_user_id IN NUMBER,
    p_username IN VARCHAR2,
    p_email IN VARCHAR2
) AS BEGIN
UPDATE HR_USERS
SET
    USERNAME = p_username,
    EMAIL = p_email
WHERE
    USER_ID = p_user_id;

COMMIT;

END update_user;

/