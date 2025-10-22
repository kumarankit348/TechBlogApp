const Category = require("../../models/Categories/category");
const asyncHandler = require("express-async-handler");

//@desc create new category
//@route POST /api/v1/categories/
// @access Private

exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  // Check if category already exists
  const category = await Category.findOne({ name });
  if (category) {
    throw new Error("Category already exists");
  }
  // Create new category
  const newCategory = await Category.create({
    name,
    author: req?.userAuth?._id,
  });

  res.json({
    status: "success",
    message: "Category created successfully",
    newCategory,
  });
});

//@desc get all categories
//@route GET /api/v1/categories
// @access Public

exports.getAllCategories = asyncHandler(async (req, res) => {
  const allCategories = await Category.find({}).populate({
    path: "posts",
    model: "Post",
  });
  res.status(201).json({
    status: "success",
    message: "All categories fetched successfully",
    allCategories,
  });
});

// @delete single category
//@route DELETE /api/v1/categories/:id
// @access Private

exports.deleteCategory = asyncHandler(async (req, res) => {
  const catId = req.params.id;
  await Category.findByIdAndDelete(catId);
  res.status(201).json({
    status: "success",
    message: "Category deleted successfully",
  });
});

// @update single category
//@route PUT /api/v1/categories/:id
// @access Private

exports.updateCategory = asyncHandler(async (req, res) => {
  const catId = req.params.id;
  const { name } = req.body;
  const updatedCategory = await Category.findByIdAndUpdate(
    catId,
    { name: name },
    { new: true, runValidators: true }
  );
  res.status(201).json({
    status: "success",
    message: "Category updated successfully",
    updatedCategory,
  });
});
