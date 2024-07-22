import { errorHandler } from "../../middleWares/errorHandler.js";
import { AppError } from "../../utils/appError.js";
import { Task } from "../../../models/task.model.js";
import { Category } from "../../../models/category.model.js";

// ~=====================================|add task|===================================================
const addTask = errorHandler(async (req, res, next) => {
  // if task not added
  const task = new Task({ ...req.body, createdBy: req.user._id });
  task || next(new AppError("task not added", 404));
  if (req.body.relatedCategory && task) {
    const category = await Category.find(task.relatedCategory);
    category[0].tasks.push(task._id);
    await category[0].save();
    await task.save();
    // if task is added
    task && res.status(201).json({ msg: "success", task });
  }
});
//~=====================================|get All tasks (public)|===================================================
const getAllTasks = errorHandler(async (req, res, next) => {
  const { page = 1, limit = 5 } = req.query;
  const skip = (page - 1) * limit;
  const tasks = await Task.find({ sharingStatus: "Public" })
    .skip(skip)
    .limit(limit);
  tasks.length && res.json({ msg: "success", tasks });
  tasks.length || next(new AppError("tasks not found", 404));
});
// ~=====================================|get task (public)|===================================================
const getTask = errorHandler(async (req, res, next) => {
  // if task found
  res.status(200).json({ msg: "success", task: req.task });
});
// ~=====================================|update task|===================================================
const updateTask = errorHandler(async (req, res, next) => {
  const { itemIndex } = req.query ?? null;
  if (itemIndex && req.body.items) {
    req.task.items[itemIndex - 1].taskBody =
      req.body.items[itemIndex - 1].taskBody ?? null;
  }
  req.task.items = req.body.items ?? req.task.items;
  req.task.taskBody = req.body.taskBody ?? req.task.taskBody;
  req.task.type = req.body.type ?? req.task.type;
  req.task.relatedCategory =
    req.body.relatedCategory ?? req.task.relatedCategory;
  req.task.sharingStatus = req.body.sharingStatus ?? req.task.sharingStatus;
  await req.task.save();
  req.task && res.status(201).json({ msg: "success", task: req.task });
});
// ~=====================================|delete task|===================================================
const deleteTask = errorHandler(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (task) {
    const categories = await Category.findOneAndUpdate(
      { tasks: task._id },
      { $pull: { tasks: task._id } },
      { new: true }
    );
    res.status(200).json({ msg: "task deleted", task });
  }
  task ?? next(new AppError(`task not found`, 404));
});
//~=====================================|get All tasks (Private)|===================================================
const getAllPrivateTasks = errorHandler(async (req, res, next) => {
  const { page = 1, limit = 5 } = req.query;
  const skip = (page - 1) * limit;
  const tasks = await Task.find({
    sharingStatus: "Private",
    createdBy: req.user._id,
  })
    .skip(skip)
    .limit(limit);
  tasks.length && res.json({ msg: "success", tasks });
  tasks.length || next(new AppError("tasks not found", 404));
});
// ~=====================================|get task (Private)|===================================================
const getPrivateTask = errorHandler(async (req, res, next) => {
  // if category found
  const task = await Task.findOne({
    sharingStatus: "Private",
    _id: req.params.id,
    createdBy: req.user._id,
  });
  task ?? next(new AppError("task not found", 404));
  task && res.status(200).json({ msg: "success", task });
});

export {
  addTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
  getPrivateTask,
  getAllPrivateTasks,
};
