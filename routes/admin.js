const express = require("express");
const router = express.Router();

const {authCheck,adminCheck} = require("../middlewares/auth");

const {getOrders,updateStatus} = require("../controllers/admin");





router.get("/admin/orders" , authCheck,adminCheck,getOrders);

router.put("/admin/orders" ,authCheck,adminCheck,updateStatus);

module.exports  = router;
