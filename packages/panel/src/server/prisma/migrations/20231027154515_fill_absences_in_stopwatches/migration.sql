UPDATE "Stopwatch"
SET "state" = json_insert("state", '$.absences', json_array()) 
WHERE json_extract("state", '$.absences') IS NULL