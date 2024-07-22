import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    // userCategories: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Category",
    //   },
    // ],
    // userTasks: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Task",
    //   },
    // ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save hook to hash passwords
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);
