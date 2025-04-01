CREATE
OR REPLACE PROCEDURE delete_user (p_user_id IN NUMBER) AS BEGIN
-- Delete the user from HR_USERS table
DELETE FROM HR_USERS
WHERE
    USER_ID = p_user_id;

COMMIT;

-- Commit the transaction
END delete_user;

/