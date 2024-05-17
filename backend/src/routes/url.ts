import { isAuthenticated } from "../middleware/isAuthenticated";
import {
  generateNewShortUrl,
  getAllShortUrls,
  getAnalytics,
} from "../controllers/url";
import express from "express";
import { isOwner } from "../middleware/isOwner";

const router = express.Router();

router.post("/", isAuthenticated, generateNewShortUrl);
router.get("/", isAuthenticated, getAllShortUrls);
router.get("/:shortId", isAuthenticated, isOwner, getAnalytics);

export default router;
