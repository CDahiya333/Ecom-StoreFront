import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = async(req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized, No Acess Token Found" });
        }
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not Found" });
        }
        req.user = user;
        next();
        } catch (error) {
            if(error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token Expired" });
            }
            throw error;
        }
        
    } catch (error) {
        console.log("Error in protectRoute Middleware", error.message);
        res.status(401).json({ message: "Unauthorized, No access token found" });
    }
}

export default protectRoute;