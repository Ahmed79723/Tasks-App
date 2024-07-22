import { User } from "../../models/user.model.js";
import { AppError } from "../utils/appError.js";
import { errorHandler } from "./errorHandler.js";

const basicAuth = errorHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.setHeader("WWW-Authenticate", 'Basic realm="example"');
    return next(new AppError("Authentication required", 401));
  }

  const [scheme, credentials] = authHeader.split(" ");

  if (scheme !== "Basic") {
    return next(new AppError("Bad request", 400));
  }

  const [username, password] = Buffer.from(credentials, "base64")
    .toString()
    .split(":");

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return next(new AppError("Invalid credentials", 401));
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return next(new AppError("Invalid credentials", 401));
    }

    req.user = user; // Attach user to request object
    next();
  } catch (err) {
    return next(new AppError(err, 500));
  }
});

export default basicAuth;
