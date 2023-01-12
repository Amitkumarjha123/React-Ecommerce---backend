const User=require("../models/user");

exports.createOrUpdateUser = async(req,res) => {
   
    const {name,picture,email} = req.user;

    const user =await User.findOneAndUpdate({email}, {name,picture}, {new:true});

    if (!user){
        const newUser = await new User({email,name,picture}).save();
        
        res.json(newUser);
        
        
    } else {
        
        res.json(user);
}
}

exports.currentUser = async(req,res) => {
    User.findOne({email:req.user.email}).exec((err,user) =>{
        
        if (err) throw new Error(err);
        res.json(user);
    });
    // .then((res) => {res.json(user)})
    // .catch((err) => {console.log(err)});
       
};