-- SQL*Plus display formatting script for neat column alignment in queries

-- Format ID columns
COLUMN id FORMAT 9999 HEADING 'ID'

-- Format NAME columns
COLUMN name FORMAT a20 HEADING 'NAME'

-- Format ADDRESS columns
COLUMN address FORMAT a30 HEADING 'ADDRESS'

-- Format PHONE columns
COLUMN phone FORMAT a15 HEADING 'PHONE'

-- Format EMAIL columns
COLUMN email FORMAT a30 HEADING 'EMAIL'

-- Format DATE columns
COLUMN created_at FORMAT a20 HEADING 'CREATED AT'
COLUMN updated_at FORMAT a20 HEADING 'UPDATED AT'
COLUMN date_of_birth FORMAT a20 HEADING 'DOB'

-- Format AMOUNT columns
COLUMN amount FORMAT $999,999.99 HEADING 'AMOUNT'

-- Format DESCRIPTION columns
COLUMN description FORMAT a40 HEADING 'DESCRIPTION'

-- Format STATUS columns
COLUMN status FORMAT a10 HEADING 'STATUS'

-- Format any other commonly used columns (adjust as needed)
COLUMN type FORMAT a15 HEADING 'TYPE'
COLUMN code FORMAT a10 HEADING 'CODE'

PROMPT SQL*Plus display formatting applied.
