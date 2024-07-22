import { Category } from "../../models/category.model.js";
import { AppError } from "../utils/appError.js";
import { errorHandler } from "./errorHandler.js";

export const allCatMW = errorHandler(async (req, res, next) => {
  console.log("allCatMW");
  console.log("?cat", req.params);
  if (req.params.id) {
    // console.log("1-id");
    const category = await Category.findById(req.params.id);
    // console.log("zen", category);
    // console.log(req.user._id);
    // console.log(category?.addedBy);
    // console.log(category?.addedBy.toString() == req.user?._id.toString());
    category ?? next(new AppError("category Not found-all", 404));
    // ==================================
    if (
      category?.sharingStatus === "Private" &&
      category?.addedBy.toString() == req.user?._id.toString()
    ) {
      console.log("12-id");
      req.category = category;
      return next();
    } else if (
      category?.sharingStatus == "Public" &&
      category?.addedBy.toString() == req.user?._id.toString()
    ) {
      console.log("13-id");
      req.category = category;
      console.log(req.category);
      return next();
    } else if (category?.sharingStatus == "Public" && !req.user) {
      console.log("14-id");
      req.category = category;
      console.log(req.category);
      return next();
    } else {
      console.log("15-id");
      return next(new AppError("user not authorized", 401));
    }
    // ==================================
  } else if (req.user && !req.params.id) {
    return next();
  } else {
    return next();
  }
});
