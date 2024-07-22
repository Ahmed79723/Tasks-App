import mongoose, { Schema, model } from "mongoose";
import slugify from "slugify";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: false,
      minLength: [3, "category name can't be less than 3 characters"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      unique: false,
    },
    tasks: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Task",
      },
    ],
    addedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
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
  }
);

categorySchema.pre("init", (doc) => {
  doc.slug = slugify(doc.name);
});
export const Category = model("Category", categorySchema);
