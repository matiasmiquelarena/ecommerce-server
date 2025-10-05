const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const path = require('path');

class ProductManager {
  constructor(filename = 'products.json') {
    this.filePath = path.join(__dirname, '..', 'data', filename);
  }

  async _readFile() {
    try {
      const content = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(content || '[]');
    } catch (err) {
      if (err.code === 'ENOENT') return [];
      throw err;
    }
  }

  async _writeFile(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  // Obtener todos los productos
  async getProducts() {
    return await this._readFile();
  }

  // Obtener producto por ID
  async getProductById(id) {
    const items = await this._readFile();
    const product = items.find(p => String(p.id) === String(id));
    if (!product) throw new Error('Producto no encontrado');
    return product;
  }

  // Agregar producto
  async addProduct(productData) {
    const items = await this._readFile();
    const newProduct = {
      id: uuidv4(),
      title: productData.title || '',
      description: productData.description || '',
      code: productData.code || '',
      price: Number(productData.price) || 0,
      status: productData.status === undefined ? true : Boolean(productData.status),
      stock: Number(productData.stock) || 0,
      category: productData.category || 'sin categoría',
      thumbnails: Array.isArray(productData.thumbnails) ? productData.thumbnails : []
    };
    items.push(newProduct);
    await this._writeFile(items);
    return newProduct;
  }

  // Actualizar producto
  async updateProduct(id, updateData) {
    const items = await this._readFile();
    const idx = items.findIndex(p => String(p.id) === String(id));
    if (idx === -1) throw new Error('Producto no encontrado');

    const updated = { ...items[idx], ...updateData, id: items[idx].id };

    if (updateData.price !== undefined) updated.price = Number(updateData.price);
    if (updateData.stock !== undefined) updated.stock = Number(updateData.stock);
    if (updateData.status !== undefined) updated.status = Boolean(updateData.status);
    if (updateData.thumbnails !== undefined && !Array.isArray(updateData.thumbnails)) {
      updated.thumbnails = items[idx].thumbnails;
    }

    items[idx] = updated;
    await this._writeFile(items);
    return updated;
  }

  // Eliminar producto
  async deleteProduct(id) {
    const items = await this._readFile();
    const filtered = items.filter(p => String(p.id) !== String(id));
    if (filtered.length === items.length) throw new Error('Producto no encontrado');

    await this._writeFile(filtered);
    return { message: 'Producto eliminado' };
  }
}

module.exports = ProductManager;
