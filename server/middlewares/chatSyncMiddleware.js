// server/middleware/chatSync.middleware.js
import streamChatController from "../controllers/streamChatController"
 

/**
 * Middleware to sync user changes with Stream.io
 * Add this to your user update routes
 */
exports.syncWithStreamAfterUpdate = (role) => {
  return async (req, res, next) => {
    // Store original response send function
    const originalSend = res.send;
    
    // Override send function
    res.send = function(body) {
      // If operation was successful and we have a user ID
      try {
        const data = JSON.parse(body);
        if (data && data.id) {
          // Sync with Stream asynchronously (don't await)
          streamChatController.syncUserWithStream(data.id, role);
        }
      } catch (e) {
        // If body isn't JSON or parsing fails, just continue
      }
      
      // Call original send function
      originalSend.apply(res, arguments);
    };
    
    next();
  };
};

/**
 * Add this to your user creation flow to create a chat user automatically
 */
exports.createChatUserAfterRegistration = (role) => {
  return async (req, res, next) => {
    // Store original response send function
    const originalSend = res.send;
    
    // Override send function
    res.send = function(body) {
      // If operation was successful and we have a user ID
      try {
        const data = JSON.parse(body);
        if (data && data.id) {
          // Create chat user and sync with Stream asynchronously
          const { PrismaClient } = require('@prisma/client');
          const prisma = new PrismaClient();
          
          // Create a function to execute asynchronously
          const createChatUser = async () => {
            try {
              const streamUserId = `${role.toLowerCase()}_${data.id}`;
              
              await prisma.chatUser.create({
                data: {
                  streamUserId,
                  ...(role === 'STUDENT' 
                    ? { student: { connect: { id: data.id } } } 
                    : { alumni: { connect: { id: data.id } } }
                  )
                }
              });
              
              // Sync with Stream
              await streamChatController.syncUserWithStream(data.id, role);
              
              console.log(`Chat user created for ${role} with ID ${data.id}`);
            } catch (error) {
              console.error(`Error creating chat user for ${role}:`, error);
            }
          };
          
          // Execute without awaiting (fire and forget)
          createChatUser();
        }
      } catch (e) {
        // If body isn't JSON or parsing fails, just continue
      }
      
      // Call original send function
      originalSend.apply(res, arguments);
    };
    
    next();
  };
};