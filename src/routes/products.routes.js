const express = require('express');
const ProductManager = require('../managers/productManager');
const router = express.Router();
const pm = new ProductManager();

router.get('/', async (req, res) => {
  try {
    const products = await pm.getAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error al leer productos' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const product = await pm.getById(req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error al leer producto' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newProduct = await pm.add(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    // Evitar actualización de id si se manda en body
    if (req.body.id) delete req.body.id;
    const updated = await pm.update(req.params.pid, req.body);
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const deleted = await pm.delete(req.params.pid);
    if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

module.exports = router;
