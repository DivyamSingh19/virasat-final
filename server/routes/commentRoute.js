import express from "express";
import { createComment, getCommentsByPost, updateComment, deleteComment } from "../controllers/commentController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const commentRouter = express.Router();

commentRouter.post("/", protect, createComment);
commentRouter.get("/:postId", getCommentsByPost);
commentRouter.put("/:id", protect, updateComment);
commentRouter.delete("/:id", protect, deleteComment); // Admin OR owner can delete

export default commentRouter;
 