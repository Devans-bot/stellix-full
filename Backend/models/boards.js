import mongoose from "mongoose";
import { type } from "os";

const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    pins:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Pin",
        
    }]

})
export const Board = mongoose.model("Board", schema);


