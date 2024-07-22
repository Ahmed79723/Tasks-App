import Joi from "joi";

const addTaskValSchema = Joi.object().keys({
  type: Joi.string().valid("TextTask", "ListTask").required(),
  taskBody: Joi.alternatives().conditional("type", {
    is: "TextTask",
    then: Joi.string(),
    otherwise: Joi.forbidden(),
  }),
  items: Joi.alternatives().conditional("type", {
    is: "ListTask",
    then: Joi.array()
      .items(Joi.object({ taskBody: Joi.string().required() }))
      .required(),
    otherwise: Joi.forbidden(),
  }),
  sharingStatus: Joi.string().valid("Public", "Private"),
  relatedCategory: Joi.string().custom((value, helpers) => {
    if (value === "" || /^[0-9a-fA-F]{24}$/.test(value)) {
      return value;
    }
    return helpers.message(
      "relatedCategory must be an empty string or a 24-character hexadecimal string"
    );
  }),
});
// ========================================================================================
const updateTaskVal = Joi.object({
  type: Joi.string().valid("TextTask", "ListTask").required(),
  taskBody: Joi.alternatives().conditional("type", {
    is: "TextTask",
    then: Joi.string(),
    otherwise: Joi.forbidden(),
  }),
  items: Joi.alternatives().conditional("type", {
    is: "ListTask",
    then: Joi.array().items(Joi.object({ taskBody: Joi.string().required() })),
    otherwise: Joi.forbidden(),
  }),
  sharingStatus: Joi.string().valid("Public", "Private"),
  relatedCategory: Joi.string().custom((value, helpers) => {
    if (value === "" || /^[0-9a-fA-F]{24}$/.test(value)) {
      return value;
    }
    return helpers.message(
      "relatedCategory must be an empty string or a 24-character hexadecimal string"
    );
  }),
  id: Joi.string().hex().length(24).required(),
  itemIndex: Joi.number().min(0),
});

export { addTaskValSchema, updateTaskVal };
