const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const Order = require("../models/order");
const uniqueid = require("uniqueid");

exports.userCart = async(req,res) =>{
    const {cart} = req.body;

    let products=[];

    const user = await User.findOne({email : req.user.email}).exec();

    let cartExistByThisUser = await Cart.findOne({orderedBy : user._id}).exec();

    if (cartExistByThisUser) {
        cartExistByThisUser.remove();
    }

    for (let i=0;i<cart.length;i++){
        let object={};

        object.product = cart[i]._id;
        object.count = cart[i].count;
        object.color = cart[i].color;

        let productsFromDb = await Product.findById(cart[i]._id).select("price").exec();
        object.price = productsFromDb.price;

        products.push(object);
    }

    let cartTotal=0;
    for (let i=0;i<products.length;i++){
        cartTotal = cartTotal + products[i].price * products[i].count;
    }

    let newCart = await new Cart({products,cartTotal,orderedBy:user._id}).save();
    
    
    res.json({ok:true});
}



exports.getUserCart = async(req,res) =>{
    const user = await User.findOne({email:req.user.email}).exec();
    
    let cart = await Cart.findOne({orderedBy : user._id})
    .populate("products.product", "_id title price totalAfterDiscount")
    .exec();

    const {products,cartTotal,totalAfterDiscount} = cart;
    res.json({products,cartTotal,totalAfterDiscount});

}


exports.emptyCart = async(req,res) =>{
    const user = await User.findOne({email:req.user.email}).exec();
    
    let cart = await Cart.findOneAndRemove({orderedBy : user._id}).exec();

    res.json(cart);

}


exports.saveAddress = async(req,res) =>{
    const userAddress = await User.findOneAndUpdate(
        {email:req.user.email},
        {address:req.body.address}
        ).exec();

    res.json({ok:true});

}

exports.applyCoupon = async(req,res) =>{
    
    const {coupon} = req.body;

    const validCoupon = await Coupon.findOne({name:coupon}).exec();

    const user = await User.findOne({email:req.user.email}).exec();

    let {products,cartTotal} = await Cart.findOne({orderedBy : user._id})
    .populate("products.product", "id title price")
    .exec();

    let totalAfterDiscount = (cartTotal * (100-validCoupon.discount)*0.01).toFixed(2);

    Cart.findOneAndUpdate({orderedBy : user._id}, {totalAfterDiscount}, {new:true}).exec();

    res.json(totalAfterDiscount);
}

//creating order
exports.createOrder =  async(req,res) =>{

    const {paymentIntent} =  req.body.stripeResponse;
    const user = await User.findOne({email : req.user.email}).exec();

    let {products} = await Cart.findOne({orderedBy : user._id}).exec();

    let newOrder = await new Order({products,paymentIntent,orderedBy : user._id}).save();


    let bulkOption = products.map((item)=>{
        return {
            updateOne :{
                filter : {_id : item.product._id},
                update :{$inc : {quantity:-item.count , sold: +item.count}}
            }
    };
    });
    let updated = await Product.bulkWrite(bulkOption,{new:true});

    res.json({ok:true});
}


exports.getOrders = async(req,res) =>{

    let user = await User.findOne({email:req.user.email}).exec();

    let orders = await Order.find({orderedBy:user._id})
    .populate("products.product")
    .exec();

    res.json(orders);
}


//wishlist
exports.addToWishList = async(req,res) =>{
    const {productId} = req.body;

    const user  = await User.findOneAndUpdate({email:req.user.email}, 
        {$addToSet : {wishlist:productId}},{new:true}).exec();

        res.json({ok:"true"});
}

exports.getWishList = async(req,res) =>{
    const list = await User.find({email:req.user.email})
    .select("wishlist")
    .populate("wishlist")
    .exec();

    res.json(list);
}

exports.removeWishList = async(req,res) =>{
    const {productId} = req.params;

    const user = await User.findOneAndUpdate({email:req.user.email}, {$pull:{wishlist : productId}}).exec();

    res.json({ok:"true"});
}

exports.createCODOrder =  async(req,res) =>{

    const {COD,coupon} =  req.body;

    if (!COD) return res.status(400).send("Create cash order failed");
    
    const user = await User.findOne({email : req.user.email}).exec();

    const {products,cartTotal,totalAfterDiscount} = await Cart.findOne({orderedBy : user._id}).exec();

    let finalAmount =0;
    
    if (coupon && totalAfterDiscount>0){
        finalAmount = totalAfterDiscount*100;
    } else {
        finalAmount = cartTotal*100;
    }

    let newOrder = await new Order({
        products,
        paymentIntent : {
            id : uniqueid(),
            amount : finalAmount,
            currency :"inr",
            status : "Cash On Delivery",
            created : Date.now(),
            payment_method_types : ["cash"]

        },
        orderedBy : user._id,
        orderStatus : "Cash On Delivery"
    }).save();

    console.log("NEW ORDER SAVED", newOrder);


    let bulkOption = products.map((item)=>{
        return {
            updateOne :{
                filter : {_id : item.product._id},
                update :{$inc : {quantity:-item.count , sold: +item.count}}
            }
    };
    });
    let updated = await Product.bulkWrite(bulkOption,{new:true});

    res.json({ok:true});
}