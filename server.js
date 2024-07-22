//! =====================================|programmatic error handling|===================================================
process.on("uncaughtException", (err) => {
  console.log("error in code", err);
});
import { dbConnection } from "./dataBase/dbConnection.js";
import express from "express";
import { globalErrorMW } from "./src/middleWares/globalErrorMW.js";
import { AppError } from "./src/utils/appError.js";
import { globalRoutes } from "./src/modules/globalRoutes.js";
import categoryRouter from "./src/modules/categories/category.routes.js";
import { User } from "./models/user.model.js";
import jwt from "jsonwebtoken";

const app = express();
const port = 3007;
app.use(express.json());

globalRoutes(app);

//? =====================================|default end point|===================================================
app.get("/", (req, res) => res.send("Welcome to My Tasks App"));
//^ =====================================|404 end point|===================================================
app.use(
  "*",
  (req, res, next) =>
    next(new AppError(`route not found ${req.originalUrl}`, 404))
  // res.status(404).json({ msg: `route not found ${req.originalUrl}` })
  //^ new AppError(`route not found ${req.originalUrl}`,404)
  //^ this line is the error that is passed to the major where i receive it in the err param of error middle ware
);
//! =====================================|global error handler MW|===================================================
app.use(globalErrorMW);
//! =====================================|error handling outside express|===================================================
process.on("unhandledRejection", (err) => {
  console.log("unhandled rejection", err);
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
