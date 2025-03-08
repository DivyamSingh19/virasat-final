import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a comment (All roles can comment)
export const createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const userId = req.user.id;

    if (!content || !postId) {
      return res.status(400).json({ success: false, message: "Content and postId are required" });
    }

    const comment = await prisma.comment.create({
      data: { content, postId, userId },
    });

    res.status(201).json({ success: true, comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Get all comments for a post
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: { user: { select: { id: true, name: true, role: true } } }, // Include user role
    });

    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Update a comment (Only the owner can update)
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    // Only the comment owner can update
    if (comment.userId !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const updatedComment = await prisma.comment.update({ where: { id }, data: { content } });

    res.status(200).json({ success: true, updatedComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Delete a comment (Owner OR Admin can delete)
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    // Allow only the owner OR admin to delete
    if (comment.userId !== userId && userRole !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await prisma.comment.delete({ where: { id } });

    res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
