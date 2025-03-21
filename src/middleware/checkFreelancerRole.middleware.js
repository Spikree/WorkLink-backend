const checkFreelancerRole = (req, res, next) => {
    const { user } = req.user;
  
    if (user.role !== "freelancer") {
      return res.status(403).json({ message: "Access denied. Freelancers only." });
    }
  
    next();
  };
  
export default checkFreelancerRole;