import axios from "axios";

export const protectRoute = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
        
        const response = await axios.get("http://localhost/api/auth/check", {
            headers: { Authorization: `Bearer ${token}` },
        });

        req.user = response.data.user; 
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};
