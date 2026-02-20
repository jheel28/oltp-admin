const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Category = require("../Models/Category");

const createCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "Invalid inputs", errors: errors.array() });
  }
  const { name, subjects, description } = req.body;
  let existing;
  try {
    existing = await Category.findOne({ name: name.trim() });
  } catch (err) {
    return next(new HttpError("Error fetching data", 500));
  }
  if (existing) {
    return next(new HttpError("Category already exists", 422));
  }
  const created = new Category({
    name: name.trim(),
    subjects: Array.isArray(subjects) ? subjects.map(s => s.trim()).filter(Boolean) : [],
    description: description || "",
  });
  try {
    await created.save();
  } catch (err) {
    return next(new HttpError("Error creating category", 500));
  }
  res.status(201).json({ category: created });
};

const getAllCategories = async (req, res, next) => {
  let categories;
  try {
    categories = await Category.find({}).sort({ name: 1 });
  } catch (err) {
    return next(new HttpError("Error fetching categories", 500));
  }
  res.status(200).json({ categories });
};

const getCategoryById = async (req, res, next) => {
  const { id } = req.params;
  let category;
  try {
    category = await Category.findById(id);
  } catch (err) {
    return next(new HttpError("Error fetching category", 500));
  }
  if (!category) return next(new HttpError("Category not found", 404));
  res.status(200).json({ category });
};

const updateCategoryById = async (req, res, next) => {
  const { id } = req.params;
  const { name, subjects, description } = req.body;
  let category;
  try {
    category = await Category.findById(id);
  } catch (err) {
    return next(new HttpError("Error fetching category", 500));
  }
  if (!category) return next(new HttpError("Category not found", 404));
  if (name) category.name = name.trim();
  if (subjects !== undefined) {
    category.subjects = Array.isArray(subjects)
      ? subjects.map(s => s.trim()).filter(Boolean)
      : [];
  }
  if (description !== undefined) category.description = description;
  try {
    await category.save();
  } catch (err) {
    return next(new HttpError("Error updating category", 500));
  }
  res.status(200).json({ category });
};

const addSubjectToCategory = async (req, res, next) => {
  const { id } = req.params;
  const { subject } = req.body;
  if (!subject || !subject.trim()) {
    return next(new HttpError("Subject name is required", 422));
  }
  let category;
  try {
    category = await Category.findById(id);
  } catch (err) {
    return next(new HttpError("Error fetching category", 500));
  }
  if (!category) return next(new HttpError("Category not found", 404));
  const trimmed = subject.trim();
  if (category.subjects.includes(trimmed)) {
    return next(new HttpError("Subject already exists in this category", 422));
  }
  category.subjects.push(trimmed);
  try {
    await category.save();
  } catch (err) {
    return next(new HttpError("Error saving category", 500));
  }
  res.status(200).json({ category });
};

const removeSubjectFromCategory = async (req, res, next) => {
  const { id, subject } = req.params;
  let category;
  try {
    category = await Category.findById(id);
  } catch (err) {
    return next(new HttpError("Error fetching category", 500));
  }
  if (!category) return next(new HttpError("Category not found", 404));
  category.subjects = category.subjects.filter(s => s !== decodeURIComponent(subject));
  try {
    await category.save();
  } catch (err) {
    return next(new HttpError("Error saving category", 500));
  }
  res.status(200).json({ category });
};

const deleteCategoryById = async (req, res, next) => {
  const { id } = req.params;
  let category;
  try {
    category = await Category.findById(id);
  } catch (err) {
    return next(new HttpError("Error fetching category", 500));
  }
  if (!category) return next(new HttpError("Category not found", 404));
  try {
    await category.deleteOne();
  } catch (err) {
    return next(new HttpError("Error deleting category", 500));
  }
  res.status(200).json({ message: "Category deleted successfully" });
};

exports.createCategory = createCategory;
exports.getAllCategories = getAllCategories;
exports.getCategoryById = getCategoryById;
exports.updateCategoryById = updateCategoryById;
exports.addSubjectToCategory = addSubjectToCategory;
exports.removeSubjectFromCategory = removeSubjectFromCategory;
exports.deleteCategoryById = deleteCategoryById;