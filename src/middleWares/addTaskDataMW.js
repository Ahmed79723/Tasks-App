import { Category } from "../../models/category.model.js";
import { AppError } from "../utils/appError.js";
import { errorHandler } from "./errorHandler.js";

export const addTaskDataMW = errorHandler(async (req, res, next) => {
  // ids
  let { relatedCategory } = req.body;
  const dbRelatedCategory = await Category.findById(relatedCategory);

  // if provided related Category does not exist in db
  if (!dbRelatedCategory && relatedCategory) {
    return next(new AppError("related Category Not found", 404));
  }
  // if field exists in db, go to next
  if (dbRelatedCategory) {
    if (!req.params.id) return next();
    dbRelatedCategory.tasks.push(req.params.id);
    await dbRelatedCategory.save();
    return next();
  } else {
    return next();
  }
});
