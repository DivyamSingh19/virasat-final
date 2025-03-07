import JWT from "jsonwebtoken"
const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized, no token" });
        }
        const decoded = JWT.verify(token, process.env.JWT_SECRET);

        if (decoded.id === "admin") {
            req.user = { id: "admin", role: "ADMIN" };  
            return next();
        }

        const user = await prisma.user.findUnique({ where: { id: decoded.id } }) || 
                     await prisma.alumni.findUnique({ where: { id: decoded.id } });

        if (!user) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Token verification failed" });
    }
};
export default protect