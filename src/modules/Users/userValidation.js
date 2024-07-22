import Joi from "joi";

const sigUpValSchema = Joi.object({
  username: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[A-Z][A-Za-z0-9]{8,40}$/)
    .required(),
  rePassword: Joi.valid(Joi.ref("password")).required(),
});

const updateValSchema = Joi.object({
  username: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  password: Joi.string().pattern(/^[A-Z][A-Za-z0-9]{8,40}$/),
  id: Joi.string().hex().length(24).required(),
});

export {
  sigUpValSchema,
  updateValSchema,
};
