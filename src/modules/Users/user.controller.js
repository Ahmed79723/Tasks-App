import { User } from "../../../models/user.model.js";
import { Task } from "../../../models/task.model.js";
import { Category } from "../../../models/category.model.js";
import { errorHandler } from "../../middleWares/errorHandler.js";
import { AppError } from "../../utils/appError.js";
import bcrypt from "bcrypt";

// ~=====================================|signup|===================================================
const signup = errorHandler(async (req, res, next) => {
  const user = new User(req.body);
  await user.save();
  user &&
    res
      .status(201)
      .json({ msg: "User registered successfully", _id: user._id });
  user ?? next(new AppError(`Error registering user`, 400));
});
// ~=====================================|signin|===================================================
const signin = errorHandler(async (req, res) => {
  res.status(200).json({
    msg: `Welcome back ${req.user.username}`,
    _id: req.user._id,
  });
});
// ~=====================================|get User|===================================================
const getUser = errorHandler(async (req, res, next) => {
  // to make sure only the owner of the account can get his account data
  const user = await User.findById(req.params.id);
  user.password = undefined;
  user && res.json({ msg: "success", user });
  user ?? next(new AppError("User Not found", 404));
});
// ~=====================================|update User|===================================================
const updateUser = errorHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  user && res.json({ msg: "success", user });
  user || next(new AppError("error updating user", 400));
});
// ~=====================================|delete User|===================================================
const deleteUser = errorHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (user) {
    // finding all user categories
    const categories = await Category.find({ addedBy: user._id });
    for (const category of categories) {
      // deleting all category tasks
      await Task.deleteMany({ createdBy: user._id });
    }
    // delete all related company jobs
    await Category.deleteMany({ addedBy: user._id });
    res.status(200).json({ msg: "user deleted successfully", user });
  }
  user ?? next(new AppError("user not found", 404));
});
// ~=====================================|get Users|===================================================
const getUsers = errorHandler(async (req, res, next) => {
  let secUsers = [];
  const users = await User.find();
  for (const user of users) {
    user.password = undefined;
    secUsers.push(user);
  }
  users.length && res.json({ msg: "success", secUsers });
  users.length || next(new AppError("no users found", 404));
});


export {
  signup,
  signin,
  getUser,
  updateUser,
  deleteUser,
  getUsers,
};
