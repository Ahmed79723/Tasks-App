import { Router } from "express";
import * as categoryController from "./category.controller.js";
import globalValidator from "../../middleWares/globalValidator.js";
import { addCatVal, updateCatVal } from "./category.validation.js";
import basicAuth from "../../middleWares/basicHTTPAuthMW.js";
import { allCatMW } from "../../middleWares/allCatMW.js";
import { addCatDataMW } from "../../middleWares/addCatDataMW.js";

const categoryRouter = Router();

//? =====================================|all Private Categories|==================================================
categoryRouter.get(
  "/privateCategories",
  basicAuth,
  categoryController.getAllPrivateCats
);
//? =====================================|get All Categories by name (public)|==================================================
categoryRouter.get(
  "/filterCatsByName",
  categoryController.getPublicCatsByName
);
//? =====================================|get All Categories (public)|===================================================
categoryRouter.get("/", categoryController.getAllCategories);
//? =====================================|get Category (public)|===================================================
categoryRouter.get("/:id", allCatMW, categoryController.getCategory);
// &=====================================|global MW|===================================================
categoryRouter.use(basicAuth);
//? =====================================|Private Category|==================================================
categoryRouter.get(
  "/privateCategory/:id",
  globalValidator(updateCatVal),
  categoryController.getPrivateCat
);
//? ========================================|add Category|===============================================
categoryRouter
  .route("/")
  .post(
    allCatMW,
    globalValidator(addCatVal),
    addCatDataMW,
    categoryController.addCategory
  );

categoryRouter
  .route("/:id")
  .put(
    allCatMW,
    globalValidator(updateCatVal),
    addCatDataMW,
    categoryController.updateCategory
  )
  .delete(
    allCatMW,
    globalValidator(updateCatVal),
    categoryController.deleteCategory
  );

export default categoryRouter;
