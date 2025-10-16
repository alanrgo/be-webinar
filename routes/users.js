import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  loginUser,
} from "../controller/users.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:userId", getUserById);
router.post("/", createUser);
router.patch("/me", updateUserProfile);
router.patch("/me/avatar", updateUserAvatar);
router.post("/login", loginUser);

export default router;
