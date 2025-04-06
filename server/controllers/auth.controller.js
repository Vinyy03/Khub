const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const register = async (req, res) => {
    try {
        const { username, email, password, phone, country, address } = req.body;

        if (!username || !email || !password || !phone || !country || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({
            username,
            email,
            phone,
            country,
            address,
            password: hashedPassword,
        });

        await newUser.save();

        const { password: _, ...info } = newUser._doc;
        res.status(201).json({
            message: "User registered successfully",
            data: info,
        });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({
            message: "Error registering user",
            error: error.message,
        });
    }
};

const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const comparePassword = await bcrypt.compare(req.body.password, user.password);
        if (!comparePassword) {
            return res.status(400).json({ message: "Invalid password or email" });
        }

        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_KEY,
            { expiresIn: "5d" }
        );

        const { password, ...info } = user._doc;
        res.status(200).json({
            token,
            data: info,
            message: "User logged in successfully",
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            message: "Error during login",
            error: error.message,
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { userId } = req.user; // From JWT middleware
        const { username, address, phone, country, currentPassword, newPassword } = req.body;
        
        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // If trying to change password, verify current password
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ 
                    message: "Current password is required to set a new password" 
                });
            }
            
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            
            // Hash the new password
            user.password = bcrypt.hashSync(newPassword, 10);
        }
        
        // Update user fields
        if (username) user.username = username;
        if (address) user.address = address;
        if (phone) user.phone = phone;
        if (country) user.country = country;
        
        // Save updated user
        await user.save();
        
        // Return updated user without password
        const { password, ...updatedUserInfo } = user._doc;
        
        res.status(200).json({
            message: "Profile updated successfully",
            data: updatedUserInfo
        });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({
            message: "Error updating user profile",
            error: error.message
        });
    }
};


module.exports = {
    register,
    login,
    updateUser
};