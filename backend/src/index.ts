import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
require("dotenv").config();

import urlRoutes from "./routes/url";
import { UrlModel } from "./db/urls";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";

const app = express();

app.use(
  cors({
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());

// ROUTES
app.use("/url", urlRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

// Visiting a short url
app.get("/:shortId", async (req: express.Request, res: express.Response) => {
  const shortId = req.params.shortId;

  const entry = await UrlModel.findOne({ shortId });
  if (!entry) {
    return res.status(400).json({ msg: "Specified URL not found!" });
  }
  const updatedEntry = await UrlModel.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    }
  );

  res.redirect(updatedEntry.redirectUrl);
});

// DATABASE
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));

export default app;
