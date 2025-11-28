-- Migration: Add role column to Users table
-- Date: [Current Date]

BEGIN
  EXECUTE IMMEDIATE 'ALTER TABLE Users ADD role VARCHAR2(20) DEFAULT ''user'' CHECK (role IN (''user'', ''admin''))';
  COMMIT;
  DBMS_OUTPUT.PUT_LINE('Role column added to Users table successfully');
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE = -1430 THEN
      DBMS_OUTPUT.PUT_LINE('Role column already exists');
    ELSE
      RAISE;
    END IF;
END;
/

-- Update existing users to have 'user' role (if not already set)
BEGIN
  UPDATE Users SET role = 'user' WHERE role IS NULL;
  COMMIT;
  DBMS_OUTPUT.PUT_LINE('Existing users updated with default role');
EXCEPTION
  WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error updating existing users: ' || SQLERRM);
END;
/

-- Insert a sample admin user (optional, for testing)
BEGIN
  INSERT INTO Users (name, email, phone, address, role)
  VALUES ('Admin User', 'admin@example.com', '123-456-7890', 'Admin Address', 'admin');
  COMMIT;
  DBMS_OUTPUT.PUT_LINE('Sample admin user inserted');
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE = -1 THEN
      DBMS_OUTPUT.PUT_LINE('Admin user already exists');
    ELSE
      RAISE;
    END IF;
END;
/

COMMIT;
