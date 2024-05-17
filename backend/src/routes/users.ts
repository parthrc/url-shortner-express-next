import { isOwner } from "../middleware/isOwner";
import {
  deleteUser,
  getAllUsers,
  getUserByEmail,
  getUser,
  updateUser,
} from "../controllers/userController";
import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/email", getUserByEmail);
router.get("/:id", getUser);
router.delete("/:id", isAuthenticated, isOwner, deleteUser);
router.patch("/:id", isAuthenticated, isOwner, updateUser);

export default router;
