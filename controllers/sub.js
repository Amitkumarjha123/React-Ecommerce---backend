const Sub = require ("../models/sub");
const Product = require("../models/product")
const slugify = require("slugify");


exports.create = async (req,res) =>{
    try {
        const {name,parent} = req.body;
        const sub = await new Sub({name,parent, slug:slugify(name)}).save();
        res.json(sub);
    } catch (err) {
        res.status(400).send("Create sub category failed");
    }
}

exports.list = async (req,res) =>{
    try { 
        res.json(await Sub.find({}).sort({createdAt: -1}).exec());    
    } catch (err) {
        res.status(400).send("List sub category falied");
    }
}

exports.read = async (req,res) =>{
    try {
        let sub = await Sub.findOne({slug:req.params.slug}).exec();
        const products = await Product.find({subs:sub})
        .populate("category")
        .exec();
        
        res.json({sub,products});
    } catch (err) {
        res.status(400).send("List this sub category falied");
    }
}

exports.update = async (req,res) =>{
    try {
        const {name} = req.body;
        const sub = await Sub.findOneAndUpdate(
            {slug:req.params.slug},
            {name,slug:slugify(name)}
            );
        res.json(sub);
    } catch (err) {
        res.status(400).send("Create sub update falied");
    }
}

exports.remove = async (req,res) =>{
    try {
         const deleted = await Sub.findOneAndDelete({slug : req.params.slug});
        res.json(deleted);
    } catch (err) {
        res.status(400).send("Delete falied");
    }
}