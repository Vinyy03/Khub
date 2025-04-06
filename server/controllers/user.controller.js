const User = require("../models/user.model")

const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, 
        {
            new: true,  
        });

        if (!updateUser){
            return res.status(404).json({ 
                message: "User not found" 
            });
        }

        res.status(200).json({
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error updating user",
            error: error,
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error deleting user",
            error: error,
        });
        
    }
}

const getAdmin = async (req, res) => {
    try {
        const admin = await User.findById(req.params.id);
        if(!admin){
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        const {password, ...info} = admin._doc;
        res.status(200).json({
            message: "Admin data fetched successfully",
            data: info,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error fetching admin data",
            error: error,
        });
    }
};

const getAllUsers = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10; // Default to 10 users
    try {
      const users = await User.find().limit(limit).select('username email isAdmin');
      res.status(200).json({
        message: "Users data fetched successfully",
        data: users,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error fetching users data",
        error: error,
      });
    }
  };

const getUserStats = async (req, res) => {
    
    try {
        const date = new Date();
        const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

        const userStats = await User.aggregate([
            { 
                $match: { createdAt: { $gte: lastYear } } 
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);
    res.status(200).json({
        message: "User stats fetched successfully",
        userStats
    });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error fetching user stats",
            error: error,
        });
    }
};

module.exports = {
    updateUser,
    deleteUser,
    getAdmin,
    getAllUsers,
    getUserStats,
};