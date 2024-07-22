import { User } from "../../models/user.model.js";
import { AppError } from "../utils/appError.js";
import { errorHandler } from "./errorHandler.js";

export const usersAuthMW = errorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  user ?? next(new AppError("user Not found", 404));
  if (user && user._id.toString() == req.user._id.toString()) {
    return next();
  }
  next(new AppError("user Not authorized", 401));
});
