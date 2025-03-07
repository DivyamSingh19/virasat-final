import JWT from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    try {
      
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }

        
        const decoded = JWT.verify(token, process.env.JWT_SECRET);

         
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ success: false, message: "Forbidden: Access denied" });
        }

       
        req.admin = { email: decoded.email };
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token" });
    }
};
 
 

export { adminAuth };
