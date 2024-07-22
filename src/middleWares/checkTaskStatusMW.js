import { Task } from "../../models/task.model.js";
import { AppError } from "../utils/appError.js";
import { errorHandler } from "./errorHandler.js";

export const checkTaskStatusMW = errorHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (task?.sharingStatus == "Private") {
    return next(
      new AppError("can't access private task, please sign in first", 401)
    );
  }
  task ?? next(new AppError("task Not found", 404));
  req.task = task;
  task && next();
});
