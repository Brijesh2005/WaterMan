-- Migration: Add password column to Users table
-- Date: November 27, 2025

ALTER TABLE Users ADD password VARCHAR2(255);

COMMIT;
