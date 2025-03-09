// server/controllers/streamChat.controller.js

const { StreamChat } = require('stream-chat');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Initialize Stream client with your API key and secret
const streamClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

/**
 * Generate a Stream chat token for authenticated users
 */
exports.generateToken = async (req, res) => {
  try {
    // Get user from the authenticated request
    const { id, role } = req.user; // Assuming your auth middleware adds user with id and role to req
    
    if (!id || !role || (role !== 'STUDENT' && role !== 'ALUMNI')) {
      return res.status(400).json({ error: 'Invalid user information' });
    }

    // Find or create ChatUser record
    let chatUser = await prisma.chatUser.findFirst({
      where: role === 'STUDENT' 
        ? { studentId: id } 
        : { alumniId: id },
      include: {
        student: true,
        alumni: true
      }
    });

    // If no chat user exists, create one
    if (!chatUser) {
      // Get user data based on role
      const userData = role === 'STUDENT'
        ? await prisma.student.findUnique({ where: { id } })
        : await prisma.alumni.findUnique({ where: { id } });
      
      if (!userData) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Create a unique Stream user ID
      const streamUserId = `${role.toLowerCase()}_${id}`;
      
      // Create chat user record
      chatUser = await prisma.chatUser.create({
        data: {
          streamUserId,
          ...(role === 'STUDENT' 
            ? { student: { connect: { id } } } 
            : { alumni: { connect: { id } } }
          )
        },
        include: {
          student: true,
          alumni: true
        }
      });
    }

    // Get user details - either from student or alumni
    const user = chatUser.student || chatUser.alumni;
    
    // Create a token for the user
    const token = streamClient.createToken(chatUser.streamUserId);
    
    // Prepare user data for Stream.io
    const streamUserData = {
      id: chatUser.streamUserId,
      name: user.fullName,
      role: role.toLowerCase(),
      image: `https://getstream.io/random_png/?id=${chatUser.streamUserId}&name=${user.fullName}`,
      graduationYear: user.graduationYear,
      branch: user.branch
    };
    
    // Upsert the user in Stream
    await streamClient.upsertUser(streamUserData);
    
    return res.status(200).json({ 
      token,
      user: streamUserData
    });
  } catch (error) {
    console.error('Error generating Stream token:', error);
    return res.status(500).json({ error: 'Failed to generate chat token' });
  }
};

/**
 * Create a new Stream chat channel
 */
exports.createChannel = async (req, res) => {
  try {
    const { channelType, channelId, channelName, members } = req.body;
    const { id, role } = req.user; // From auth middleware
    
    if (!channelType || !members || !Array.isArray(members)) {
      return res.status(400).json({ error: 'Channel type and members array are required' });
    }

    // Get creator's chat user
    const creatorChatUser = await prisma.chatUser.findFirst({
      where: role === 'STUDENT' 
        ? { studentId: id } 
        : { alumniId: id }
    });
    
    if (!creatorChatUser) {
      return res.status(404).json({ error: 'Chat user not found. Please generate a token first.' });
    }

    // Ensure requested members exist in your database
    // Members should be in format: { id: "user-id", role: "STUDENT" or "ALUMNI" }
    if (!members.every(m => m.id && (m.role === 'STUDENT' || m.role === 'ALUMNI'))) {
      return res.status(400).json({ error: 'Each member must have id and role (STUDENT or ALUMNI)' });
    }

    // Get chat users for all members
    const memberChatUsers = await Promise.all(
      members.map(async ({ id: memberId, role: memberRole }) => {
        const chatUser = await prisma.chatUser.findFirst({
          where: memberRole === 'STUDENT' 
            ? { studentId: memberId } 
            : { alumniId: memberId }
        });
        
        return chatUser;
      })
    );
    
    // Filter out null values and extract Stream user IDs
    const validMemberChatUsers = memberChatUsers.filter(Boolean);
    const streamMemberIds = validMemberChatUsers.map(user => user.streamUserId);
    
    // Add creator to members if not already included
    if (!streamMemberIds.includes(creatorChatUser.streamUserId)) {
      streamMemberIds.push(creatorChatUser.streamUserId);
    }
    
    // Create a channel ID if not provided
    const finalChannelId = channelId || `${channelType}-${Date.now()}`;
    
    // Create the channel in Stream
    const channel = streamClient.channel(channelType, finalChannelId, {
      name: channelName || finalChannelId,
      created_by_id: creatorChatUser.streamUserId,
      members: streamMemberIds,
    });
    
    await channel.create();
    
    // Store channel in your database
    const dbChannel = await prisma.chatChannel.create({
      data: {
        channelId: finalChannelId,
        channelType,
        name: channelName || finalChannelId,
        creator: { connect: { id: creatorChatUser.id } },
        members: {
          create: validMemberChatUsers.map(chatUser => ({
            user: { connect: { id: chatUser.id } }
          }))
        }
      },
      include: {
        members: {
          include: {
            user: true
          }
        }
      }
    });
    
    return res.status(201).json({ 
      channel: dbChannel
    });
  } catch (error) {
    console.error('Error creating channel:', error);
    return res.status(500).json({ error: 'Failed to create chat channel', details: error.message });
  }
};

/**
 * Get channels for the authenticated user
 */
exports.getUserChannels = async (req, res) => {
  try {
    const { id, role } = req.user;
    
    // Find user's chat identity
    const chatUser = await prisma.chatUser.findFirst({
      where: role === 'STUDENT' 
        ? { studentId: id } 
        : { alumniId: id }
    });
    
    if (!chatUser) {
      return res.status(404).json({ error: 'Chat user not found' });
    }
    
    // Get channels from your database
    const userChannels = await prisma.chatChannel.findMany({
      where: {
        members: {
          some: {
            userId: chatUser.id
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              include: {
                student: {
                  select: {
                    id: true,
                    fullName: true,
                    username: true,
                    branch: true,
                    graduationYear: true
                  }
                },
                alumni: {
                  select: {
                    id: true,
                    fullName: true,
                    username: true,
                    branch: true,
                    graduationYear: true
                  }
                }
              }
            }
          }
        },
        creator: {
          include: {
            student: {
              select: {
                id: true,
                fullName: true,
                username: true
              }
            },
            alumni: {
              select: {
                id: true,
                fullName: true,
                username: true
              }
            }
          }
        }
      }
    });
    
    return res.status(200).json({ channels: userChannels });
  } catch (error) {
    console.error('Error fetching user channels:', error);
    return res.status(500).json({ error: 'Failed to fetch user channels' });
  }
};

/**
 * When a user is created or updated, sync their data with Stream.io
 */
exports.syncUserWithStream = async (userId, userRole) => {
  try {
    // Find user's chat data
    const chatUser = await prisma.chatUser.findFirst({
      where: userRole === 'STUDENT' 
        ? { studentId: userId } 
        : { alumniId: userId },
      include: {
        student: true,
        alumni: true
      }
    });
    
    if (!chatUser) {
      console.log(`No chat user found for ${userRole} with ID ${userId}`);
      return;
    }
    
    const user = chatUser.student || chatUser.alumni;
    
   
    await streamClient.upsertUser({
      id: chatUser.streamUserId,
      name: user.fullName,
      role: userRole.toLowerCase(),
      image: `https://getstream.io/random_png/?id=${chatUser.streamUserId}&name=${user.fullName}`,
      graduationYear: user.graduationYear,
      branch: user.branch
    });
    
    console.log(`${userRole} with ID ${userId} synced with Stream`);
  } catch (error) {
    console.error(`Error syncing ${userRole} with Stream:`, error);
  }
};