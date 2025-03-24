import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../lib/utils.js";

export const register = async (req,res) => {
    const {email, password, role,name, bio, skills, portfolio} = req.body;

    if(!email || !password || !role || !name) {
        return res.status(400).json({
            message: "Please provide all the required details"
        });
    }

    if(!["freelancer","employer"].includes(role)) {
        return res.status(400).json({
            message: "Role must be either freelancer or employer"
        });
    }

    try {
        const existingUser = await User.findOne({email})

        if(existingUser) {
            return res.status(400).json({
                message: "A user with this email already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            email,
            password: hashedPassword,
            role,
            profile: {name,bio,skills,portfolio}
        });

        if(newUser) {
            generateToken(newUser,res);
            await newUser.save();

            return res.json({
                user: newUser,
                message: "Registration successfull"
            })
        } else {
            return res.status(400).json({
              message: "Invalid credentials",
            });
        }
    } catch (error) {
        console.log("error in register controller in auth controller", error.message)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const login = async (req,res) => {
    const {email,password} = req.body;

    if(!email) {
        return res.status(400).json({
            message: "Please provide an email address"
        });
    }

    if(!password) {
        return res.status(400).json({
            message: "Please provide password"
        });
    }

    try {
        const user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({
                message: "User with this email not found"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        if(user && isMatch) {
            generateToken(user, res);

            return res.status(200).json({
                message: "Logged in successfully",
                user,
                
            });
        }
    } catch (error) {
        console.log("error in login auth controller", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export const resetpassword = async (req,res) => {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;

    if(oldPassword === newPassword) {
        return res.status(400).json({
            message: "Old password and new password cannot be the same"
        });
    };

    if(!oldPassword) {
        return res.status(400).json({
            message : "Old Password Is Required To Reset Your Password"
        });
    };

    if(!newPassword) {
        return res.status(400).json({
            message: "New Password Is Required To Reset Your Password"
        });
    };

    try {
        const isUser = await User.findById(user._id);

        if(!isUser) {
            return res.status(404).json({
                message: "User Not Found"
            });
        };

        const isMatch = await bcrypt.compare(oldPassword, isUser.password);

        if(!isMatch) {
            return res.status(400).json({
                message : "Old Password Is Incorrect"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword,salt);

        isUser.password = hashedPassword;

        isUser.save();

        return res.status(200).json({
            message: "Password Updated Sucessfully"
        })
    } catch (error) {
        console.log("error in auth controller in change password" + error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}