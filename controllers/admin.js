const Order = require("../models/order");

exports.getOrders = async(req,res) => {
    let ordersList = await Order.find({})
    .sort("-createdAt")
    .populate("products.product")
    .exec();

    res.json(ordersList);
}

exports.updateStatus = async(req,res) => {

    const {orderId,orderStatus} = req.body;

    let updated = await Order.findByIdAndUpdate(orderId, {orderStatus}, {new:true})
    .exec();

    res.json(updated);
}