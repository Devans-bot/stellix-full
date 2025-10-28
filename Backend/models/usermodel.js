import mongoose from "mongoose"
import { type } from "os"

const schema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    resetPasswordToken:{
            type:String
    },
    resetPasswordExpires:{
      type:Date
    },
    password:{
        type:String,
        require:true
    },
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    image: {
        id: String,
        url: String
      },
      boards: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Board",
        },
      ],
    
      createdAt: { type: Date, default: Date.now },
},{
    timestamps:true,
})

export const User=mongoose.model("User",schema)