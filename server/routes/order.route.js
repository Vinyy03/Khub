const { createOrder, getOrders, updateOrder, deleteOrder, getUserOrder, getMonthlyIncome } = require("../controllers/order.controller");
const { verifyAdmin, verifyToken } = require("../middleware/verifyToken");
const { parser} = require("../utils/cloudinary")
const router = require('express').Router();


router.post("/", verifyToken, createOrder);
router.put("/:id", verifyAdmin, updateOrder);
router.delete("/:id", verifyToken, deleteOrder);
router.get("/:id", verifyToken, getUserOrder);
router.get("/", verifyToken, getOrders);
router.get("/stats/income", verifyAdmin, getMonthlyIncome);

module.exports = router;