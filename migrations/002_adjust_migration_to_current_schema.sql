-- Revised migration script aligned to current database schema columns

-- Check if you want to drop NAME column from WATERSOURCES (currently present)
-- If yes, uncomment following line
-- ALTER TABLE WaterSources DROP COLUMN NAME;

-- USERS table: ID column present, no action needed on id

-- WATERMETERS table: ID column present, no action needed on id

-- CONSUMPTIONRECORDS: column WATER_METER_ID present; FK should reference WATERMETERS.ID

-- ALERTS: column ALERT_TYPE instead of TYPE; FK on USER_ID intact

-- BILLING: columns AMOUNT, DUE_DATE, PAYMENT_STATUS, DATE_CREATED (different schema than before)

-- Foreign key constraints adjustments

-- Drop existing foreign keys if any before re-adding (adjust constraint names as per your schema)
-- ALTER TABLE WaterMeters DROP CONSTRAINT fk_water_meters_user_id;
-- ALTER TABLE WaterSources DROP CONSTRAINT fk_water_sources_user_id;
-- ALTER TABLE ConsumptionRecords DROP CONSTRAINT fk_consumption_user_id;
-- ALTER TABLE ConsumptionRecords DROP CONSTRAINT fk_consumption_water_meter;
-- ALTER TABLE Alerts DROP CONSTRAINT fk_alerts_user_id;
-- ALTER TABLE Billing DROP CONSTRAINT fk_billing_user_id;

-- Create or re-create foreign keys accordingly
ALTER TABLE WaterMeters ADD CONSTRAINT fk_water_meters_user_id FOREIGN KEY (USER_ID) REFERENCES Users(ID) ON DELETE CASCADE;
ALTER TABLE WaterSources ADD CONSTRAINT fk_water_sources_user_id FOREIGN KEY (USER_ID) REFERENCES Users(ID) ON DELETE CASCADE;
ALTER TABLE ConsumptionRecords ADD CONSTRAINT fk_consumption_user_id FOREIGN KEY (USER_ID) REFERENCES Users(ID) ON DELETE CASCADE;
ALTER TABLE ConsumptionRecords ADD CONSTRAINT fk_consumption_water_meter FOREIGN KEY (WATER_METER_ID) REFERENCES WaterMeters(ID) ON DELETE CASCADE;
ALTER TABLE Alerts ADD CONSTRAINT fk_alerts_user_id FOREIGN KEY (USER_ID) REFERENCES Users(ID) ON DELETE CASCADE;
ALTER TABLE Billing ADD CONSTRAINT fk_billing_user_id FOREIGN KEY (USER_ID) REFERENCES Users(ID) ON DELETE CASCADE;

-- Note:
-- Primary key changes or id column dropping skipped due to existing ID columns.
-- If you want to remove ID columns from USERS or WATERMETERS, more refactoring required.
-- Adjust constraint names in the queries above to fit your database if different.
