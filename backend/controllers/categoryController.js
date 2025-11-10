// backend/controllers/categoryController.js
const categoryModel = require('../models/categoryModel');

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryModel.findByUserId(req.user.id);
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  const { name, color } = req.body;
  if (!name || !color) {
    return res.status(400).json({ message: 'Name and color are required' });
  }

  try {
    const newCategory = await categoryModel.create({ userId: req.user.id, name, color });
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { name, color } = req.body;

  if (!name || !color) {
    return res.status(400).json({ message: 'Name and color are required' });
  }

  try {
    const affectedRows = await categoryModel.update(id, req.user.id, { name, color });
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found or user not authorized' });
    }
    res.json({ id, name, color });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  const { id } = req.params;

  try {
    const affectedRows = await categoryModel.delete(id, req.user.id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found or user not authorized' });
    }
    res.status(200).json({ message: 'Category deleted successfully', id });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };