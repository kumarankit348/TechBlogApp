const express = require("express");
const {
  createCategory,
} = require("../../controllers/categories/categoriesController");
const isLoggedin = require("../../middlewares/isLoggedin");
// const { get } = require("express/lib/response");
const {
  getAllCategories,
} = require("../../controllers/categories/categoriesController");
const {
  deleteCategory,
} = require("../../controllers/categories/categoriesController");
const {
  updateCategory,
} = require("../../controllers/categories/categoriesController");

const categoriesRouter = express.Router();
// ! Create a new category
// @route POST /api/v1/categories/
categoriesRouter.post("/", isLoggedin, createCategory);

// ! Get all categories
// @route GET /api/v1/categories
categoriesRouter.get("/", getAllCategories);

// ! Delete a category
// @route DELETE /api/v1/categories/:id
categoriesRouter.delete("/:id", isLoggedin, deleteCategory);

// ! Update a category
// @route PUT /api/v1/categories/:id
categoriesRouter.put("/:id", isLoggedin, updateCategory);

module.exports = categoriesRouter;
