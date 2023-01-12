const slugify = require("slugify");
const Product = require ("../models/product");
const Category = require ("../models/category");


exports.create = async (req,res) =>{
    try {
        const {name} = req.body;
        const category = await new Category({name, slug:slugify(name)}).save();
        res.json(category);    

    } catch (err) {
        res.status(400).send("Create category failed");
    }
}

exports.list = async (req,res) =>{
    try {
        res.json(await Category.find({}).sort({createdAt: -1}).exec());
        
    } catch (err) {
        res.status(400).send("List category falied");
    }
}

exports.read = async (req,res) =>{
    try {
        let category = await Category.find({slug:req.params.slug}).exec();
        let products = await Product.find({category})
        .populate("category")
        .exec();

        res.json({category,products});
    } catch (err) {
        res.status(400).send("List this category falied");
    }
}


exports.update = async (req,res) =>{
    try {
        const {name} = req.body;
        const category = await Category.findOneAndUpdate(
            {slug:req.params.slug},
            {name,slug:slugify(name)}
            );
        res.json(category);
    } catch (err) {
        res.status(400).send("Create update falied");
    }
}


exports.remove = async (req,res) =>{
    try {
        
        const deleted = await Category.findOneAndDelete({slug : req.params.slug});
        res.json(deleted);
    } catch (err) {
        res.status(400).send("Delete falied");
    }
}

exports.readSingle = async(req,res) =>{
    let category = await Category.findOne({slug:req.params.slug}).exec();
    
    const products=await Product.find({category})
    .populate("category")
    .exec();
    
    res.json({category : category,products : products});
}