 import jwt from "jsonwebtoken"
 import { PrismaClient } from "@prisma/client";
 

export const verifyAdmin = async (req, res, next) => {
  try {
    
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }
    
     
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
  
    const admin = await prisma.admin.findUnique({
      where: {
        id: decoded.id
      }
    });
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid token, authorization denied' });
    }
    
   
    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};