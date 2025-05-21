const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios'); 
const Product = require('./models/products.model');

const app = express();
const PORT = 3000;

// Middlewares - Simplified
app.use(express.json());
app.use(cors());

// MongoDB Connection - Moved up
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});


app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});




// Get all products
app.get("/api/products", async (req, res) => {
    try {
        console.log('GET request received for all products');
        const products = await Product.find();
        console.log('Products found:', products.length);
        res.json(products);
    } catch (error) {
        console.error('GET all error:', error);
        res.status(500).json({ message: error.message });
    }
});




// Get single product
app.get("/api/products/:id", async (req, res) => {
    try {
        console.log('GET request received for id:', req.params.id);
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('GET by ID error:', error);
        res.status(500).json({ message: error.message });
    }
});




// Update product
app.put("/api/products/:id", async (req, res) => {
    try {
        console.log('PUT request received for id:', req.params.id);
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('PUT error:', error);
        res.status(400).json({ message: error.message });
    }
});




// Delete product
app.delete("/api/products/:id", async (req, res) => {
    try {
        console.log('DELETE request received for id:', req.params.id);
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error('DELETE error:', error);
        res.status(500).json({ message: error.message });
    }
});




// Error handling middleware
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ message: 'Invalid JSON' });
    }

    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
});





// MongoDB Connection
mongoose.connect("mongodb+srv://vaibhav056:vaibhav056@newapi.mgglahw.mongodb.net/New-API?retryWrites=true&w=majority")
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });


