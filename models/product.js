const mongoose=require("mongoose");
const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema({

    title :{
        type : String,
        trim : true,
        required : true,
        maxlength:32,
        text:true
    },
    slug :{
        type : String,
        unique : true,
        lowecase : true,
        index : true,
    }, 
    description : {
        type : String,
        trim : true,
        required : 2000,
        text:true
    },
    price :{
        type : Number,
        trim : true,
        maxlength:32,
        required : true
    },
    category :{
        type :ObjectId,
        ref : "Category"
    },
    subs :[
        {
        type : ObjectId,
        ref : "Sub"
        }
    ], 
    quantity : Number,
    sold : {
        type : Number,
        default : 0
    },
    images :{
        type : Array
    },
    shipping :{
        type : String,
        enum :["Yes", "No"]
    },
    color :{
        type : String,
        enum:["Black", "Brown", "Silver","White","Blue"]
    },
    brand :{
        type : String,
        enum:["Apple", "Samsung", "Microsoft","Lenovo","Asus"]
    },
    rating :[{
        star: Number,
        postedBy :
         {type : ObjectId,
          ref : "User"
         }
    }]
    },
    {timestamps:true}
);

module.exports = mongoose.model("Product",productSchema);