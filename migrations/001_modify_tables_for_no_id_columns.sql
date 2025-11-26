-- Migration: Remove id columns and adjust keys for affected tables

-- Drop foreign keys referencing id columns first (modify constraint names accordingly)
ALTER TABLE ConsumptionRecords DROP CONSTRAINT fk_consumption_water_meter_id;
ALTER TABLE WaterSources DROP CONSTRAINT fk_water_sources_user_id;
ALTER TABLE WaterMeters DROP CONSTRAINT fk_water_meters_user_id;
ALTER TABLE ConsumptionRecords DROP CONSTRAINT fk_consumption_user_id;
ALTER TABLE Alerts DROP CONSTRAINT fk_alerts_user_id;
ALTER TABLE Billing DROP CONSTRAINT fk_billing_user_id;

-- WaterMeters: Drop id column and change primary key to meter_number; add location column if missing
ALTER TABLE WaterMeters DROP COLUMN id;
-- Assuming meter_number is primary key already, otherwise add:
-- ALTER TABLE WaterMeters ADD CONSTRAINT pk_water_meters PRIMARY KEY (meter_number);
-- Add location column if not exists
ALTER TABLE WaterMeters ADD location VARCHAR2(255);

-- WaterSources: Drop id column and use composite primary key
ALTER TABLE WaterSources DROP COLUMN id;
ALTER TABLE WaterSources ADD CONSTRAINT pk_water_sources PRIMARY KEY (user_id, type, location);

-- ConsumptionRecords: Drop id column and use composite primary key
ALTER TABLE ConsumptionRecords DROP COLUMN id;
ALTER TABLE ConsumptionRecords ADD CONSTRAINT pk_consumption_records PRIMARY KEY (user_id, water_meter_number, consumption_date);

-- Alerts: Drop id column and use composite primary key
ALTER TABLE Alerts DROP COLUMN id;
ALTER TABLE Alerts ADD CONSTRAINT pk_alerts PRIMARY KEY (user_id, date_issued);

-- Billing: Drop id column and use composite primary key
ALTER TABLE Billing DROP COLUMN id;
ALTER TABLE Billing ADD CONSTRAINT pk_billing PRIMARY KEY (user_id, period_start, period_end);

-- Recreate foreign keys pointing to the updated keys
ALTER TABLE WaterMeters ADD CONSTRAINT fk_water_meters_user_id FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE;
ALTER TABLE WaterSources ADD CONSTRAINT fk_water_sources_user_id FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE;
ALTER TABLE ConsumptionRecords ADD CONSTRAINT fk_consumption_user_id FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE;
ALTER TABLE ConsumptionRecords ADD CONSTRAINT fk_consumption_water_meter FOREIGN KEY (water_meter_number) REFERENCES WaterMeters(meter_number) ON DELETE CASCADE;
ALTER TABLE Alerts ADD CONSTRAINT fk_alerts_user_id FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE;
ALTER TABLE Billing ADD CONSTRAINT fk_billing_user_id FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE;

-- Notes:
-- Adjust constraint names as per your current database schema.
-- Backup data before applying migrations.
