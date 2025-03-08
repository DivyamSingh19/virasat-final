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
        const { username, email, password } = req.body;
        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword },
        });
        const token = createToken(user.id);
        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message || "An unknown error occurred" });
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
        const { username, email, password } = req.body;
        const exists = await prisma.alumni.findUnique({ where: { email } });
        if (exists) {
            return res.json({ success: false, message: "Alumni already exists" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const alumni = await prisma.alumni.create({
            data: { username, email, password: hashedPassword },
        });
        const token = createToken(alumni.id);
        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message || "An unknown error occurred" });
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
