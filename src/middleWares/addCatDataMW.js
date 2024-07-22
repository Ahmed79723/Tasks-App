import { Task } from "../../models/task.model.js";
import { AppError } from "../utils/appError.js";
import { errorHandler } from "./errorHandler.js";

export const addCatDataMW = errorHandler(async (req, res, next) => {
  // ids
  let { tasks } = req.body;
  const userArr = [];

  if (tasks) {
    for (const task of tasks) {
      const dbTask = await Task.findById(task);
      dbTask && userArr.push(task);
    }
    req.body.tasks = userArr;
    userArr.length || next(new AppError("task not found", 404));
    userArr.length && next();
  } else {
    // if no provided tasks
    next();
  }
});
