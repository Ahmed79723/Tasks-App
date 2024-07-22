import categoryRouter from "./categories/category.routes.js";
import taskRouter from "./Tasks/task.routes.js";
import userRouter from "./Users/user.routes.js";

export const globalRoutes = (app) => {
  app.use("/users", userRouter);
  app.use("/categories", categoryRouter);
  app.use("/tasks", taskRouter);
};
