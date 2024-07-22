import { Router } from "express";
import * as userValSchemas from "./userValidation.js";
import * as userController from "./user.controller.js";
import globalValidator from "../../middleWares/globalValidator.js";
import basicAuth from "../../middleWares/basicHTTPAuthMW.js";
import { usersAuthMW } from "../../middleWares/usersAuthMW.js";

const userRouter = Router();
// ?=====================================|signup|===================================================
userRouter.post(
  "/auth/signup",
  globalValidator(userValSchemas.sigUpValSchema),
  userController.signup
);
// ?=====================================|get User|===================================================
userRouter.get(
  "/getUser/:id",
  globalValidator(userValSchemas.updateValSchema),
  userController.getUser
);
// ?=====================================|get Users|===================================================
userRouter.get("/getUsers", userController.getUsers);
// &=====================================|global MW|===================================================
userRouter.use(basicAuth);
// ?=====================================|signin|===================================================
userRouter.post("/auth/signin", userController.signin);
// ?=====================================|update User|===================================================
userRouter.put(
  "/update/:id",
  globalValidator(userValSchemas.updateValSchema),
  usersAuthMW,
  userController.updateUser
);
// ?=====================================|delete User|===================================================
userRouter.delete(
  "/delete/:id",
  globalValidator(userValSchemas.updateValSchema),
  usersAuthMW,
  userController.deleteUser
);


export default userRouter;
