const express = require('express');
const CartManager = require('../managers/cartManager');
const ProductManager = require('../managers/productManager');
const router = express.Router();

const cm = new CartManager();
const pm = new ProductManager();

router.post('/', async (req, res) => {
  try {
    const cart = await cm.createCart();
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear carrito' });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await cm.getById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart.products);
  } catch (err) {
    res.status(500).json({ error: 'Error al leer carrito' });
  }
});

// Agregar producto al carrito (se agrega de a uno)
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    // validar que exista el producto primero
    const product = await pm.getById(req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    const cart = await cm.addProductToCart(req.params.cid, req.params.pid, 1);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
});

module.exports = router;
