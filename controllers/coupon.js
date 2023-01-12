const Coupon = require("../models/coupon");

exports.create = (req,res) =>{  
    try {
        const {name,expiry,discount} = req.body.coupon;
        const newCoupon = new Coupon({name,expiry,discount}).save();
        return res.json(newCoupon);
    } catch(err) {
        console.log(err);
    }
}

exports.list = async(req,res) => {
    try {
        const newCoupon = await Coupon.find({}).sort({createdAt:-1}).exec();
         return res.json(newCoupon);
    } catch(err) {
        console.log(err);
    }
}

exports.remove = async(req,res) => {
    try {
        
        res.json(await Coupon.findByIdAndDelete(req.params.couponId).exec());
    } catch(err) {
        console.log(err);
    }
}

