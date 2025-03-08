
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyApiKey } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to verify server-to-server API key
router.use(verifyApiKey);

// Get chat history between a student and alumni
router.get('/api/chat/history', async (req, res) => {
  try {
    const { studentId, alumniId, limit = 50 } = req.query;
    
    if (!studentId || !alumniId) {
      return res.status(400).json({ error: 'Both studentId and alumniId are required' });
    }
    
    const messages = await prisma.chat.findMany({
      where: {
        OR: [
          {
            senderStudentId: studentId ,
            receiverAlumniId: alumniId
          },
          {
            senderAlumniId: alumniId ,
            receiverStudentId: studentId
          }
        ]
      },
      orderBy: {
        createdAt: 'asc'
      },
      take: parseInt(limit ) || 50,
      include: {
        senderStudent: {
          select: {
            id: true,
            name: true,
            profilePicture: true
          }
        },
        senderAlumni: {
          select: {
            id: true,
            name: true,
            profilePicture: true
          }
        }
      }
    });
    
    
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      message: msg.message,
      createdAt: msg.createdAt,
      sender: {
        id: msg.senderStudentId || msg.senderAlumniId,
        name: msg.senderStudent?.name || msg.senderAlumni?.name,
        type: msg.senderStudentId ? 'student' : 'alumni',
        profilePicture: msg.senderStudent?.profilePicture || msg.senderAlumni?.profilePicture
      }
    }));
    
    res.json(formattedMessages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

 
router.post('/api/chat/message', async (req, res) => {
  try {
    const { senderStudentId, receiverAlumniId, senderAlumniId, receiverStudentId, message } = req.body;
    
    if (
      (!senderStudentId && !senderAlumniId) || 
      (!receiverAlumniId && !receiverStudentId) ||
      (senderStudentId && senderAlumniId) ||
      (receiverAlumniId && receiverStudentId)
    ) {
      return res.status(400).json({ 
        error: 'Invalid sender/receiver configuration. Message must be between a student and an alumni.' 
      });
    }
    
    // Create chat message
    const chat = await prisma.chat.create({
      data: {
        message,
        senderStudentId,
        receiverAlumniId,
        senderAlumniId,
        receiverStudentId
      }
    });
    
    res.status(201).json(chat);
  } catch (error) {
    console.error('Error saving chat message:', error);
    res.status(500).json({ error: 'Failed to save chat message' });
  }
});

// Get list of conversations for a user
router.get('/api/chat/conversations/:userType/:userId', async (req, res) => {
  try {
    const { userType, userId } = req.params;
    
    let conversations = [];
    
    if (userType === 'student') {
      // Get all conversations where the student is sender or receiver
      const studentConversations = await prisma.$queryRaw`
        SELECT DISTINCT
          CASE
            WHEN c."receiverAlumniId" IS NOT NULL THEN c."receiverAlumniId"
            ELSE c."senderAlumniId"
          END as "alumniId",
          a."name" as "alumniName",
          a."profilePicture" as "alumniProfilePicture",
          (
            SELECT c2."message"
            FROM "Chat" c2
            WHERE (
              (c2."senderStudentId" = ${userId} AND c2."receiverAlumniId" = CASE
                WHEN c."receiverAlumniId" IS NOT NULL THEN c."receiverAlumniId"
                ELSE c."senderAlumniId"
              END)
              OR
              (c2."senderAlumniId" = CASE
                WHEN c."receiverAlumniId" IS NOT NULL THEN c."receiverAlumniId"
                ELSE c."senderAlumniId"
              END AND c2."receiverStudentId" = ${userId})
            )
            ORDER BY c2."createdAt" DESC
            LIMIT 1
          ) as "lastMessage",
          (
            SELECT c2."createdAt"
            FROM "Chat" c2
            WHERE (
              (c2."senderStudentId" = ${userId} AND c2."receiverAlumniId" = CASE
                WHEN c."receiverAlumniId" IS NOT NULL THEN c."receiverAlumniId"
                ELSE c."senderAlumniId"
              END)
              OR
              (c2."senderAlumniId" = CASE
                WHEN c."receiverAlumniId" IS NOT NULL THEN c."receiverAlumniId"
                ELSE c."senderAlumniId"
              END AND c2."receiverStudentId" = ${userId})
            )
            ORDER BY c2."createdAt" DESC
            LIMIT 1
          ) as "lastMessageTime"
        FROM "Chat" c
        LEFT JOIN "Alumni" a ON a."id" = CASE
          WHEN c."receiverAlumniId" IS NOT NULL THEN c."receiverAlumniId"
          ELSE c."senderAlumniId"
        END
        WHERE c."senderStudentId" = ${userId} OR c."receiverStudentId" = ${userId}
        ORDER BY "lastMessageTime" DESC
      `;
      
      conversations = studentConversations.map(conv => ({
        conversationId: `${userId}_${conv.alumniId}`,
        contact: {
          id: conv.alumniId,
          name: conv.alumniName,
          type: 'alumni',
          profilePicture: conv.alumniProfilePicture
        },
        lastMessage: conv.lastMessage, // Still encrypted
        lastMessageTime: conv.lastMessageTime
      }));
    } else if (userType === 'alumni') {
      // Get all conversations where the alumni is sender or receiver
      const alumniConversations = await prisma.$queryRaw`
        SELECT DISTINCT
          CASE
            WHEN c."receiverStudentId" IS NOT NULL THEN c."receiverStudentId"
            ELSE c."senderStudentId"
          END as "studentId",
          s."name" as "studentName",
          s."profilePicture" as "studentProfilePicture",
          (
            SELECT c2."message"
            FROM "Chat" c2
            WHERE (
              (c2."senderAlumniId" = ${userId} AND c2."receiverStudentId" = CASE
                WHEN c."receiverStudentId" IS NOT NULL THEN c."receiverStudentId"
                ELSE c."senderStudentId"
              END)
              OR
              (c2."senderStudentId" = CASE
                WHEN c."receiverStudentId" IS NOT NULL THEN c."receiverStudentId"
                ELSE c."senderStudentId"
              END AND c2."receiverAlumniId" = ${userId})
            )
            ORDER BY c2."createdAt" DESC
            LIMIT 1
          ) as "lastMessage",
          (
            SELECT c2."createdAt"
            FROM "Chat" c2
            WHERE (
              (c2."senderAlumniId" = ${userId} AND c2."receiverStudentId" = CASE
                WHEN c."receiverStudentId" IS NOT NULL THEN c."receiverStudentId"
                ELSE c."senderStudentId"
              END)
              OR
              (c2."senderStudentId" = CASE
                WHEN c."receiverStudentId" IS NOT NULL THEN c."receiverStudentId"
                ELSE c."senderStudentId"
              END AND c2."receiverAlumniId" = ${userId})
            )
            ORDER BY c2."createdAt" DESC
            LIMIT 1
          ) as "lastMessageTime"
        FROM "Chat" c
        LEFT JOIN "Student" s ON s."id" = CASE
          WHEN c."receiverStudentId" IS NOT NULL THEN c."receiverStudentId"
          ELSE c."senderStudentId"
        END
        WHERE c."senderAlumniId" = ${userId} OR c."receiverAlumniId" = ${userId}
        ORDER BY "lastMessageTime" DESC
      `;
      
      conversations = alumniConversations.map(conv => ({
        conversationId: `${conv.studentId}_${userId}`,
        contact: {
          id: conv.studentId,
          name: conv.studentName,
          type: 'student',
          profilePicture: conv.studentProfilePicture
        },
        lastMessage: conv.lastMessage, // Still encrypted
        lastMessageTime: conv.lastMessageTime
      }));
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }
    
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

export default router;

