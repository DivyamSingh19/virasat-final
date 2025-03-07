import { PrismaClient } from "@prisma/client";
import JWT from "jsonwebtoken";
import isAdmin from "../middlewares/isAdmin.js";
const prisma = new PrismaClient();

  
 
export const createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary } = req.body;

   
    if (!req.user || (req.user.role !== "ALUMNI" && !isAdmin(req))) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        company,
        location,
        salary,
        expired: false,
        postedById: req.user.role === "ALUMNI" ? req.user.id : null, // Admin won't have an ID in Alumni table
      },
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

 
export const getJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany();
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

 
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

 
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, company, location, salary } = req.body;

    const job = await prisma.job.findUnique({ where: { id } });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    
    if (req.user.role === "ALUMNI" && job.postedById !== req.user.id && !isAdmin(req)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: { title, description, company, location, salary },
    });

    res.status(200).json({ success: true, updatedJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

 
export const markJobAsExpired = async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await prisma.job.findUnique({ where: { id } });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

     
    if (req.user.role === "ALUMNI" && job.postedById !== req.user.id && !isAdmin(req)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: { expired: true },
    });

    res.status(200).json({ success: true, message: "Job marked as expired", updatedJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
