import express from "express";
import {
  createLibrary,
  getLibrary,
  deleteLibrary,
  getLibrarysByUser
} from "../controllers/libraryController.js";

const router = express.Router();

router.post("/", createLibrary);
router.get("/:id", getLibrary);
router.get("/users/:userId", getLibrarysByUser);
router.delete("/:id", deleteLibrary);

export default router;