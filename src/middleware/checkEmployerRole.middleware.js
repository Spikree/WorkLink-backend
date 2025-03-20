const checkEmployerRole = (req, res, next) => {
    const { user } = req.user;
  
    if (user.role !== "employer") {
      return res.status(403).json({ message: "Access denied. Employers only." });
    }
  
    next();
  };
  
export default checkEmployerRole;