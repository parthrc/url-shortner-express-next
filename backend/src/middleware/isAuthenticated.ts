import { getUserBySessionToken } from "../controllers/authControllers";
import express from "express";
import { identity, merge } from "lodash";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["SHADY_AUTH"];

    if (!sessionToken) {
      return res.status(400).json({ msg: "Not authenticated" });
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    // add currently authenticated user data to the request
    merge(req, { identity: existingUser });
  

    return next();
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ msg: "Error checking authentication status" });
  }
};
