# Task: Add user_id filtering and user selection UI for related data tables

## Backend Changes:
- Update routes/waterMeters.js:
  - Fix column names in SQL (MeterID -> id, UserID -> user_id)
  - Add user_id filtering on GET water meters endpoint
- Update routes/consumptionRecords.js:
  - Add user_id filtering on GET consumption records endpoint
- Update routes/alerts.js:
  - Fix column names in SQL (AlertID -> id, UserID -> user_id, Type -> type, Description -> description, DateIssued -> date_issued, Status -> status)
  - Add user_id filtering on GET alerts endpoint
- Update routes/billing.js:
  - Fix column names in SQL (BillID -> id, UserID -> user_id, PeriodStart -> period_start, PeriodEnd -> period_end, TotalUsage -> total_usage, AmountDue -> amount_due, PaymentStatus -> payment_status)
  - Add user_id filtering on GET billing records endpoint

## Frontend Changes:
- Modify client/src/components/WaterMeters.js:
  - Add user selector dropdown to select user
  - Filter water meter data by selected user
- Modify client/src/components/ConsumptionRecords.js:
  - Add user selector dropdown
  - Filter consumption records by selected user
- Modify client/src/components/Alerts.js:
  - Add user selector dropdown
  - Filter alerts by selected user
- Modify client/src/components/Billing.js:
  - Add user selector dropdown
  - Filter billing records by selected user

## Supporting Changes:
- Ensure client/src/components/Users.js provides a user list for dropdowns
- Adjust API calls in frontend to pass selected user_id as filter query parameter

## Testing
- Verify all GET endpoints correctly filter by user_id
- Verify UI allows selecting user and displays filtered data accordingly

---
Steps will be done incrementally following the above plan.
