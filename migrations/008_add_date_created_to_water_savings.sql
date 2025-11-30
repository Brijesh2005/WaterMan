-- Migration: Add date_created column to WaterSavings table
-- Date: [Current Date]

BEGIN
  EXECUTE IMMEDIATE 'ALTER TABLE WaterSavings ADD date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP';
  DBMS_OUTPUT.PUT_LINE('date_created column added to WaterSavings table');
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE = -1430 THEN
      DBMS_OUTPUT.PUT_LINE('date_created column already exists');
    ELSE
      RAISE;
    END IF;
END;
/
