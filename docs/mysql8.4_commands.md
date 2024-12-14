# MySQL 8.4 Commands

Reference: Oracle Corporation. (2024). MySQL 8.4 Reference Manual. MySQL. 
https://dev.mysql.com/doc/refman/8.4/en/

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

[//]: # ( ============= USER  =============================================== )

## User
<details>
<summary>
    <a href="https://dev.mysql.com/doc/refman/8.4/en/connecting-disconnecting.html">
        Connection
    </a>
</summary>

```sql
-- Connect to MySQL with password prompt
-- >>>> mysql -u root -p
mysql -u [username] -p

-- Connect to specific database
-- >>>> mysql -u root -p mydatabase
mysql -u [username] -p [database]
```

</details>

<details>
<summary>
    <a href="https://dev.mysql.com/doc/refman/8.4/en/user-account-management.html">
        Management
    </a>
</summary>

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

## Table Operations

https://dev.mysql.com/doc/refman/8.4/en/table-maintenance-statements.html

<details>
<summary>
    <a href="https://dev.mysql.com/doc/refman/8.4/en/show.html">
        Show
    </a>
</summary>

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
<summary>
    <a href="https://dev.mysql.com/doc/refman/8.4/en/create-table.html">
        Create
    </a>
</summary>

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
<summary>
    <a href="https://dev.mysql.com/doc/refman/8.4/en/alter-table.html">
        Alter
    </a>
</summary>

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
    <summary>
    <a href="https://dev.mysql.com/doc/refman/8.4/en/select.html">
        Select
    </a>
</summary>

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

-- Select with multiple JOINs
SELECT c.name, o.order_id, p.product_name
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id
INNER JOIN products p ON o.product_id = p.id
WHERE o.order_date >= '2024-01-01';

-- Select with subqueries
SELECT username, (SELECT COUNT(*) FROM orders WHERE orders.user_id = users.id) as order_count
FROM users;

-- Select with GROUP BY and HAVING
SELECT category, COUNT(*) as count, AVG(price) as avg_price
FROM products
GROUP BY category
HAVING count > 10;

-- Basic CTE example
WITH user_orders AS (
    SELECT user_id, COUNT(*) as order_count
    FROM orders
    GROUP BY user_id
)
SELECT u.username, COALESCE(uo.order_count, 0) as orders
FROM users u
LEFT JOIN user_orders uo ON u.id = uo.user_id;

-- Row number example
SELECT product_name, category, price,
       ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) as price_rank
FROM products;

-- Moving average example
SELECT date, amount,
       AVG(amount) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as moving_avg
FROM daily_sales;
```

</details>

[//]: # ( INSERT  -------------------------------- )

<details>
<summary>
    <a href="https://dev.mysql.com/doc/refman/8.4/en/insert.html">
        Insert
    </a>
</summary>

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
<summary>
    <a href="https://dev.mysql.com/doc/refman/8.4/en/update.html">
        Update
    </a>
</summary>

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
<summary>
    <a href="https://dev.mysql.com/doc/refman/8.4/en/delete.html">
        Delete
    </a>
</summary>

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

[//]: # ( ============= AGGREGATE FUNCTIONS =============================================== )

<h4><a href="https://dev.mysql.com/doc/refman/8.4/en/aggregate-functions.html">Aggregate Functions</a></h4>

<details>
<summary>
    <a href="https://dev.mysql.com/doc/refman/8.4/en/join.html">
        Join
    </a>
</summary>
</summary>

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


<details>
<summary>
    <a href="https://dev.mysql.com/doc/refman/8.4/en/counting-rows.html">
        Count
    </a>
</summary>

```sql
-- Count rows
-- >>>> SELECT COUNT(*) FROM table_name;
SELECT COUNT(*) FROM [table_name];
```

</details>

<details>
<summary>
    <a href="https://dev.mysql.com/doc/refman/8.4/en/aggregate-functions.html#function_sum">
        Sum
    </a>
</summary>

```sql
-- Sum values
-- >>>> SELECT SUM(column_name) FROM table_name;
SELECT SUM([column_name]) FROM [table_name];
```

</details>

<details>
<summary>
    <a href="https://dev.mysql.com/doc/refman/8.4/en/aggregate-functions.html#function_avg">
        Average
    </a>
</summary>

```sql
-- Average values
-- >>>> SELECT AVG(column_name) FROM table_name;
SELECT AVG([column_name]) FROM [table_name];
```

</details>

<details>
<summary>
    <a href="https://dev.mysql.com/doc/refman/8.4/en/group-by-modifiers.html">
        Group By
    </a>
</summary>

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

<h4><a href="https://dev.mysql.com/doc/refman/8.4/en/mysqlimport.html">Advanced Features</a></h4>

<details>
<summary>
    <a href="https://dev.mysql.com/doc/refman/8.4/en/mysqlimport.html">
        Import/Export
    </a>
</summary>

```sql
-- Import database
-- >>>> mysql -u root -p mydb < backup_2024.sql
mysql -u [username] -p [database] < [filename].sql

-- Export database backup
-- >>>> mysqldump -u root -p mydb > backup_2024.sql
mysqldump -u [username] -p [database] > [filename].sql
```

</details>

[//]: # ( Indexes  -------------------------------- )

<details>
<summary>
    <a href="https://dev.mysql.com/doc/refman/8.4/en/optimization-indexes.html">
        Indexes
    </a>
</summary>

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

-- Create composite index
CREATE INDEX idx_name_email ON users(name, email);

-- Create fulltext index
CREATE FULLTEXT INDEX idx_description ON products(description);

-- Create spatial index
CREATE SPATIAL INDEX idx_location ON stores(location);
```

</details>

[//]: # ( Views  -------------------------------- )

<details>
<summary>
    <a href="https://dev.mysql.com/doc/refman/8.4/en/views.html">
        Views
    </a>
</summary>

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
<summary>
    <a href="https://dev.mysql.com/doc/refman/8.4/en/triggers.html">
        Triggers
    </a>
</summary>

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
<summary>
    <a href="https://dev.mysql.com/doc/refman/8.4/en/stored-routines.html">
        Stored Procedures
    </a>
</summary>

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
<summary>
    <a href="https://dev.mysql.com/doc/refman/8.4/en/functions.html">
        Functions
    </a>
</summary>

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

<details>
<summary>
    <a href="https://dev.mysql.com/doc/refman/8.4/en/explain-output.html">
        Explain
    </a>
</summary>

```sql
-- Basic EXPLAIN
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- EXPLAIN with FORMAT=JSON
EXPLAIN FORMAT=JSON
SELECT u.*, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;
```

</details>
