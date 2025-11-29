-- Migration: Add water_saved column to WaterSavings table
-- Date: [Current Date]

BEGIN
  EXECUTE IMMEDIATE 'ALTER TABLE WaterSavings ADD water_saved NUMBER(10,2) DEFAULT 0';
  DBMS_OUTPUT.PUT_LINE('water_saved column added to WaterSavings table');
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE = -1430 THEN
      DBMS_OUTPUT.PUT_LINE('water_saved column already exists');
    ELSE
      RAISE;
    END IF;
END;
/

COMMIT;
