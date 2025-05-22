import express from "express";
import {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  getBooksByCategory,
} from "../controllers/bookController.js";

const router = express.Router();

router.post("/", createBook);
router.get("/books", getBooks);
router.get("/:id", getBook);
router.get("/categories/:categoryId", getBooksByCategory);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;