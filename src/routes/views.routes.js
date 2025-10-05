const { Router } = require("express");
const ProductManager = require("../managers/productManager");

const router = Router();
const productManager = new ProductManager("src/data/products.json");

// Vista Home
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", { products });
  } catch (error) {
    console.error("Error al cargar productos:", error.message);
    res.status(500).send("Error al cargar productos");
  }
});

// Vista en tiempo real
router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products });
  } catch (error) {
    console.error("Error al cargar productos en tiempo real:", error.message);
    res.status(500).send("Error al cargar productos en tiempo real");
  }
});

module.exports = router;

