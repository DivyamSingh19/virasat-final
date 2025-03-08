import { PrismaClient } from '@prisma/client';
import Razorpay from 'razorpay';
 
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

 
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, isPaid, price, adminId } = req.body;

    if (isPaid && !price) {
      return res.status(400).json({ error: 'Price is required for paid events' });
    }

    
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'events',  
        resource_type: 'image',
      });
      imageUrl = result.secure_url;  
    }

     
    const event = await prisma.event.create({
      data: {
        title,
        description,
        featuredImage: imageUrl,
        date,
        isPaid,
        price: isPaid ? price : null,
        adminId,
      },
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 
export const registerForEvent = async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.isPaid) {
      const payment = await razorpay.orders.create({
        amount: event.price * 100,  
        currency: 'INR',
        receipt: `receipt_${eventId}_${userId}`,
      });

      return res.status(200).json({ payment, message: 'Payment required to register' });
    }

     
    await prisma.registration.create({
      data: { eventId, userId },
    });

    res.status(200).json({ message: 'Registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
