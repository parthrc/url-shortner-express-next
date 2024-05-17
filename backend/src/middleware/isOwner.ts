import { UrlModel } from "../db/urls";
import express from "express";
import { get, identity } from "lodash";

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const shortId = req.params.shortId;
    const url = await UrlModel.findOne({ shortId });

    const currentUserId = get(req, "identity._id") as string;
    console.log(currentUserId);

    if (!currentUserId) {
      return res.status(400).json({ msg: "Not authenticated" });
    }

    if (currentUserId.toString() !== url.owner.toString()) {
      return res.status(403).json({ msg: "Not owner" });
    }

    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Error checking ownership" });
  }
};
