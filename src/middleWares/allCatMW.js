import { Category } from "../../models/category.model.js";
import { AppError } from "../utils/appError.js";
import { errorHandler } from "./errorHandler.js";

export const allCatMW = errorHandler(async (req, res, next) => {
  if (req.params.id) {
    const category = await Category.findById(req.params.id);
    category ?? next(new AppError("category Not found-all", 404));
    // ==================================
    if (
      category?.sharingStatus === "Private" &&
      category?.addedBy.toString() == req.user?._id.toString()
    ) {
      req.category = category;
      return next();
    } else if (
      category?.sharingStatus == "Public" &&
      category?.addedBy.toString() == req.user?._id.toString()
    ) {
      req.category = category;
      return next();
    } else if (category?.sharingStatus == "Public" && !req.user) {
      req.category = category;
      return next();
    } else {
      return next(new AppError("user not authorized", 401));
    }
    // ==================================
  } else if (req.user && !req.params.id) {
    return next();
  } else {
    return next();
  }
});
