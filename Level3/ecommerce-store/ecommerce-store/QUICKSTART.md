# Quick Start Guide - E-Commerce Store

## 🚀 Get Started in 5 Minutes

### Step 1: Install Prerequisites (10 minutes)

1. **Install Java 11**
   - Windows/Mac: Download from https://www.oracle.com/java/technologies/downloads/
   - Linux: `sudo apt install openjdk-11-jdk`

2. **Install MySQL**
   - Windows/Mac: Download from https://dev.mysql.com/downloads/mysql/
   - Linux: `sudo apt install mysql-server`
   - Start MySQL service

3. **Install Maven** (or use IDE's built-in Maven)
   - Download from https://maven.apache.org/download.cgi

### Step 2: Setup Database (2 minutes)

1. Start MySQL server
2. Login to MySQL:
   ```bash
   mysql -u root -p
   ```
3. Create database:
   ```sql
   CREATE DATABASE ecommerce_db;
   exit;
   ```

### Step 3: Run Backend (2 minutes)

```bash
# Navigate to backend folder
cd ecommerce-store/backend

# Run the application
mvn spring-boot:run
```

Wait for message: "Started EcommerceApplication"

### Step 4: Open Frontend (1 minute)

**Option A - Direct File:**
- Open `frontend/index.html` in your browser

**Option B - Local Server (Recommended):**
```bash
cd ecommerce-store/frontend
python -m http.server 3000
```
Then visit: http://localhost:3000

### Step 5: Test the Application

1. **Register**: Click user icon → Register → Fill form
2. **Login**: Use your registered credentials
3. **Shop**: Browse products → Add to cart → Checkout
4. **View Orders**: Click "My Orders"

## ✅ Verification Checklist

- [ ] Backend running on http://localhost:8080
- [ ] Frontend accessible in browser
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] Can browse products
- [ ] Can add items to cart
- [ ] Can place an order
- [ ] Can view order history

## 🔧 Common Issues & Quick Fixes

**Backend won't start?**
```bash
# Check if port 8080 is free
netstat -an | grep 8080

# Use different port if needed
# Edit backend/src/main/resources/application.properties
# Change: server.port=8081
```

**Database connection error?**
```bash
# Check MySQL is running
sudo service mysql status  # Linux
# or
# Check Services on Windows

# Update credentials in application.properties if needed
```

**"CORS error" in browser console?**
- Make sure backend is running on port 8080
- Clear browser cache and refresh

## 📱 Using the Application

### As a Customer:

1. **Register/Login** → User icon (top right)
2. **Browse** → Home or Products page
3. **Search** → Use search bar
4. **Filter** → Select category from dropdown
5. **Add to Cart** → Click button on product
6. **Checkout** → Cart icon → Proceed to Checkout
7. **Orders** → My Orders link

### As an Admin (via API):

Use tools like Postman or curl:

**Add a new product:**
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "description": "Product description",
    "price": 99.99,
    "stock": 50,
    "category": {"id": 1}
  }'
```

**View all orders:**
```bash
curl http://localhost:8080/api/orders
```

## 🎯 Test Scenarios

### Scenario 1: Complete Purchase Flow
1. Register new user (email: test@example.com)
2. Browse Electronics category
3. Add "Laptop Pro" to cart
4. Add "Wireless Mouse" to cart
5. Go to cart, update quantities
6. Proceed to checkout
7. Fill shipping info
8. Select "Credit Card" payment
9. Place order
10. Check "My Orders" page

### Scenario 2: Product Search
1. Type "book" in search bar
2. See filtered results
3. Click on a book product
4. Add to cart

### Scenario 3: Order Management
1. Login as existing user
2. Go to "My Orders"
3. View order details
4. Check order status

## 📊 Sample Data

The app comes with pre-loaded data:

**Categories:** Electronics, Clothing, Books, Home & Garden  
**Products:** 16 items with realistic prices  
**Users:** None (you create them)

## 🛠️ Development Tools

**Recommended IDEs:**
- IntelliJ IDEA (best for Spring Boot)
- VS Code with Java extensions
- Eclipse with Spring Tools

**Database Tools:**
- MySQL Workbench
- DBeaver
- phpMyAdmin

**API Testing:**
- Postman
- Insomnia
- curl (command line)

## 📞 Need Help?

1. Check README.md for detailed documentation
2. Check console logs for errors
3. Verify all prerequisites are installed
4. Make sure MySQL is running
5. Ensure no port conflicts

## 🎓 Learning Resources

- Spring Boot: https://spring.io/guides
- JPA: https://spring.io/guides/gs/accessing-data-jpa/
- REST APIs: https://restfulapi.net/
- MySQL: https://dev.mysql.com/doc/

---

**You're all set! Happy coding! 🎉**
