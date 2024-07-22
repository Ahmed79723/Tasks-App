import slugify from "slugify";
import { Category } from "../../../models/category.model.js";
import { errorHandler } from "../../middleWares/errorHandler.js";
import { AppError } from "../../utils/appError.js";
import { Task } from "../../../models/task.model.js";

// ~=====================================|add category|===================================================
const addCategory = errorHandler(async (req, res, next) => {
  const category = new Category({ ...req.body, addedBy: req.user._id });
  await category.save();
  // if category is added
  category && res.status(201).json({ msg: "success", category });
  // if category not added
  category || next(new AppError("category not added", 404));
});
//~=====================================|get All Categories (public)|===================================================
const getAllCategories = errorHandler(async (req, res, next) => {
  const { page = 1, limit = 5 } = req.query;
  const skip = (page - 1) * limit;
  const categories = await Category.find({ sharingStatus: "Public" })
    .skip(skip)
    .limit(limit);
  categories.length && res.json({ msg: "success", categories });
  categories.length || next(new AppError("categories not found", 404));
});
//~=====================================|get All Categories by name (public)|===================================================
const getPublicCatsByName = errorHandler(async (req, res, next) => {
  const { page = 1, limit = 5 } = req.query;
  const skip = (page - 1) * limit;
  if (!req.query.categoryName) {
    return next(new AppError("category name is required", 400));
  }
  const categories = await Category.find({
    slug: slugify(req.query.categoryName),
    sharingStatus: "Public",
  })
    .skip(skip)
    .limit(limit);
  categories.length && res.json({ msg: "success", categories });
  categories.length || next(new AppError("categories not found", 404));
});
// ~=====================================|get category (public)|===================================================
const getCategory = errorHandler(async (req, res, next) => {
  // if category found
  res.status(200).json({ msg: "success", category: req.category });
});
// ~=====================================|update category|===================================================
const updateCategory = errorHandler(async (req, res, next) => {
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  // if categories is updated
  category && res.status(201).json({ msg: "success", category });
  // if categories is not updated
  category || next(new AppError("category not found", 404));
});
// ~=====================================|delete category|===================================================
const deleteCategory = errorHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (category) {
    // finding all related tasks
    const tasks = await Task.find({ relatedCategory: category._id });
    for (const task of tasks) {
      // deleting all related  tasks
      await Task.deleteMany({ relatedCategory: task._id });
    }
    res.status(200).json({ msg: "category deleted successfully", category });
  }
  category ?? next(new AppError(`category not found`, 404));
});
//~=====================================|get All Categories (Private)|===================================================
const getAllPrivateCats = errorHandler(async (req, res, next) => {
  const { page = 1, limit = 5 } = req.query;
  const skip = (page - 1) * limit;
  const categories = await Category.find({
    sharingStatus: "Private",
    addedBy: req.user._id,
  })
    .skip(skip)
    .limit(limit);
  categories.length && res.json({ msg: "success", categories });
  categories.length || next(new AppError("categories not found", 404));
});
// ~=====================================|get category (Private)|===================================================
const getPrivateCat = errorHandler(async (req, res, next) => {
  // if category found
  const category = await Category.findOne({
    sharingStatus: "Private",
    _id: req.params.id,
    addedBy: req.user._id,
  });
  // if (category?.sharingStatus == "Public") {
  //   return next(
  //     new AppError(
  //       "this is not a private category to access public categories, request on the public categories end points",
  //       404
  //     )
  //   );
  // }
  category ?? next(new AppError("category not found", 404));
  category && res.status(200).json({ msg: "success", category });
});

export {
  addCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  getPrivateCat,
  getAllPrivateCats,
  getPublicCatsByName,
};
