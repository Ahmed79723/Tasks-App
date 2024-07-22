import mongoose, { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    type: { type: String, required: true, enum: ["TextTask", "ListTask"] },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    relatedCategory: {
      type: mongoose.Types.ObjectId,
      default: "",
      ref: "Category",
    },
    sharingStatus: {
      type: String,
      enum: ["Public", "Private"],
      default: "Public",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    discriminatorKey: "type",
    collection: "tasks",
  }
);
// Text Task Schema
const textTaskSchema = new Schema({
  taskBody: {
    type: String,
    required: true,
    minLength: [3, "task body can't be less than 3 characters"],
  },
});

// List Task Schema
const listTaskSchema = new Schema({
  items: [
    {
      taskBody: {
        type: String,
        required: true,
        minLength: [3, "task body can't be less than 3 characters"],
      },
      _id: false,
    },
  ],
});

const Task = model("Task", taskSchema);
const TextTask = Task.discriminator("TextTask", textTaskSchema);
const ListTask = Task.discriminator("ListTask", listTaskSchema);

export { Task, TextTask, ListTask };
