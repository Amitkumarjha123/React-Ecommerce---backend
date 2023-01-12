const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;
const subSchema = new mongoose.Schema({
    name : {

        type :String,
        trim:true,
        required : "Name is required",
        minlength :[2, "Too short"],
        maxLength : [32, "Too long"]
    },
    parent :{type : ObjectId, ref : "Category", required:true},
    slug : {
        type :String,
        unique:true,
        lowecase : true,
        index : true
    }    
}, {timestamps : true});

module.exports = mongoose.model("Sub",subSchema);