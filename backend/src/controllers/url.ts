import { nanoid } from "nanoid";
import express from "express";
import { UrlModel } from "../db/urls";
import { get } from "lodash";
import { getUserById } from "./userController";

export const generateNewShortUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const body = req.body;

    if (!body.url) {
      return res.status(400).json({ error: "url is required" });
    }

    // get currently logged in user
    const currentUser = get(req, "identity._id") as string;
    console.log(currentUser);

    // generate shortId
    const shortId = nanoid(8);

    const newLink = await UrlModel.create({
      shortId: shortId,
      redirectUrl: body.url,
      visitHistory: [],
      owner: currentUser,
    });
    console.log("Link=", newLink);
    const user = await getUserById(currentUser);
    user.links.push(newLink._id);
    user.save();
    console.log(user);

    return res.json({ msg: "short url generated successfully", id: shortId });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getAllShortUrls = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const urls = await UrlModel.find();

    if (!urls) {
      return res.status(200).json({ msg: "No urls found!" });
    }

    return res
      .status(200)
      .json({ msg: "Urls fetched successfully", data: urls });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getAnalytics = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const shortId = req.params.shortId;

    const result = await UrlModel.findOne({ shortId });
    console.log(result);

    if (!result) {
      return res.status(400).json({ msg: "Invalid shortId" });
    }

    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
