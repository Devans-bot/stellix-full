import { User } from "../models/usermodel.js";
import bcrypt from "bcrypt"
import genratetoken from "../utils/generatetoken.js";
import crypto from 'crypto'
import { transporter } from "../utils/emial.js";
import cloudinary from 'cloudinary'
import getdataurl from "../utils/urlgenerator.js";

export const registeruser=async(req,res)=>{
    try {
        const {name,email,password}=req.body;

        let user = await User.findOne({email})
        if(user)return res.status(400).json({
            message:"already have an account with this email"
        })

        const hashpassword= await bcrypt.hash(password,10);

        user= await User.create({
            name,email,password:hashpassword,
        })

        genratetoken(user._id,res)

        res.status(200).json({
            message:"User created"
        })
    } catch (error) {
        res.status(500).json({
            message:error.message,
        })
    }
}



export const login=async(req,res)=>{
    const {email,password}=req.body


    
    if(!email && !password)return res.status(404).json({message:"Input details !"})


    let user = await User.findOne({email})
    if(!user) return res.status(404).json({
        message:"User not found"
    })

    const compare= await bcrypt.compare(password,user.password)

    if(!compare) return res.status(404).json({
        message:"User not found"
    })

    genratetoken(user._id,res)

    res.status(200).json({
        message: "Logged in!",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
          // any other fields you want to send
        }
      });
}


export const myprofile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("-password");
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  };
  

  export const updateProfilePicture = async (req, res) => {
    try {
      const userId = req.params.id;
  
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
  
      const fileurl = getdataurl(req.file);
  
      const cloud = await cloudinary.v2.uploader.upload(fileurl.content, {
        folder: "pinterest_clone/userdp",
      });
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { image: { id: cloud.public_id, url: cloud.secure_url } },
        { new: true }
      ).select("-password");
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({user:updatedUser});
      console.log(updatedUser.image)
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  
export const updateusername=async(req,res)=>{
  try {    
    
    const newname=req.body.name
    const userid=req.user._id
  
  if(!newname)return res.status(404).json({message:"PL give name"})

   const updateduser =   await User.findByIdAndUpdate(userid,{name:newname})
   res.json(updateduser.name)
    
  } catch (error) {
    console.log(error)
  }
}



  export const followunfollow =async(req,res)=>{
    try {
        
        const user = await User.findById(req.params.id)

        const loggedinuser= await User.findById(req.user._id)

        if(!user) return res.status(400).json({
            message:"User not exist "
        })

        if(user._id.toString()===loggedinuser._id.toString()){
            return res.status(403).json({
                message:"U cant follow urself"
            })
        }

        if(user.followers.includes(loggedinuser._id)){

            const indexfollowing= loggedinuser.following.indexOf(user._id)
            const indexfollowers= user.followers.indexOf(loggedinuser._id)

            loggedinuser.following.splice(indexfollowing,1)
            user.followers.splice(indexfollowers,1)

            await loggedinuser.save()
            await user.save()

            res.json({
                message:"unfollowed"
            })
        }else{
            loggedinuser.following.push(user._id)
            user.followers.push(loggedinuser._id)


            await loggedinuser.save()
            await user.save()

            res.json({
                message:"followed"
            })
        }


    } catch(error) {
        console.log(error)
    }



} 

export const logoutuser=async(req,res)=>{
    try {
        res.cookie("token", "", { maxAge: 0 });
  
        res.json({
          message: "Logged Out Successfully",
        });
    } catch (error) {
        console.log(error)
    }
  } 

  export const getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password") // Hide password
  
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }
  
      res.status(200).json(user)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Failed to fetch user profile" })
    }
  }
  
  export const forgotpassword=async(req,res)=>{
    try {
        
        const {email} = req.body

        const user = await User.findOne({email})

        if(!user) return res.status(404).json({message:"No user with this email"})

        const token=crypto.randomBytes(32).toString('hex')
        const hashed=crypto.createHash('sha256').update(token).digest('hex')

        user.resetPasswordToken=hashed;
        user.resetPasswordExpires= Date.now()+15*16*1000
        await user.save()

        const resetLink = `http://localhost:5173/reset-password/${token}`;
        console.log("🔗 Reset Password Link:", resetLink);

        await transporter.sendMail({
            from:`Stellix <${process.env.MAIL_USER}>`,
            to:user.email,
            subject:'Password reset request',
            html: `<p>Click below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
        })
   
        

        res.status(200).json({ message: 'Reset email sent' });

    } catch (error) {
        console.log(error)
    }
  }

  export const resetpassword=async(req,res)=>{
    try {
        const {token}=req.params
        const {password}=req.body

        const hashed=crypto.createHash('sha256').update(token).digest('hex')

        const user=await User.findOne({
            resetPasswordToken:hashed,
            resetPasswordExpires:{$gt:Date.now()}
        })

       if(!user) return res.status(404).json({message:"token expired"})

        user.password= await bcrypt.hash(password,10)
        user.resetPasswordToken=undefined
        user.resetPasswordExpires=undefined
        await user.save()

        res.status(200).json({message:"Password reset successfully"})
    } catch (error) {
        console.log(error)
    }
  }

  export const updatepassword=async(req,res)=>{
    try {
      const userId=req.user._id
      const{currentpassword,newpassword}=req.body

      if(!currentpassword || !newpassword)return res.status(404).json({message:"Plz provide details !"})

      const user= await User.findById(userId)

      if(!user)return res.status(404).json({message:"USer not found"})

      const ismatch=await bcrypt.compare(currentpassword,user.password)
      if(!ismatch)return res.status(404).json({message:"Password is incorrect"})      

      const salt=await bcrypt.genSalt(10)
      const hashpassword=await bcrypt.hash(newpassword,salt)

      user.password=hashpassword
      await user.save()

      res.json({message:"Password changed successfully"})
    } catch (error) {
      console.log(error)
    }
  }