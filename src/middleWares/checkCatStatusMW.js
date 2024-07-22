import { Category } from "../../models/category.model.js";
import { AppError } from "../utils/appError.js";
import { errorHandler } from "./errorHandler.js";

export const checkCatStatusMW = errorHandler(async (req, res, next) => {
  let input = {};
  if (req.params.id) {
    input = { _id: req.params.id };
  } else {
    input = { slug: req.params.slug };
  }
  const category = await Category.findOne({ ...input });
  if (category?.sharingStatus == "Private") {
    return next(
      new AppError("can't access private category, please sign in first", 401)
    );
  }
  category ?? next(new AppError("category Not found", 404));
  req.cat = category;
  category && next();
});
