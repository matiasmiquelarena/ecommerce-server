const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const handlebars = require("express-handlebars");
const path = require("path");

const productsRouter = require("./routes/products.routes");
const cartsRouter = require("./routes/carts.routes");
const viewsRouter = require("./routes/views.routes");
const ProductManager = require("./managers/productManager");

const app = express();
const PORT = 8080;

// Servidor HTTP + WebSocket
const httpServer = createServer(app);
const io = new Server(httpServer);

const productManager = new ProductManager("src/data/products.json");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Configuración de Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// Rutas API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Rutas de vistas
app.use("/", viewsRouter);

// WebSocket
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado vía WebSocket");

  socket.on("newProduct", async (data) => {
    await productManager.add(data); // método correcto
    const updatedProducts = await productManager.getAll(); // método correcto
    io.emit("updateProducts", updatedProducts);
  });

  socket.on("deleteProduct", async (id) => {
    await productManager.delete(id); // método correcto
    const updatedProducts = await productManager.getAll(); // método correcto
    io.emit("updateProducts", updatedProducts);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado");
  });
});

// Manejo de rutas inexistentes
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Iniciar servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

