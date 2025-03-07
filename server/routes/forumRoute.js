import express from 'express';
import { protect } from '../middlewares/protect.js';
import { isAdminOrAlumni, createForumPost, getAllForumPosts, getForumPostById, updateForumPost, deleteForumPost } from '../controllers/forumController.js';

const forumRouter = express.Router();

 
forumRouter.get('/forum', getAllForumPosts);
forumRouter.get('/forum/:id', getForumPostById);

 
forumRouter.post('/forum-create', protect, isAdminOrAlumni, createForumPost);
forumRouter.put('/forum-update/:id', protect, isAdminOrAlumni, updateForumPost);
forumRouter.delete('/forum-delete/:id', protect, isAdminOrAlumni, deleteForumPost);

export default forumRouter;