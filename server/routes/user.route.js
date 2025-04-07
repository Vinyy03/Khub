const { updateUser, deleteUser, getAdmin, getAllUsers, getUserStats } = require('../controllers/user.controller.js');
const { verifyToken, verifyAdmin } = require('../middleware/verifyToken.js');

const router = require('express').Router();

// router.get("/get-users", (req, res) => {
//     res.send("Get user data")
// });

router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyAdmin, deleteUser);
router.get("/get-admin/:id", verifyAdmin, getAdmin);
router.get("/", getAllUsers); 
router.get("/stats", verifyAdmin, getUserStats); 

module.exports = router; 