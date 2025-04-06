const { createCart, updateCart, deleteCart, getUserCartItem, getCartItems } = require("../controllers/cart.controller");
const { verifyAdmin, verifyToken } = require("../middleware/verifyToken");
const { parser} = require("../utils/cloudinary")
const router = require('express').Router();


router.post("/", verifyToken, createCart);
router.put("/:id", verifyToken, updateCart);
router.delete("/:id", verifyToken, deleteCart);
router.get("/:id", verifyToken, getUserCartItem);
router.get("/", verifyToken, getCartItems);


module.exports = router;