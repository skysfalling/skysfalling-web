# MySQL 8.4 Commands

Reference: Oracle Corporation. (2024). MySQL 8.4 Reference Manual. MySQL. https://dev.mysql.com/doc/refman/8.4/en/

[//]: # ( ============= USER  =============================================== )

## User

Reference: Oracle Corporation. (2024). User Account Management. MySQL Documentation. https://dev.mysql.com/doc/refman/8.4/en/user-account-management.html

<details>
<summary>Connection (https://dev.mysql.com/doc/refman/8.4/en/connecting-disconnecting.html)</summary>

```sql
-- Connect to MySQL with password prompt
mysql -u [username] -p

-- Connect to specific database
mysql -u [username] -p [database]
```

</details>

<details>
<summary>Management (https://dev.mysql.com/doc/refman/8.4/en/user-account-management.html)</summary>

```sql
-- Create new user
CREATE USER '[username]'@'[hostname]' IDENTIFIED BY '[password]';

-- Grant privileges
GRANT [privilege_type] ON [database].[table] TO '[username]'@'[hostname]';

-- Show user privileges
SHOW GRANTS FOR '[username]'@'[hostname]';
```

</details>

## Database

Reference: Oracle Corporation. (2024). Database Administration. MySQL Documentation. https://dev.mysql.com/doc/refman/8.4/en/database-administration.html

<details>
<summary>Management</summary>

```sql
-- Show all databases
SHOW DATABASES;

-- Create new database
CREATE DATABASE [IF NOT EXISTS] [database_name];

-- Select database
USE [database_name];

-- Delete database
DROP DATABASE [IF EXISTS] [database_name];
```

</details>

## Table Operations

Reference: Oracle Corporation. (2024). Table Maintenance Statements. MySQL Documentation. https://dev.mysql.com/doc/refman/8.4/en/table-maintenance-statements.html

<details>
<summary>Show (https://dev.mysql.com/doc/refman/8.4/en/show.html)</summary>

```sql
-- Show all tables
SHOW TABLES;

-- Show tables with pattern
SHOW TABLES LIKE '[pattern]';

-- Show table structure
DESCRIBE [table_name];

-- Show detailed table information
SHOW CREATE TABLE [table_name];
```

</details>

<details>
<summary>Create (https://dev.mysql.com/doc/refman/8.4/en/create-table.html)</summary>

```sql
-- Create new table
CREATE TABLE [IF NOT EXISTS] [table_name] (
    [column_name] [data_type] [constraints]
);
```

</details>

<details>
<summary>Alter (https://dev.mysql.com/doc/refman/8.4/en/alter-table.html)</summary>

```sql
-- Add column
ALTER TABLE [table_name] 
ADD COLUMN [column_name] [data_type] [constraints];

-- Modify column
ALTER TABLE [table_name]
MODIFY COLUMN [column_name] [new_datatype] [new_constraints];

-- Drop column
ALTER TABLE [table_name]
DROP COLUMN [column_name];

-- Rename table
RENAME TABLE [old_name] TO [new_name];
```

</details>

<details>
<summary>Select (https://dev.mysql.com/doc/refman/8.4/en/select.html)</summary>

```sql
-- Basic select
SELECT * FROM [table_name];

-- Select with conditions
SELECT [column1], [column2] FROM [table_name] 
WHERE [condition];

-- Select with sorting
SELECT * FROM [table_name]
ORDER BY [column_name] [ASC|DESC];

-- Select with limit
SELECT * FROM [table_name]
LIMIT [limit_number] OFFSET [offset_number];

-- Select distinct
SELECT DISTINCT [column_name] FROM [table_name];

-- Select with JOIN
SELECT [columns]
FROM [table1]
INNER JOIN [table2] ON [table1.column] = [table2.column];

-- Select with subquery
SELECT [columns]
FROM [table1]
WHERE [column] IN (SELECT [column] FROM [table2] WHERE [condition]);

-- Select with GROUP BY
SELECT [column], COUNT(*) as count
FROM [table_name]
GROUP BY [column]
HAVING count > [value];
```

</details>

<details>
<summary>Insert (https://dev.mysql.com/doc/refman/8.4/en/insert.html)</summary>

```sql
-- Insert single row
INSERT INTO [table_name] ([column1], [column2]) 
VALUES ([value1], [value2]);

-- Insert multiple rows
INSERT INTO [table_name] ([column1], [column2]) 
VALUES 
    ([value1], [value2]),
    ([value3], [value4]);

-- Insert with SELECT
INSERT INTO [target_table]
SELECT [columns] FROM [source_table] WHERE [condition];
```

</details>

<details>
<summary>Update (https://dev.mysql.com/doc/refman/8.4/en/update.html)</summary>

```sql
-- Update records
UPDATE [table_name]
SET [column1] = [value1]
WHERE [condition];
```

</details>

<details>
<summary>Delete (https://dev.mysql.com/doc/refman/8.4/en/delete.html)</summary>

```sql
-- Delete records
DELETE FROM [table_name]
WHERE [condition];

-- Delete with JOIN
DELETE t1 FROM [table1] t1
JOIN [table2] t2 ON t1.[column] = t2.[column]
WHERE [condition];
```

</details>

## Aggregate Functions

Reference: Oracle Corporation. (2024). Aggregate Functions. MySQL Documentation. https://dev.mysql.com/doc/refman/8.4/en/aggregate-functions.html

<details>
<summary>Count (https://dev.mysql.com/doc/refman/8.4/en/counting-rows.html)</summary>

```sql
-- Count rows
SELECT COUNT(*) FROM [table_name];
```

</details>

<details>
<summary>Sum (https://dev.mysql.com/doc/refman/8.4/en/aggregate-functions.html#function_sum)</summary>

```sql
-- Sum values
SELECT SUM([column_name]) FROM [table_name];
```

</details>

<details>
<summary>Average (https://dev.mysql.com/doc/refman/8.4/en/aggregate-functions.html#function_avg)</summary>

```sql
-- Average values
SELECT AVG([column_name]) FROM [table_name];
```

</details>

<details>
<summary>Group By (https://dev.mysql.com/doc/refman/8.4/en/group-by-modifiers.html)</summary>

```sql
-- Group by with having
SELECT [column1], COUNT(*)
FROM [table_name]
GROUP BY [column1]
HAVING COUNT(*) > [value];
```

</details>

## Advanced Features

Reference: Oracle Corporation. (2024). Functions and Operators. MySQL Documentation. https://dev.mysql.com/doc/refman/8.4/en/functions.html

<details>
<summary>Import/Export (https://dev.mysql.com/doc/refman/8.4/en/mysqlimport.html)</summary>

```sql
-- Import database
mysql -u [username] -p [database] < [filename].sql

-- Export database
mysqldump -u [username] -p [database] > [filename].sql
```

</details>

<details>
<summary>Indexes (https://dev.mysql.com/doc/refman/8.4/en/optimization-indexes.html)</summary>

```sql
-- Create index
CREATE INDEX [index_name] ON [table_name] ([column_name]);

-- Create unique index
CREATE UNIQUE INDEX [index_name] ON [table_name] ([column_name]);

-- Show indexes
SHOW INDEX FROM [table_name];
```

</details>

<details>
<summary>Views (https://dev.mysql.com/doc/refman/8.4/en/views.html)</summary>

```sql
-- Create view
CREATE VIEW [view_name] AS
SELECT [columns]
FROM [table_name]
WHERE [condition];

-- Drop view
DROP VIEW [IF EXISTS] [view_name];
```

</details>

<details>
<summary>Triggers (https://dev.mysql.com/doc/refman/8.4/en/triggers.html)</summary>

```sql
-- Create trigger
CREATE TRIGGER [trigger_name]
{BEFORE | AFTER} {INSERT | UPDATE| DELETE}
ON [table_name] FOR EACH ROW
[trigger_body];

-- Drop trigger
DROP TRIGGER [IF EXISTS] [trigger_name];
```

</details>

<details>
<summary>Stored Procedures (https://dev.mysql.com/doc/refman/8.4/en/stored-routines.html)</summary>

```sql
-- Create procedure
DELIMITER $$
CREATE PROCEDURE [procedure_name]([parameter_list])
BEGIN
    [body];
END $$
DELIMITER ;

-- Call procedure
CALL [procedure_name]([arguments]);

-- Drop procedure
DROP PROCEDURE [IF EXISTS] [procedure_name];
```

</details>

<details>
<summary>Functions (https://dev.mysql.com/doc/refman/8.4/en/functions.html)</summary>

```sql
-- Create function
DELIMITER $$
CREATE FUNCTION [function_name]([parameter_list])
RETURNS [datatype]
[NOT] DETERMINISTIC
BEGIN
    [statements]
END $$
DELIMITER ;
```

</details>

## Query Optimization

Reference: Oracle Corporation. (2024). EXPLAIN Output Format. MySQL Documentation. https://dev.mysql.com/doc/refman/8.4/en/explain-output.html

<details>
<summary>EXPLAIN (https://dev.mysql.com/doc/refman/8.4/en/explain.html)</summary>

```sql
-- Basic EXPLAIN
EXPLAIN SELECT * FROM [table_name] WHERE [condition];

-- EXPLAIN with FORMAT=JSON
EXPLAIN FORMAT=JSON
SELECT [columns]
FROM [table_name]
WHERE [condition];
```

</details>
