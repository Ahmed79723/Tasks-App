import Joi from "joi";

const addCatVal = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  tasks: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  sharingStatus: Joi.string().valid("Public", "Private"),
});
const updateCatVal = Joi.object({
  name: Joi.string().min(3).max(20),
  tasks: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  sharingStatus: Joi.string().valid("Public", "Private"),
  id: Joi.string().hex().length(24),
});
export { addCatVal, updateCatVal };
