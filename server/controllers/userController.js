import { PrismaClient } from "@prisma/client";
import validator from "validator";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

const prisma = new PrismaClient();

const createToken = (id) => {
    return JWT.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user.id);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid Credentials" });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message || "An unknown error occurred" });
    }
};

const registerUser = async (req, res) => {
    try {
        const { username, email, password, prn_number, graduationYear } = req.body;

        // Ensure all fields are provided
        if (!username || !email || !password || !prn_number || !graduationYear ) {
            return res.json({ success: false, message: "All fields are required" });
        }

        // Step 1: Check if the student's data exists in StudentData
        const studentData = await prisma.studentData.findUnique({
            where: { prn_number }
        });

        if (!studentData || studentData.graduationYear !== graduationYear) {
            return res.json({ success: false, message: "Invalid student data. Registration denied." });
        }

        // Step 2: Check if the student already exists
        const existingStudent = await prisma.student.findUnique({ where: { email } });

        if (existingStudent) {
            return res.json({ success: false, message: "Student already exists" });
        }

        // Step 3: Create the student record
        const student = await prisma.student.create({
            data: {
                username,
                email,
                password,
                prn_number,
                graduationYear,
                 
            }
        });

        return res.json({ success: true, message: "Student registered successfully", student });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "An error occurred during registration" });
    }
};

const loginAlumni = async (req, res) => {
    try {
        const { email, password } = req.body;
        const alumni = await prisma.alumni.findUnique({ where: { email } });
        if (!alumni) {
            return res.json({ success: false, message: "Alumni doesn't exist" });
        }
        const isMatch = await bcrypt.compare(password, alumni.password);
        if (isMatch) {
            const token = createToken(alumni.id);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid Credentials" });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message || "An unknown error occurred" });
    }
};

const registerAlumni = async (req, res) => {
    try {
       
      const { username, email, fullName, graduationYear, password } = req.body;
  
       
      const match = await prisma.alumniData.findFirst({
        where: {
          fullName: fullName,
          graduationYear: Number(graduationYear),
        },
      });
  
      if (!match) {
        return res.json({
          success: false,
          message: "Alumni information could not be verified. Please contact support.",
        });
      }
  
       
      const exists = await prisma.alumni.findUnique({ where: { email } });
      if (exists) {
        return res.json({ success: false, message: "Alumni already exists" });
      }
  
      
      if (!validator.isEmail(email)) {
        return res.json({ success: false, message: "Please enter a valid email" });
      }
  
      
      if (password.length < 8) {
        return res.json({
          success: false,
          message: "Please enter a strong password (at least 8 characters)",
        });
      }
  
       
      const hashedPassword = await bcrypt.hash(password, 10);
  
       
      const alumni = await prisma.alumni.create({
        data: { username, email, password: hashedPassword },
      });
  
      
      const token = createToken(alumni.id);
      res.json({ success: true, token });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        message: error.message || "An unknown error occurred",
      });
    }
  };

const adminLogin = async (req, res) => {
    try {
        const{email,password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = JWT.sign(email+password,process.env.JWT_SECRET)
            res.json({
                success:true,
                token
            })
        }else{
            res.json({
                success:false,
                message:"Invalid Credentials"
            })
        }
    } catch (error) {
        console.log(error);
        if(error){
            res.json({success:false,message:error.message})
        }else{
            res.json({success:false,message:"An unknown error has occured"})
        }
    }
};



export { loginUser, registerUser, loginAlumni, registerAlumni, adminLogin };
