require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Product DB Connected"))
  .catch(err => console.log(err));

// Product Model
const Product = mongoose.model('Product', {
  name: String,
  description: String,
  price: Number,
  createdBy: String
});

// CREATE product
app.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all products
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// GET product by ID
app.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

// UPDATE product
app.put('/products/:id', async (req, res) => {
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE product
app.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

app.listen(5002, () => {
  console.log("Product Service running on port 5002");
});
