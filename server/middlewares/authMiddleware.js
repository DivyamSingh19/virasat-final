import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Handle different user types based on token data
      if (decoded.type === "student") {
        const student = await prisma.student.findUnique({
          where: { id: decoded.id }
        });
        
        if (!student) {
          return res.status(401).json({ success: false, message: "Invalid authentication token" });
        }
        
        req.user = {
          id: student.id,
          role: "STUDENT",
          name: student.name,
          // Add other needed fields
        };
      } else if (decoded.type === "alumni") {
        const alumni = await prisma.alumni.findUnique({
          where: { id: decoded.id }
        });
        
        if (!alumni) {
          return res.status(401).json({ success: false, message: "Invalid authentication token" });
        }
        
        req.user = {
          id: alumni.id,
          role: "ALUMNI",
          name: alumni.name,
          // Add other needed fields
        };
      } else if (decoded.type === "admin") {
        const admin = await prisma.admin.findUnique({
          where: { id: decoded.id }
        });
        
        if (!admin) {
          return res.status(401).json({ success: false, message: "Invalid authentication token" });
        }
        
        req.user = {
          id: admin.id,
          role: "ADMIN",
          name: admin.name,
          // Add other needed fields
        };
      } else {
        return res.status(401).json({ success: false, message: "Invalid user type" });
      }
      
      // Generate Stream token for the authenticated user
      const streamToken = streamClient.createToken(req.user.id.toString());
      req.streamToken = streamToken;
      
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      return res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Admin access required" });
  }
};
