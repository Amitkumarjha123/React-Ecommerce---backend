const express = require("express");
const {authCheck} = require("../middlewares/auth");

const {userCart ,getUserCart,emptyCart,saveAddress,applyCoupon,createOrder,createCODOrder,getOrders,addToWishList,getWishList,removeWishList} = require("../controllers/user");

const router = express.Router();

// router.get("/user", (req,res) => {
//     res.json({
//         data : "user api endpoint"
//     });
// });


router.post("/user/cart",authCheck,userCart);

router.get("/user/cart",authCheck,getUserCart);

router.delete("/user/cart",authCheck,emptyCart);

router.post("/user/address",authCheck,saveAddress);

router.post("/user/cart/coupon", authCheck,applyCoupon);

router.post("/user/order" , authCheck,createOrder);
router.post("/user/cash-order" , authCheck,createCODOrder);

router.get("/user/order" , authCheck,getOrders);




//wishlist
router.post("/user/wishlist",authCheck,addToWishList);
router.get("/user/wishlist",authCheck,getWishList);
router.put("/user/wishlist/:productId",authCheck,removeWishList);



module.exports = router;