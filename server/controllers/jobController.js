import { PrismaClient } from '@prisma/client';
 
// Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const { expired } = req.query;
    
    // Filter options
    const filterOptions = {};
    
    // If expired query param is provided, filter by it
    if (expired !== undefined) {
      filterOptions.expired = expired === 'true';
    }
    
    const jobs = await prisma.job.findMany({
      where: filterOptions,
      include: {
        postedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch jobs: ${error.message}` });
  }
};

// Get a single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: {
        id: req.params.id
      },
      include: {
        postedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            graduationYear: true,
            company: true
          }
        }
      }
    });
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch job: ${error.message}` });
  }
};

// Create a new job
exports.createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary, postedById } = req.body;
    
    // Validate required fields
    if (!title || !description || !company || !location || !postedById) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create the job
    const job = await prisma.job.create({
      data: {
        title,
        description,
        company,
        location,
        salary: salary || 'Not specified',
        postedById
      }
    });
    
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: `Failed to create job: ${error.message}` });
  }
};

// Update a job
exports.updateJob = async (req, res) => {
  try {
    const { title, description, company, location, salary, expired } = req.body;
    const jobId = req.params.id;
    
    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: {
        id: jobId
      },
      include: {
        postedBy: true
      }
    });
    
    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    // Verify the alumni is updating their own job post
    if (existingJob.postedById !== req.alumni.id && !req.alumni.isAdmin) {
      return res.status(403).json({ error: 'You are not authorized to update this job posting' });
    }
    
    // Update the job
    const updatedJob = await prisma.job.update({
      where: {
        id: jobId
      },
      data: {
        title: title || existingJob.title,
        description: description || existingJob.description,
        company: company || existingJob.company,
        location: location || existingJob.location,
        salary: salary || existingJob.salary,
        expired: expired !== undefined ? expired : existingJob.expired,
        updatedAt: new Date()
      }
    });
    
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: `Failed to update job: ${error.message}` });
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    
    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: {
        id: jobId
      },
      include: {
        postedBy: true
      }
    });
    
    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    // Verify the alumni is deleting their own job post
    if (existingJob.postedById !== req.alumni.id && !req.alumni.isAdmin) {
      return res.status(403).json({ error: 'You are not authorized to delete this job posting' });
    }
    
    // Delete the job
    await prisma.job.delete({
      where: {
        id: jobId
      }
    });
    
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: `Failed to delete job: ${error.message}` });
  }
};

// Mark job as expired/active
exports.toggleJobStatus = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { expired } = req.body;
    
    if (expired === undefined) {
      return res.status(400).json({ error: 'Expired status is required' });
    }
    
    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: {
        id: jobId
      },
      include: {
        postedBy: true
      }
    });
    
    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    // Verify the alumni is updating their own job post
    if (existingJob.postedById !== req.alumni.id && !req.alumni.isAdmin) {
      return res.status(403).json({ error: 'You are not authorized to update this job posting' });
    }
    
    // Update the job status
    const updatedJob = await prisma.job.update({
      where: {
        id: jobId
      },
      data: {
        expired: Boolean(expired),
        updatedAt: new Date()
      }
    });
    
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: `Failed to update job status: ${error.message}` });
  }
};

// Get jobs posted by specific alumni
exports.getJobsByAlumni = async (req, res) => {
  try {
    const alumniId = req.params.alumniId;
    
    const jobs = await prisma.job.findMany({
      where: {
        postedById: alumniId
      },
      include: {
        postedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch jobs: ${error.message}` });
  }
};