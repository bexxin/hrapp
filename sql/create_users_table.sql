CREATE
OR REPLACE PROCEDURE create_users_table_sp IS table_count NUMBER;

BEGIN
-- Check if the USERS table exists
SELECT
    COUNT(*) INTO table_count
FROM
    user_tables
WHERE
    table_name = 'HR_USERS';

IF table_count = 0 THEN
-- Create the USERS table
EXECUTE IMMEDIATE '
            CREATE TABLE HR_USERS (
                user_id NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY PRIMARY KEY,
                username VARCHAR2(255) UNIQUE NOT NULL,
                email VARCHAR2(255) UNIQUE NOT NULL,
                password_hash VARCHAR2(255) NOT NULL,
                created_at DATE DEFAULT SYSDATE NOT NULL
            )
        ';

-- Commit the changes after table creation
COMMIT;

DBMS_OUTPUT.PUT_LINE ('Table HR_USERS created successfully.');

ELSE DBMS_OUTPUT.PUT_LINE ('Table HR_USERS already exists.');

END IF;

END create_users_table_sp;

/