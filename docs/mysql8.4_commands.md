# MySQL 8.4 Commands

<span style="font-size: 0.75em">
Reference: Oracle Corporation. (2024). MySQL 8.4 Reference Manual. MySQL. <br> 
<a href="https://dev.mysql.com/doc/refman/8.4/en/">https://dev.mysql.com/doc/refman/8.4/en/</a></span>

[//]: # ( ============= USER  =============================================== )


<h2 style="margin-bottom: -10px;">User</h2>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/user-account-management.html">
    https://dev.mysql.com/doc/refman/8.4/en/user-account-management.html
    </a>
</span>

<details style="margin-left: 25px;">
<summary>Connection</summary>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/connecting-disconnecting.html">
    https://dev.mysql.com/doc/refman/8.4/en/connecting-disconnecting.html
    </a>
</span>

```sql
-- Connect to MySQL with password prompt
-- >>>> mysql -u root -p
mysql -u [username] -p

-- Connect to specific database
-- >>>> mysql -u root -p mydatabase
mysql -u [username] -p [database]
```

</details>


<details style="margin-left: 25px;">
<summary>Management</summary>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/user-account-management.html">
    https://dev.mysql.com/doc/refman/8.4/en/user-account-management.html
    </a>
</span>

```sql
-- Create new user
-- >>>> CREATE USER 'john'@'localhost' IDENTIFIED BY 'password123';
CREATE USER '[username]'@'[hostname]' IDENTIFIED BY '[password]';

-- Grant privileges
-- >>>> GRANT ALL PRIVILEGES ON mydb.* TO 'john'@'localhost';
GRANT [privilege_type] ON [database].[table] TO '[username]'@'[hostname]';

-- Show user privileges
-- >>>> SHOW GRANTS FOR 'john'@'localhost';
SHOW GRANTS FOR '[username]'@'[hostname]';
```

</details>

[//]: # ( ============= DATABASE =============================================== )

<h2 style="margin-top: 25px; margin-bottom: -10px;">Database</h2>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/database-administration.html">
    https://dev.mysql.com/doc/refman/8.4/en/database-administration.html
    </a>
</span>

<details style="margin-left: 25px;">
<summary>Management</summary>

```sql
-- Show all databases
SHOW DATABASES;

-- Create new database
-- >>>> CREATE DATABASE my_shop;
CREATE DATABASE [IF NOT EXISTS] [database_name];

-- Select database
-- >>>> USE my_shop;
USE [database_name];

-- Delete database
-- >>>> DROP DATABASE old_shop;
DROP DATABASE [IF EXISTS] [database_name];
```

</details>

[//]: # ( ============= TABLE =============================================== )

<h2 style="margin-top: 25px; margin-bottom: -10px;">Table</h2>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/table-maintenance-statements.html">
    https://dev.mysql.com/doc/refman/8.4/en/table-maintenance-statements.html
    </a>
</span>

[//]: # ( SHOW  -------------------------------- )

<div style="margin: 0 0 0 25px;">
<details>
<summary>Show</summary>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/show.html">
    https://dev.mysql.com/doc/refman/8.4/en/show.html
    </a>
</span>

```sql
-- Show all tables
-- >>>> SHOW TABLES;
SHOW TABLES;

-- Show tables with pattern
-- >>>> SHOW TABLES LIKE 'user%';
SHOW TABLES LIKE '[pattern]';

-- Show table structure
-- >>>> DESCRIBE users;
DESCRIBE [table_name];

-- Show detailed table information
-- >>>> SHOW CREATE TABLE users;
SHOW CREATE TABLE [table_name];
```

</details>

<details>
<summary>Create</summary>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/create-table.html">
    https://dev.mysql.com/doc/refman/8.4/en/create-table.html
    </a>
</span>

```sql
-- Create new table
-- >>>> CREATE TABLE users (
-- >>>>     id INT PRIMARY KEY AUTO_INCREMENT,
-- >>>>     username VARCHAR(50) NOT NULL,
-- >>>>     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- >>>> );
CREATE TABLE [IF NOT EXISTS] [table_name] (
    [column_name] [data_type] [constraints]
);
```

</details>

[//]: # ( ALTER  -------------------------------- )
<details>
<summary>Alter</summary>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/alter-table.html">
    https://dev.mysql.com/doc/refman/8.4/en/alter-table.html
    </a>
</span>

```sql
-- Add column to table
-- >>>> ALTER TABLE users ADD COLUMN email VARCHAR(100);
ALTER TABLE [table_name] 
ADD COLUMN [column_name] [data_type] [constraints];

-- Modify column
-- >>>> ALTER TABLE users MODIFY COLUMN email VARCHAR(150) NOT NULL;
ALTER TABLE [table_name]
MODIFY COLUMN [column_name] [new_datatype] [new_constraints];

-- Drop column from table
-- >>>> ALTER TABLE users DROP COLUMN email;
ALTER TABLE [table_name]
DROP COLUMN [column_name];

-- Rename table
-- >>>> RENAME TABLE users TO customers;
RENAME TABLE [old_name] TO [new_name];
```

</details>

[//]: # ( SELECT  -------------------------------- )

<details>
<summary>Select</summary>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/select.html">
    https://dev.mysql.com/doc/refman/8.4/en/select.html
    </a>
</span>

```sql
-- Select all records
-- >>>> SELECT * FROM users;
SELECT * FROM [table_name];

-- Select specific columns
-- >>>> SELECT username, email FROM users WHERE age >= 18;
SELECT [column1], [column2] FROM [table_name] 
WHERE [condition];

-- Select with sorting
-- >>>> SELECT * FROM users ORDER BY username DESC;
SELECT * FROM [table_name]
ORDER BY [column_name] [ASC|DESC];

-- Select with limit and offset
-- >>>> SELECT * FROM users LIMIT 10 OFFSET 20;
SELECT * FROM [table_name]
LIMIT [limit_number] OFFSET [offset_number];

-- Select distinct values
-- >>>> SELECT DISTINCT status FROM users;
SELECT DISTINCT [column_name] FROM [table_name];
```

</details>

[//]: # ( INSERT  -------------------------------- )

<details>
<summary>Insert</summary>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/insert.html">
    https://dev.mysql.com/doc/refman/8.4/en/insert.html
    </a>
</span>

```sql
-- Insert single row
-- >>>> INSERT INTO users (username, email) VALUES ('john', 'john@email.com');
INSERT INTO [table_name] ([column1], [column2]) 
VALUES ([value1], [value2]);

-- Insert multiple rows
-- >>>> INSERT INTO users (username, email) 
-- >>>> VALUES ('john', 'john@email.com'), ('jane', 'jane@email.com');
INSERT INTO [table_name] ([column1], [column2]) 
VALUES 
    ([value1], [value2]),
    ([value3], [value4]);

-- Insert with SELECT
-- >>>> INSERT INTO backup_users SELECT * FROM users WHERE active = 1;
INSERT INTO [target_table]
SELECT [columns] FROM [source_table] WHERE [condition];
```

</details>

[//]: # ( UPDATE  -------------------------------- )

<details>
<summary>Update</summary>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/update.html">
    https://dev.mysql.com/doc/refman/8.4/en/update.html
    </a>
</span>

```sql
-- Update records
-- >>>> UPDATE users SET status = 'active' WHERE id = 1;
UPDATE [table_name]
SET [column1] = [value1]
WHERE [condition];
```

</details>

[//]: # ( DELETE  -------------------------------- )

<details>
<summary>Delete</summary>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/delete.html">
    https://dev.mysql.com/doc/refman/8.4/en/delete.html
    </a>
</span>

```sql
-- Delete records
-- >>>> DELETE FROM users WHERE status = 'inactive';
DELETE FROM [table_name]
WHERE [condition];

-- Delete specific records
-- >>>> DELETE FROM users WHERE status = 'inactive';
DELETE FROM [table_name]
WHERE [condition];

-- Delete with JOIN
-- >>>> DELETE u FROM users u
-- >>>> JOIN inactive_accounts ia ON u.id = ia.user_id;
DELETE t1 FROM [table1] t1
JOIN [table2] t2 ON t1.[column] = t2.[column]
WHERE [condition];
```

</details>

[//]: # ( TRUNCATE  -------------------------------- )

<details>
<summary>Truncate</summary>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/truncate-table.html">
    https://dev.mysql.com/doc/refman/8.4/en/truncate-table.html
    </a>
</span>

```sql
-- Truncate table (delete all records)
-- >>>> TRUNCATE TABLE temp_users;
TRUNCATE TABLE [table_name];
```

</details>

[//]: # ( JOIN  -------------------------------- )

<details>
<summary>Join</summary>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/join.html">
    https://dev.mysql.com/doc/refman/8.4/en/join.html
    </a>
</span>

```sql
-- Inner Join
-- >>>> SELECT users.name, orders.order_date 
-- >>>> FROM users 
-- >>>> INNER JOIN orders ON users.id = orders.user_id;
SELECT [columns]
FROM [table1]
INNER JOIN [table2] 
ON [table1.column] = [table2.column];

-- Left Join
-- >>>> SELECT customers.name, orders.order_id 
-- >>>> FROM customers 
-- >>>> LEFT JOIN orders ON customers.id = orders.customer_id;
SELECT [columns]
FROM [table1]
LEFT JOIN [table2] 
ON [table1.column] = [table2.column];
```

</details>
</div>

[//]: # ( ============= AGGREGATE FUNCTIONS =============================================== )

<h2 style="margin-top: 25px; margin-bottom: -10px;">Aggregate Functions</h2>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/aggregate-functions.html">
    https://dev.mysql.com/doc/refman/8.4/en/aggregate-functions.html
    </a>
</span>

<div style="margin: 0 0 0 25px;">

<details>
<summary>Count</summary>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/counting-rows.html">
    https://dev.mysql.com/doc/refman/8.4/en/counting-rows.html
    </a>
</span>

```sql
-- Count rows
-- >>>> SELECT COUNT(*) FROM table_name;
SELECT COUNT(*) FROM [table_name];
```

</details>


<details>
<summary>Sum</summary>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/aggregate-functions.html#function_sum">
    https://dev.mysql.com/doc/refman/8.4/en/aggregate-functions.html#function_sum
    </a>
</span>

```sql
-- Sum values
-- >>>> SELECT SUM(column_name) FROM table_name;
SELECT SUM([column_name]) FROM [table_name];
```

</details>

<details>
<summary>Average</summary>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/aggregate-functions.html#function_avg">
    https://dev.mysql.com/doc/refman/8.4/en/aggregate-functions.html#function_avg
    </a>
</span>

```sql
-- Average values
-- >>>> SELECT AVG(column_name) FROM table_name;
SELECT AVG([column_name]) FROM [table_name];
```

</details>

<details>
<summary>Group By</summary>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/group-by-modifiers.html">
    https://dev.mysql.com/doc/refman/8.4/en/group-by-modifiers.html
    </a>
</span>

```sql
-- Group by with having
-- >>>> SELECT column1, COUNT(*)
-- >>>> FROM table_name
-- >>>> GROUP BY column1
-- >>>> HAVING COUNT(*) > value;
SELECT [column1], COUNT(*)
FROM [table_name]
GROUP BY [column1]
HAVING COUNT(*) > [value];
```

</details>

</div>

[//]: # ( ============= ADVANCED =============================================== )

<h2 style="margin-top: 25px; margin-bottom: -10px;">Advanced</h2>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/functions.html">
    https://dev.mysql.com/doc/refman/8.4/en/functions.html
    </a>
</span>

<div style="margin: 0 0 0 25px;">

[//]: # ( Import  -------------------------------- )
<details>
<summary>Import</summary>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/mysqlimport.html">
    https://dev.mysql.com/doc/refman/8.4/en/mysqlimport.html
    </a>
</span>

```sql
-- Import database
-- >>>> mysql -u root -p mydb < backup_2024.sql
mysql -u [username] -p [database] < [filename].sql
```

</details>

[//]: # ( Export  -------------------------------- )
<details>
<summary>Export</summary>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/mysqldump.html">
    https://dev.mysql.com/doc/refman/8.4/en/mysqldump.html
    </a>
</span>

```sql
-- Export database backup
-- >>>> mysqldump -u root -p mydb > backup_2024.sql
mysqldump -u [username] -p [database] > [filename].sql
```

</details>

[//]: # ( Indexes  -------------------------------- )

<details>
<summary>Indexes</summary>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/optimization-indexes.html">
    https://dev.mysql.com/doc/refman/8.4/en/optimization-indexes.html
    </a>
</span>

```sql
-- Create index
-- >>>> CREATE INDEX idx_username ON users(username);
CREATE INDEX [index_name]
ON [table_name] ([column_name]);

-- Create unique index
-- >>>> CREATE UNIQUE INDEX idx_email ON users(email);
CREATE UNIQUE INDEX [index_name]
ON [table_name] ([column_name]);

-- Show indexes
-- >>>> SHOW INDEX FROM users;
SHOW INDEX FROM [table_name];
```

</details>

[//]: # ( Views  -------------------------------- )

<details>
<summary>Views</summary>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/views.html">
    https://dev.mysql.com/doc/refman/8.4/en/views.html
    </a>
</span>

```sql
-- Create view
-- >>>> CREATE VIEW view_name AS
-- >>>> SELECT column1, column2
-- >>>> FROM table_name
-- >>>> WHERE condition;
CREATE VIEW [view_name] AS
SELECT [column1], [column2]
FROM [table_name]
WHERE [condition];

-- Drop view
-- >>>> DROP VIEW [IF EXISTS] view_name;
DROP VIEW [IF EXISTS] [view_name];
```

</details>

<details>
<summary>Triggers</summary>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/triggers.html">
    https://dev.mysql.com/doc/refman/8.4/en/triggers.html
    </a>
</span>

```sql
-- Create new trigger
-- >>>> CREATE TRIGGER after_order_insert 
-- >>>>     AFTER INSERT ON orders 
-- >>>>     FOR EACH ROW 
-- >>>>     UPDATE inventory SET quantity = quantity - NEW.quantity 
-- >>>>     WHERE product_id = NEW.product_id;
CREATE TRIGGER [trigger_name]
{BEFORE | AFTER} {INSERT | UPDATE| DELETE }
ON [table_name] FOR EACH ROW
[trigger_body];

-- Drop trigger
-- >>>> DROP TRIGGER IF EXISTS after_order_insert;
DROP TRIGGER [IF EXISTS] [trigger_name];

-- Show triggers
-- >>>> SHOW TRIGGERS FROM my_database;
SHOW TRIGGERS 
[{FROM | IN} database_name]
[LIKE 'pattern' | WHERE search_condition];
```

</details>

<details>
<summary>Stored Procedures</summary>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/stored-routines.html">
    https://dev.mysql.com/doc/refman/8.4/en/stored-routines.html
    </a>
</span>

```sql
-- Create stored procedure
-- >>>> DELIMITER //
-- >>>> CREATE PROCEDURE GetAllCustomers()
-- >>>> BEGIN
-- >>>>    SELECT * FROM customers;
-- >>>> END //
-- >>>> DELIMITER ;
DELIMITER $$
CREATE PROCEDURE [procedure_name]([parameter_list])
BEGIN
   [body];
END $$
DELIMITER ;

-- Call stored procedure
-- >>>> CALL GetAllCustomers();
CALL [procedure_name]([arguments]);

-- Drop stored procedure
-- >>>> DROP PROCEDURE IF EXISTS GetAllCustomers;
DROP PROCEDURE [IF EXISTS] [procedure_name];
```

</details>

<details>
<summary>Functions</summary>
<span style="font-size: 0.75em; margin-left: 10px;">
    <a href="https://dev.mysql.com/doc/refman/8.4/en/functions.html">
    https://dev.mysql.com/doc/refman/8.4/en/functions.html
    </a>
</span>

```sql
-- Create function
-- >>>> DELIMITER //
-- >>>> CREATE FUNCTION CustomerLevel(credit DECIMAL(10,2)) 
-- >>>>     RETURNS VARCHAR(20)
-- >>>>     DETERMINISTIC
-- >>>> BEGIN
-- >>>>    DECLARE customerLevel VARCHAR(20);
-- >>>>    IF credit > 50000 THEN SET customerLevel = 'PLATINUM';
-- >>>>    ELSEIF credit <= 50000 AND credit > 10000 THEN SET customerLevel = 'GOLD';
-- >>>>    ELSE SET customerLevel = 'SILVER';
-- >>>>    END IF;
-- >>>>    RETURN customerLevel;
-- >>>> END //
-- >>>> DELIMITER ;
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
</div>
