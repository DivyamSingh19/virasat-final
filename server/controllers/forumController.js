import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

 
export const isAdminOrAlumni = async (req, res, next) => {
  try {
    if (req.user && (req.user.isAdmin || req.user.role === 'ALUMNI')) {
      next();
    } else {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied: Only admins and alumni can perform this action" 
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

 
export const createForumPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    
    const newForumPost = await prisma.forumPost.create({
      data: {
        title,
        content,
        postedBy: { connect: { id: req.user.id } },
        tags: tags || [],
      },
    });
    
    res.status(201).json({ 
      success: true, 
      message: "Forum post created successfully", 
      post: newForumPost 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

 
export const getAllForumPosts = async (req, res) => {
  try {
    const posts = await prisma.forumPost.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        postedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    
    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

 
export const getForumPostById = async (req, res) => {
  try {
    const post = await prisma.forumPost.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        postedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    
    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

 
export const updateForumPost = async (req, res) => {
  try {
     
    const existingPost = await prisma.forumPost.findUnique({
      where: { id: req.params.id },
      include: { postedBy: { select: { id: true } } },
    });
    
    if (!existingPost) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    
    
    if (existingPost.postedBy.id !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: "You can only update your own posts" 
      });
    }
    
    const updatedPost = await prisma.forumPost.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });
    
    res.status(200).json({ 
      success: true, 
      message: "Post updated successfully", 
      post: updatedPost 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

 
export const deleteForumPost = async (req, res) => {
  try {
     
    const existingPost = await prisma.forumPost.findUnique({
      where: { id: req.params.id },
      include: { postedBy: { select: { id: true } } },
    });
    
    if (!existingPost) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    
    
    if (existingPost.postedBy.id !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: "You can only delete your own posts" 
      });
    }
    
    await prisma.forumPost.delete({
      where: {
        id: req.params.id,
      },
    });
    
    res.status(200).json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};