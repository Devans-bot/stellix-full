import jwt from "jsonwebtoken"
import { User } from "../models/usermodel.js"

export const isauth=async(req,res,next)=>{
    try {
        const token = req.cookies.token

       if(!token) return  res.status(401).json({
        message:"please login bro"
       })

       const decodeddata=jwt.verify(token,process.env.JWT_SEC)

       if(!decodeddata)return res.status(404).json({
        message:"token expired"
       })  

       req.user = await User.findById(decodeddata.id)

       next()
    } catch (error) {
        res.status(404).json({
            message:"please logins"
        })
    }
}