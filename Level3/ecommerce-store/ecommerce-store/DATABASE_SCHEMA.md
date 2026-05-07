# Database Schema Documentation

## Overview

The E-Commerce application uses MySQL database with 5 main tables to manage users, products, categories, orders, and order items.

## Database Name
`ecommerce_db`

## Tables

### 1. users
Stores customer and user information.

| Column      | Type          | Constraints                    | Description                |
|-------------|---------------|--------------------------------|----------------------------|
| id          | BIGINT        | PRIMARY KEY, AUTO_INCREMENT    | Unique user identifier     |
| name        | VARCHAR(255)  | NOT NULL                       | User's full name           |
| email       | VARCHAR(255)  | NOT NULL, UNIQUE               | User's email (login)       |
| password    | VARCHAR(255)  | NOT NULL                       | User's password            |
| phone       | VARCHAR(255)  |                                | Contact phone number       |
| address     | VARCHAR(500)  |                                | Shipping/billing address   |
| created_at  | TIMESTAMP     |                                | Account creation date      |

**Indexes:**
- PRIMARY KEY (id)
- UNIQUE INDEX (email)

**Sample Data:**
```sql
INSERT INTO users (name, email, password, phone, address) 
VALUES ('John Doe', 'john@example.com', 'password123', '1234567890', '123 Main St, City, State');
```

---

### 2. categories
Product categories for organization and filtering.

| Column      | Type          | Constraints                    | Description                |
|-------------|---------------|--------------------------------|----------------------------|
| id          | BIGINT        | PRIMARY KEY, AUTO_INCREMENT    | Unique category ID         |
| name        | VARCHAR(255)  | NOT NULL, UNIQUE               | Category name              |
| description | VARCHAR(255)  |                                | Category description       |
| icon        | VARCHAR(255)  |                                | Font Awesome icon class    |

**Indexes:**
- PRIMARY KEY (id)
- UNIQUE INDEX (name)

**Sample Data:**
```sql
INSERT INTO categories (name, description, icon) VALUES
('Electronics', 'Electronic devices and gadgets', 'fa-laptop'),
('Clothing', 'Fashion and apparel', 'fa-shirt'),
('Books', 'Books and educational materials', 'fa-book'),
('Home & Garden', 'Home and garden products', 'fa-home');
```

---

### 3. products
Product catalog with pricing and inventory.

| Column      | Type          | Constraints                    | Description                |
|-------------|---------------|--------------------------------|----------------------------|
| id          | BIGINT        | PRIMARY KEY, AUTO_INCREMENT    | Unique product ID          |
| name        | VARCHAR(255)  | NOT NULL                       | Product name               |
| description | VARCHAR(1000) |                                | Product description        |
| price       | DOUBLE        | NOT NULL                       | Product price              |
| stock       | INT           |                                | Available quantity         |
| category_id | BIGINT        | FOREIGN KEY → categories(id)   | Product category           |
| image_url   | VARCHAR(255)  |                                | Product image URL          |

**Relationships:**
- Many-to-One with categories

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (category_id)
- INDEX (category_id)

**Sample Data:**
```sql
INSERT INTO products (name, description, price, stock, category_id) VALUES
('Laptop Pro', 'High-performance laptop', 1299.99, 15, 1),
('Cotton T-Shirt', 'Comfortable cotton t-shirt', 19.99, 100, 2);
```

---

### 4. orders
Customer orders and purchase information.

| Column           | Type          | Constraints                    | Description                |
|------------------|---------------|--------------------------------|----------------------------|
| id               | BIGINT        | PRIMARY KEY, AUTO_INCREMENT    | Unique order ID            |
| user_id          | BIGINT        | FOREIGN KEY → users(id)        | Customer who placed order  |
| total_amount     | DOUBLE        | NOT NULL                       | Order total price          |
| status           | VARCHAR(255)  | NOT NULL                       | Order status               |
| shipping_address | VARCHAR(500)  |                                | Delivery address           |
| payment_method   | VARCHAR(255)  |                                | Payment type (card/cod)    |
| order_date       | TIMESTAMP     |                                | Order creation time        |

**Order Status Values:**
- `PENDING` - Order placed, awaiting processing
- `PROCESSING` - Order being prepared
- `COMPLETED` - Order delivered
- `CANCELLED` - Order cancelled

**Payment Methods:**
- `card` - Credit/Debit Card
- `cod` - Cash on Delivery

**Relationships:**
- Many-to-One with users
- One-to-Many with order_items

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (user_id)
- INDEX (user_id)
- INDEX (status)

**Sample Data:**
```sql
INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method) VALUES
(1, 149.98, 'PENDING', '123 Main St', 'card');
```

---

### 5. order_items
Individual items within each order.

| Column      | Type    | Constraints                    | Description                |
|-------------|---------|--------------------------------|----------------------------|
| id          | BIGINT  | PRIMARY KEY, AUTO_INCREMENT    | Unique item ID             |
| order_id    | BIGINT  | FOREIGN KEY → orders(id)       | Parent order               |
| product_id  | BIGINT  | FOREIGN KEY → products(id)     | Ordered product            |
| quantity    | INT     | NOT NULL                       | Number of items            |
| price       | DOUBLE  | NOT NULL                       | Price at time of order     |

**Relationships:**
- Many-to-One with orders
- Many-to-One with products

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (order_id)
- FOREIGN KEY (product_id)
- INDEX (order_id)

**Sample Data:**
```sql
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 1299.99),
(1, 2, 2, 19.99);
```

---

## Entity Relationships

```
users (1) ----< (M) orders
  |
  id

categories (1) ----< (M) products
     |
     id

orders (1) ----< (M) order_items >---- (M) products
   |                                        |
   id                                       id
```

### Relationship Descriptions:

1. **User → Orders** (One-to-Many)
   - One user can have multiple orders
   - Each order belongs to one user

2. **Category → Products** (One-to-Many)
   - One category can contain multiple products
   - Each product belongs to one category

3. **Order → Order Items** (One-to-Many)
   - One order can have multiple items
   - Each item belongs to one order

4. **Product → Order Items** (One-to-Many)
   - One product can appear in multiple order items
   - Each order item references one product

## Database Initialization

The database schema is automatically created by Hibernate on application startup using:

```properties
spring.jpa.hibernate.ddl-auto=update
```

This setting:
- Creates tables if they don't exist
- Updates schema when entities change
- Preserves existing data

## Sample Queries

### Get all products in a category
```sql
SELECT p.* FROM products p 
WHERE p.category_id = 1;
```

### Get user's order history
```sql
SELECT o.*, oi.*, p.name 
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.user_id = 1
ORDER BY o.order_date DESC;
```

### Get total revenue by category
```sql
SELECT c.name, SUM(oi.quantity * oi.price) as revenue
FROM categories c
JOIN products p ON c.id = p.category_id
JOIN order_items oi ON p.id = oi.product_id
GROUP BY c.id, c.name;
```

### Get top selling products
```sql
SELECT p.name, SUM(oi.quantity) as total_sold
FROM products p
JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name
ORDER BY total_sold DESC
LIMIT 10;
```

### Check low stock products
```sql
SELECT name, stock 
FROM products 
WHERE stock < 10
ORDER BY stock ASC;
```

## Data Integrity

### Foreign Key Constraints:
- Cascade deletes are not enabled to preserve order history
- Orders remain even if user is deleted (set user_id to NULL or keep for records)
- Products in orders remain even if product is deleted from catalog

### Data Validation:
- Email must be unique
- Category names must be unique
- Prices and quantities must be positive
- Stock levels updated on order creation

## Backup & Maintenance

### Backup Database:
```bash
mysqldump -u root -p ecommerce_db > backup.sql
```

### Restore Database:
```bash
mysql -u root -p ecommerce_db < backup.sql
```

### Clear All Data (Development Only):
```sql
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;
```

## Performance Considerations

1. **Indexes**: Created on foreign keys and frequently queried columns
2. **Connection Pooling**: Configured in Spring Boot
3. **Lazy Loading**: Used for related entities to reduce query overhead
4. **Caching**: Can be added with Spring Cache for frequently accessed data

## Security Notes

⚠️ **For Production:**
- Hash passwords using BCrypt
- Add user roles and permissions table
- Implement soft deletes for audit trails
- Add created_by, updated_by audit fields
- Encrypt sensitive data
- Regular backups

---

**Database Version:** MySQL 8.0+  
**Auto-generated by:** Hibernate/JPA  
**Last Updated:** 2024
