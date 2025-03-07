import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

 
export const createPost = async (req, res) => {
  try {
    const { title, description, image: featuredImage } = req.body;
    const userId = req.user.id; // Extracted from JWT

    if (!title || !description || !featuredImage) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const post = await prisma.posts.create({
      data: {
        title,
        description,
        image: featuredImage,
        userId, 
      },
    });

    res.status(201).json({ success: true, post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

 
export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.posts.findMany();
    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

 
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.posts.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

 
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;
    const userId = req.user.id;

    const post = await prisma.posts.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

     
    if (post.userId !== userId && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const updatedPost = await prisma.posts.update({
      where: { id },
      data: { title, description, image },
    });

    res.status(200).json({ success: true, updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

 
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await prisma.posts.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Only the creator or Admin can delete
    if (post.userId !== userId && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await prisma.posts.delete({ where: { id } });

    res.status(200).json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
