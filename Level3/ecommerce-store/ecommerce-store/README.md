# E-Commerce Store Application

A full-stack e-commerce application built with HTML, CSS, JavaScript (frontend) and Java Spring Boot (backend) with MySQL database.

## Features

### User Features
- ✅ User Registration and Login
- ✅ Browse Products by Categories
- ✅ Product Search Functionality
- ✅ Shopping Cart Management
- ✅ Checkout Process
- ✅ Multiple Payment Methods (Card/Cash on Delivery)
- ✅ Order History and Tracking
- ✅ Responsive Design

### Admin Features (via API)
- ✅ Product Management (CRUD)
- ✅ Category Management (CRUD)
- ✅ Order Management
- ✅ User Management

## Technology Stack

### Frontend
- HTML5
- CSS3 (Responsive Design)
- JavaScript (Vanilla JS)
- Font Awesome Icons

### Backend
- Java 11
- Spring Boot 2.7.14
- Spring Data JPA
- MySQL 8.0
- Maven

## Project Structure

```
ecommerce-store/
├── frontend/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # Styling
│   └── app.js              # JavaScript functionality
│
├── backend/
│   ├── src/main/java/com/ecommerce/
│   │   ├── EcommerceApplication.java    # Main application
│   │   ├── controller/                   # REST Controllers
│   │   │   ├── UserController.java
│   │   │   ├── ProductController.java
│   │   │   ├── CategoryController.java
│   │   │   └── OrderController.java
│   │   ├── model/                        # Entity classes
│   │   │   ├── User.java
│   │   │   ├── Product.java
│   │   │   ├── Category.java
│   │   │   ├── Order.java
│   │   │   └── OrderItem.java
│   │   ├── repository/                   # JPA Repositories
│   │   │   ├── UserRepository.java
│   │   │   ├── ProductRepository.java
│   │   │   ├── CategoryRepository.java
│   │   │   └── OrderRepository.java
│   │   ├── service/                      # Business logic
│   │   │   ├── UserService.java
│   │   │   ├── ProductService.java
│   │   │   ├── CategoryService.java
│   │   │   └── OrderService.java
│   │   └── config/                       # Configuration
│   │       ├── WebConfig.java
│   │       └── DataInitializer.java
│   ├── src/main/resources/
│   │   └── application.properties        # App configuration
│   └── pom.xml                           # Maven dependencies
└── README.md
```

## Prerequisites

Before running this application, make sure you have:

1. **Java Development Kit (JDK) 11 or higher**
   - Download from: https://www.oracle.com/java/technologies/downloads/
   - Verify: `java -version`

2. **Maven 3.6 or higher**
   - Download from: https://maven.apache.org/download.cgi
   - Verify: `mvn -version`

3. **MySQL Server 8.0 or higher**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Verify: `mysql --version`

4. **Web Browser** (Chrome, Firefox, Edge, etc.)

## Database Setup

1. **Start MySQL Server**

2. **Create Database** (Optional - app will create it automatically)
   ```sql
   CREATE DATABASE ecommerce_db;
   ```

3. **Update Database Credentials** (if needed)
   
   Edit `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

## Installation & Running

### Method 1: Using Maven (Recommended)

1. **Navigate to backend directory**
   ```bash
   cd ecommerce-store/backend
   ```

2. **Build the project**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

   The backend server will start on `http://localhost:8080`

### Method 2: Using JAR file

1. **Build JAR file**
   ```bash
   cd ecommerce-store/backend
   mvn clean package
   ```

2. **Run the JAR**
   ```bash
   java -jar target/ecommerce-store-1.0.0.jar
   ```

### Running the Frontend

1. **Open the frontend**
   
   Simply open `frontend/index.html` in your web browser, or use a local server:

   **Using Python:**
   ```bash
   cd ecommerce-store/frontend
   python -m http.server 3000
   ```
   Then visit: `http://localhost:3000`

   **Using Node.js (http-server):**
   ```bash
   cd ecommerce-store/frontend
   npx http-server -p 3000
   ```

   **Using VS Code Live Server:**
   - Install "Live Server" extension
   - Right-click on `index.html`
   - Select "Open with Live Server"

## API Endpoints

### User APIs
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Product APIs
- `POST /api/products` - Create product
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/category/{categoryId}` - Get products by category
- `GET /api/products/search?keyword={keyword}` - Search products
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Category APIs
- `POST /api/categories` - Create category
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Order APIs
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/user/{userId}` - Get orders by user
- `GET /api/orders/status/{status}` - Get orders by status
- `PUT /api/orders/{id}/status` - Update order status
- `DELETE /api/orders/{id}` - Cancel order

## Sample Data

The application automatically loads sample data on first run:

### Categories
- Electronics
- Clothing
- Books
- Home & Garden

### Products
16 sample products across all categories with realistic pricing and stock levels

## Usage Guide

### For Users

1. **Register an Account**
   - Click on the user icon → Register
   - Fill in your details
   - Submit the form

2. **Login**
   - Click on the user icon → Login
   - Enter email and password

3. **Browse Products**
   - View featured products on home page
   - Click "Products" to see all items
   - Use category filter to narrow down
   - Use search bar to find specific items

4. **Add to Cart**
   - Click "Add to Cart" on any product
   - View cart by clicking the cart icon
   - Adjust quantities with +/- buttons
   - Remove items with trash icon

5. **Checkout**
   - Click "Proceed to Checkout" in cart
   - Fill in shipping information
   - Choose payment method (Card/COD)
   - Place order

6. **View Orders**
   - Click "My Orders" in navigation
   - See all your order history with status

### For Testing

**Test User Credentials:**
- You can register your own account
- Or create one and use those credentials

**Test Cards (for demonstration):**
- Card Number: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits

## Security Notes

⚠️ **Important for Production:**

1. **Password Hashing**: Currently passwords are stored in plain text. For production, implement BCrypt:
   ```java
   // In UserService
   BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
   user.setPassword(encoder.encode(user.getPassword()));
   ```

2. **Authentication**: Implement JWT tokens or Spring Security

3. **HTTPS**: Use HTTPS in production

4. **Input Validation**: Add comprehensive validation

5. **SQL Injection**: JPA protects against this, but validate inputs

## Troubleshooting

### Common Issues

**1. Port 8080 already in use**
```
Solution: Change port in application.properties
server.port=8081
```

**2. Database connection failed**
```
Solution: 
- Verify MySQL is running
- Check credentials in application.properties
- Ensure database exists or set createDatabaseIfNotExist=true
```

**3. CORS errors**
```
Solution: WebConfig.java already handles this. If issues persist:
- Clear browser cache
- Check backend is running on port 8080
```

**4. Maven build fails**
```
Solution:
- Ensure Java 11+ is installed
- Clear Maven cache: mvn clean
- Delete ~/.m2/repository and rebuild
```

## Future Enhancements

- [ ] Product images upload
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Admin dashboard UI
- [ ] Order tracking
- [ ] Inventory alerts
- [ ] Discount codes/coupons
- [ ] Multi-language support

## Contributing

This is an internship project. Feel free to fork and enhance!

## License

This project is created for educational purposes.

## Contact

For questions or issues, please create an issue in the repository.

---

**Happy Shopping! 🛒**
