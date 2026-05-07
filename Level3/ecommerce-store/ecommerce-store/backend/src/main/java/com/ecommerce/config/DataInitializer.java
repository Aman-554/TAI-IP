package com.ecommerce.config;

import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if database is empty
        if (categoryRepository.count() == 0) {
            initializeData();
        }
    }

    private void initializeData() {
        // Create Categories
        Category electronics = new Category("Electronics", "Electronic devices and gadgets", "fa-laptop");
        Category clothing = new Category("Clothing", "Fashion and apparel", "fa-shirt");
        Category books = new Category("Books", "Books and educational materials", "fa-book");
        Category homeGarden = new Category("Home & Garden", "Home and garden products", "fa-home");

        categoryRepository.save(electronics);
        categoryRepository.save(clothing);
        categoryRepository.save(books);
        categoryRepository.save(homeGarden);

        // Create Products
        productRepository.save(new Product("Laptop Pro", "High-performance laptop for professionals with 16GB RAM and 512GB SSD", 1299.99, 15, electronics));
        productRepository.save(new Product("Wireless Mouse", "Ergonomic wireless mouse with long battery life", 29.99, 50, electronics));
        productRepository.save(new Product("USB-C Hub", "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader", 49.99, 30, electronics));
        productRepository.save(new Product("Bluetooth Headphones", "Noise-cancelling wireless headphones with 30-hour battery", 199.99, 25, electronics));
        
        productRepository.save(new Product("Cotton T-Shirt", "Comfortable 100% cotton t-shirt available in multiple colors", 19.99, 100, clothing));
        productRepository.save(new Product("Denim Jeans", "Classic blue denim jeans with perfect fit", 49.99, 75, clothing));
        productRepository.save(new Product("Hoodie", "Warm and cozy hoodie for casual wear", 39.99, 60, clothing));
        productRepository.save(new Product("Running Shoes", "Lightweight running shoes with excellent cushioning", 89.99, 40, clothing));
        
        productRepository.save(new Product("JavaScript: The Definitive Guide", "Complete guide to JavaScript programming", 39.99, 30, books));
        productRepository.save(new Product("Python Cookbook", "Essential Python recipes and best practices", 44.99, 25, books));
        productRepository.save(new Product("Clean Code", "A handbook of agile software craftsmanship", 34.99, 35, books));
        productRepository.save(new Product("The Pragmatic Programmer", "Your journey to mastery", 42.99, 28, books));
        
        productRepository.save(new Product("Garden Tools Set", "Complete 10-piece gardening tool set", 79.99, 20, homeGarden));
        productRepository.save(new Product("LED Desk Lamp", "Adjustable LED desk lamp with touch control", 34.99, 40, homeGarden));
        productRepository.save(new Product("Plant Pot Set", "Set of 5 ceramic plant pots in different sizes", 29.99, 50, homeGarden));
        productRepository.save(new Product("Storage Bins", "Pack of 4 stackable storage bins", 24.99, 45, homeGarden));

        System.out.println("Sample data initialized successfully!");
    }
}
