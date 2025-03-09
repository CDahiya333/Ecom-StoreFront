const adminRoute = async(req,res,next) => {
    if(req.user && req.user.role === "admin") {
        next();
    }else{
        return res.status(403).json({ message: "Admin Access Denied" });
    }
}
export default adminRoute;  