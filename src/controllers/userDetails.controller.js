import User from "../models/user.model.js";

export const getUserDetails = async (req, res) => {
  const { id: userId } = req.params;

  try {
    const user = await User.findById(userId).select("-password -email");

    return res.status(200).json({
      message: "Fetched user details sucessfully",
      user,
    });
  } catch (error) {
    console.log(
      "error in user details controller at get user details " + error
    );
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
