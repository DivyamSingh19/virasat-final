// controllers/eventController.js
const prisma = require('../prisma/client');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to upload image to Cloudinary
const uploadImage = async (imageFile) => {
  try {
    const result = await cloudinary.uploader.upload(imageFile, {
      folder: 'events',
      use_filename: true,
      unique_filename: true,
    });
    return result.secure_url;
  } catch (error) {
    throw new Error(`Error uploading image: ${error.message}`);
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch events: ${error.message}` });
  }
};

// Get a single event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: req.params.id
      },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch event: ${error.message}` });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, isPaid, price, adminId } = req.body;
    
    // Validate required fields
    if (!title || !description || !date || !adminId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Validate price if event is paid
    if (isPaid && (price === undefined || price <= 0)) {
      return res.status(400).json({ error: 'Paid events must have a valid price greater than 0' });
    }
    
    // Validate the image is provided
    if (!req.file) {
      return res.status(400).json({ error: 'Featured image is required' });
    }
    
    // Upload image to Cloudinary
    const featuredImage = await uploadImage(req.file.path);
    
    // Create the event
    const event = await prisma.event.create({
      data: {
        title,
        description,
        featuredImage,
        date: new Date(date),
        isPaid: isPaid || false,
        price: isPaid ? parseFloat(price) : null,
        adminId
      }
    });
    
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: `Failed to create event: ${error.message}` });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const { title, description, date, isPaid, price } = req.body;
    const eventId = req.params.id;
    
    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: {
        id: eventId
      }
    });
    
    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Validate price if event is paid
    if (isPaid && (price === undefined || price <= 0)) {
      return res.status(400).json({ error: 'Paid events must have a valid price greater than 0' });
    }
    
    // Prepare update data
    const updateData = {
      title: title || existingEvent.title,
      description: description || existingEvent.description,
      date: date ? new Date(date) : existingEvent.date,
      isPaid: isPaid !== undefined ? isPaid : existingEvent.isPaid,
      price: isPaid ? parseFloat(price) : null,
      updatedAt: new Date()
    };
    
    // Handle image update if provided
    if (req.file) {
      updateData.featuredImage = await uploadImage(req.file.path);
    }
    
    // Update the event
    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId
      },
      data: updateData
    });
    
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: `Failed to update event: ${error.message}` });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    
    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: {
        id: eventId
      }
    });
    
    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Delete the event
    await prisma.event.delete({
      where: {
        id: eventId
      }
    });
    
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: `Failed to delete event: ${error.message}` });
  }
};