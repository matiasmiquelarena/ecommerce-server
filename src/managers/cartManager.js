const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const path = require('path');

class CartManager {
  constructor(filename = 'carts.json') {
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

  async createCart() {
    const carts = await this._readFile();
    const newCart = { id: uuidv4(), products: [] };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  async getById(id) {
    const carts = await this._readFile();
    return carts.find(c => String(c.id) === String(id)) || null;
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const carts = await this._readFile();
    const cartIndex = carts.findIndex(c => String(c.id) === String(cartId));
    if (cartIndex === -1) return null;
    const cart = carts[cartIndex];

    const prodIndex = cart.products.findIndex(p => String(p.product) === String(productId));
    if (prodIndex === -1) {
      cart.products.push({ product: String(productId), quantity: Number(quantity) });
    } else {
      cart.products[prodIndex].quantity = Number(cart.products[prodIndex].quantity) + Number(quantity);
    }

    carts[cartIndex] = cart;
    await this._writeFile(carts);
    return cart;
  }
}

module.exports = CartManager;
