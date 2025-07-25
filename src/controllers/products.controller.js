import * as Service from "../services/products.services.js";

// Validación de campos comunes para crear/actualizar
const validateProductData = (data) => {
  const errors = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.push('El nombre es obligatorio y debe ser texto válido');
  }

  if (!data.price || isNaN(data.price) || Number(data.price) <= 0) {
    errors.push('El precio es obligatorio y debe ser un número mayor a 0');
  }

  if (data.categories && (!Array.isArray(data.categories) || data.categories.some(cat => typeof cat !== 'string'))) {
    errors.push('Las categorías deben ser un array de strings');
  }

  return errors;
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Service.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID de producto es requerido" });
    }

    const product = await Service.getProductById(id);
    product 
      ? res.json(product)
      : res.status(404).json({ message: 'Producto no encontrado' });
  } catch (error) {
    res.status(500).json({ error: "Error al buscar producto" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, categories } = req.body;

    // Validación
    const validationErrors = validateProductData({ name, price, categories });
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const newProduct = await Service.createProduct({ 
      name: name.trim(), 
      price: Number(price),
      categories: categories || [] // Valor por defecto si no se envía
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Error al crear producto" });
  }
};

export const updateProduct = async (req, res) => { // <-- ¡Nueva función!
  try {
    const { id } = req.params;
    const { name, price, categories } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID de producto es requerido" });
    }

    const validationErrors = validateProductData({ name, price, categories });
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const updatedProduct = await Service.updateProduct(id, { 
      name: name.trim(), 
      price: Number(price),
      categories 
    });

    updatedProduct
      ? res.json(updatedProduct)
      : res.status(404).json({ error: "Producto no encontrado" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID de producto es requerido" });
    }

    const result = await Service.deleteProduct(id);
    result
      ? res.status(204).send()
      : res.status(404).json({ error: "Producto no encontrado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};