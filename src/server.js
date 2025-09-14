const express = require('express');
const productsRouter = require('./routes/products.routes');
const cartsRouter = require('./routes/carts.routes');

const app = express();
const PORT = 8080;

// middlewares
app.use(express.json());

// rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// home
app.get('/', (req, res) => {
  res.send('API funcionando - Entrega 1');
});

// manejo de errores simples
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
