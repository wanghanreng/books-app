import express from "express";
import {
  createComment,
  getComment,
  updateComment,
  deleteComment,
  getCommentsByUser,
  getCommentsByBook
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/", createComment);
router.get("/:id", getComment);
router.get("/users/:userId", getCommentsByUser);
router.get("/books/:bookId", getCommentsByBook);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;