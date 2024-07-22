import { Task } from "../../models/task.model.js";
import { AppError } from "../utils/appError.js";
import { errorHandler } from "./errorHandler.js";

export const allTaskMW = errorHandler(async (req, res, next) => {
  if (req.params.id) {
    const task = await Task.findById(req.params?.id);
    task ?? next(new AppError("task Not found", 404));
    // ==================================
    if (
      task?.sharingStatus === "Private" &&
      task?.createdBy.toString() == req.user?._id.toString()
    ) {
      req.task = task;
      return next();
    } else if (
      task?.sharingStatus == "Public" &&
      task?.createdBy.toString() == req.user?._id.toString()
    ) {
      req.task = task;
      return next();
    } else if (task?.sharingStatus == "Public" && !req.user) {
      req.task = task;
      return next();
    } else {
      return next(new AppError("user not authorized", 401));
    }
    // ==================================
  } else if (req.user && !req.params.id) {
    // all private
    return next();
  } else {
    // all public
    return next();
  }
});
