# API Testing Guide

Complete guide for testing all API endpoints using Postman, curl, or any REST client.

## Base URL
```
http://localhost:8080/api
```

---

## 1. User APIs

### 1.1 Register User
**POST** `/users/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "address": "123 Main Street, City, State 12345"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "password": null,
  "phone": "1234567890",
  "address": "123 Main Street, City, State 12345",
  "createdAt": "2024-05-05T10:30:00.000+00:00"
}
```

**cURL:**
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890",
    "address": "123 Main Street, City, State 12345"
  }'
```

---

### 1.2 Login User
**POST** `/users/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "password": null,
  "phone": "1234567890",
  "address": "123 Main Street, City, State 12345",
  "createdAt": "2024-05-05T10:30:00.000+00:00"
}
```

**cURL:**
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

### 1.3 Get All Users
**GET** `/users`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "password": null,
    "phone": "1234567890",
    "address": "123 Main Street, City, State 12345",
    "createdAt": "2024-05-05T10:30:00.000+00:00"
  }
]
```

**cURL:**
```bash
curl http://localhost:8080/api/users
```

---

## 2. Category APIs

### 2.1 Get All Categories
**GET** `/categories`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Electronics",
    "description": "Electronic devices and gadgets",
    "icon": "fa-laptop"
  },
  {
    "id": 2,
    "name": "Clothing",
    "description": "Fashion and apparel",
    "icon": "fa-shirt"
  }
]
```

**cURL:**
```bash
curl http://localhost:8080/api/categories
```

---

### 2.2 Create Category
**POST** `/categories`

**Request Body:**
```json
{
  "name": "Sports & Outdoors",
  "description": "Sports equipment and outdoor gear",
  "icon": "fa-football"
}
```

**Response (201 Created):**
```json
{
  "id": 5,
  "name": "Sports & Outdoors",
  "description": "Sports equipment and outdoor gear",
  "icon": "fa-football"
}
```

**cURL:**
```bash
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sports & Outdoors",
    "description": "Sports equipment and outdoor gear",
    "icon": "fa-football"
  }'
```

---

## 3. Product APIs

### 3.1 Get All Products
**GET** `/products`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Laptop Pro",
    "description": "High-performance laptop for professionals",
    "price": 1299.99,
    "stock": 15,
    "category": {
      "id": 1,
      "name": "Electronics",
      "description": "Electronic devices and gadgets",
      "icon": "fa-laptop"
    },
    "imageUrl": null
  }
]
```

**cURL:**
```bash
curl http://localhost:8080/api/products
```

---

### 3.2 Get Products by Category
**GET** `/products/category/{categoryId}`

**Example:** Get all Electronics (category ID = 1)

**cURL:**
```bash
curl http://localhost:8080/api/products/category/1
```

---

### 3.3 Search Products
**GET** `/products/search?keyword={keyword}`

**Example:** Search for "laptop"

**cURL:**
```bash
curl "http://localhost:8080/api/products/search?keyword=laptop"
```

---

### 3.4 Create Product
**POST** `/products`

**Request Body:**
```json
{
  "name": "Gaming Keyboard",
  "description": "RGB mechanical gaming keyboard",
  "price": 89.99,
  "stock": 50,
  "category": {
    "id": 1
  }
}
```

**Response (201 Created):**
```json
{
  "id": 17,
  "name": "Gaming Keyboard",
  "description": "RGB mechanical gaming keyboard",
  "price": 89.99,
  "stock": 50,
  "category": {
    "id": 1,
    "name": "Electronics",
    "description": "Electronic devices and gadgets",
    "icon": "fa-laptop"
  },
  "imageUrl": null
}
```

**cURL:**
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Keyboard",
    "description": "RGB mechanical gaming keyboard",
    "price": 89.99,
    "stock": 50,
    "category": {"id": 1}
  }'
```

---

### 3.5 Update Product
**PUT** `/products/{id}`

**Request Body:**
```json
{
  "name": "Gaming Keyboard Pro",
  "description": "RGB mechanical gaming keyboard with macro keys",
  "price": 99.99,
  "stock": 45,
  "category": {
    "id": 1
  }
}
```

**cURL:**
```bash
curl -X PUT http://localhost:8080/api/products/17 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Keyboard Pro",
    "description": "RGB mechanical gaming keyboard with macro keys",
    "price": 99.99,
    "stock": 45,
    "category": {"id": 1}
  }'
```

---

### 3.6 Delete Product
**DELETE** `/products/{id}`

**cURL:**
```bash
curl -X DELETE http://localhost:8080/api/products/17
```

---

## 4. Order APIs

### 4.1 Create Order
**POST** `/orders`

**Request Body:**
```json
{
  "user": {
    "id": 1
  },
  "items": [
    {
      "product": {
        "id": 1
      },
      "quantity": 1,
      "price": 1299.99
    },
    {
      "product": {
        "id": 2
      },
      "quantity": 2,
      "price": 29.99
    }
  ],
  "totalAmount": 1359.97,
  "shippingAddress": "123 Main Street, City, State 12345",
  "paymentMethod": "card"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "items": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "Laptop Pro",
        "price": 1299.99
      },
      "quantity": 1,
      "price": 1299.99
    },
    {
      "id": 2,
      "product": {
        "id": 2,
        "name": "Wireless Mouse",
        "price": 29.99
      },
      "quantity": 2,
      "price": 29.99
    }
  ],
  "totalAmount": 1359.97,
  "status": "PENDING",
  "shippingAddress": "123 Main Street, City, State 12345",
  "paymentMethod": "card",
  "orderDate": "2024-05-05T10:45:00.000+00:00"
}
```

**cURL:**
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "user": {"id": 1},
    "items": [
      {"product": {"id": 1}, "quantity": 1, "price": 1299.99},
      {"product": {"id": 2}, "quantity": 2, "price": 29.99}
    ],
    "totalAmount": 1359.97,
    "shippingAddress": "123 Main Street, City, State 12345",
    "paymentMethod": "card"
  }'
```

---

### 4.2 Get All Orders
**GET** `/orders`

**cURL:**
```bash
curl http://localhost:8080/api/orders
```

---

### 4.3 Get Orders by User
**GET** `/orders/user/{userId}`

**Example:** Get orders for user ID 1

**cURL:**
```bash
curl http://localhost:8080/api/orders/user/1
```

---

### 4.4 Get Orders by Status
**GET** `/orders/status/{status}`

**Example:** Get all pending orders

**cURL:**
```bash
curl http://localhost:8080/api/orders/status/PENDING
```

**Available Statuses:**
- PENDING
- PROCESSING
- COMPLETED
- CANCELLED

---

### 4.5 Update Order Status
**PUT** `/orders/{id}/status`

**Request Body:**
```json
{
  "status": "PROCESSING"
}
```

**cURL:**
```bash
curl -X PUT http://localhost:8080/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "PROCESSING"}'
```

---

### 4.6 Cancel Order
**DELETE** `/orders/{id}`

**cURL:**
```bash
curl -X DELETE http://localhost:8080/api/orders/1
```

---

## Testing Scenarios

### Scenario 1: Complete User Journey

```bash
# 1. Register user
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "test123", "phone": "9876543210", "address": "Test Address"}'

# 2. Login
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test123"}'

# 3. Browse products
curl http://localhost:8080/api/products

# 4. Search products
curl "http://localhost:8080/api/products/search?keyword=laptop"

# 5. Create order (use user ID from login response)
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "user": {"id": 2},
    "items": [{"product": {"id": 1}, "quantity": 1, "price": 1299.99}],
    "totalAmount": 1299.99,
    "shippingAddress": "Test Address",
    "paymentMethod": "card"
  }'

# 6. View user's orders
curl http://localhost:8080/api/orders/user/2
```

---

### Scenario 2: Admin Operations

```bash
# 1. Create new category
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Toys", "description": "Toys and games", "icon": "fa-gamepad"}'

# 2. Add product to new category
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Board Game",
    "description": "Fun family board game",
    "price": 29.99,
    "stock": 100,
    "category": {"id": 5}
  }'

# 3. Update product
curl -X PUT http://localhost:8080/api/products/17 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Board Game",
    "description": "Deluxe edition family board game",
    "price": 39.99,
    "stock": 95,
    "category": {"id": 5}
  }'

# 4. View all orders
curl http://localhost:8080/api/orders

# 5. Update order status
curl -X PUT http://localhost:8080/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "COMPLETED"}'
```

---

## Postman Collection

Create a Postman collection with these requests:

1. **Setup Environment Variables:**
   - `base_url`: http://localhost:8080/api
   - `user_id`: (set after login)

2. **Import Collection** with all endpoints above

3. **Test Scripts** (add to Login request):
```javascript
// Save user ID for subsequent requests
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("user_id", jsonData.id);
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Email already exists"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 404 Not Found
```json
{
  "error": "Product not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error message"
}
```

---

## Tips for Testing

1. **Start with user registration and login** to get a valid user ID
2. **Use the sample data** that's auto-loaded on startup
3. **Check product stock** before creating large orders
4. **Test error cases** like invalid IDs, missing fields
5. **Monitor backend console** for SQL queries and errors
6. **Use Postman Tests** to validate responses

---

**Happy Testing! 🧪**
