import { Task } from "../../models/task.model.js";
import { AppError } from "../utils/appError.js";
import { errorHandler } from "./errorHandler.js";

export const allTaskMW = errorHandler(async (req, res, next) => {
  console.log("allTaskMW");
  console.log("?taskId", req.params);
  if (req.params.id) {
    console.log("1-id");
    const task = await Task.findById(req.params?.id);
    // console.log("zen", task);
    // console.log(req.user._id);
    // console.log(task?.createdBy);
    // console.log(task?.createdBy.toString() == req.user?._id.toString());
    task ?? next(new AppError("task Not found", 404));
    // ==================================
    if (
      task?.sharingStatus === "Private" &&
      task?.createdBy.toString() == req.user?._id.toString()
    ) {
      console.log("12-id");
      req.task = task;
      return next();
    } else if (
      task?.sharingStatus == "Public" &&
      task?.createdBy.toString() == req.user?._id.toString()
    ) {
      console.log("13-id");
      req.task = task;
      console.log(req.task);
      return next();
    } else if (task?.sharingStatus == "Public" && !req.user) {
      console.log("14-id");
      req.task = task;
      console.log(req.task);
      return next();
    } else {
      console.log("15-id");
      return next(new AppError("user not authorized", 401));
    }
    // ==================================
  } else if (req.user && !req.params.id) {
    // all private
    console.log("2-id");
    return next();
  } else {
    // all public
    console.log("3-id");
    return next();
  }
});
