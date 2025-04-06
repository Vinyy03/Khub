const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
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

module.exports = {
    register,
    login,
};