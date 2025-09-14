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

  async getAll() {
    return await this._readFile();
  }

  async getById(id) {
    const items = await this._readFile();
    return items.find(p => String(p.id) === String(id)) || null;
  }

  async add(productData) {
    const items = await this._readFile();
    const newProduct = {
      id: uuidv4(),
      title: productData.title || '',
      description: productData.description || '',
      code: productData.code || '',
      price: Number(productData.price) || 0,
      status: productData.status === undefined ? true : Boolean(productData.status),
      stock: Number(productData.stock) || 0,
      category: productData.category || '',
      thumbnails: Array.isArray(productData.thumbnails) ? productData.thumbnails : []
    };
    items.push(newProduct);
    await this._writeFile(items);
    return newProduct;
  }

  async update(id, updateData) {
    const items = await this._readFile();
    const idx = items.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return null;
    // No permitir cambiar id
    const updated = { ...items[idx], ...updateData, id: items[idx].id };
    // Asegurar types adecuados
    if (updateData.price !== undefined) updated.price = Number(updateData.price);
    if (updateData.stock !== undefined) updated.stock = Number(updateData.stock);
    if (updateData.status !== undefined) updated.status = Boolean(updateData.status);
    if (updateData.thumbnails !== undefined && !Array.isArray(updateData.thumbnails)) {
      // ignorar o convertir
      updated.thumbnails = items[idx].thumbnails;
    }
    items[idx] = updated;
    await this._writeFile(items);
    return updated;
  }

  async delete(id) {
    const items = await this._readFile();
    const newItems = items.filter(p => String(p.id) !== String(id));
    if (newItems.length === items.length) return false;
    await this._writeFile(newItems);
    return true;
  }
}

module.exports = ProductManager;
