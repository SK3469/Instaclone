import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

// Register User....
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.this.status(401).json({
                message: "All FIeld Required",
                success: false
            });
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(401).json({
                message: 'User Already Exist.',
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "Account Created Succesfully",
            success: true
        })

    } catch (error) {

    }
} 

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "All Field Required!",
                success: false
            })
        }
        let user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({
                message: "Invalid Email!",
                success: false
            })
        }
        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Invalid  Password!",
                success: false
            });
        }
        const token= await jwt.sign({userId:user._id}, process.env.SECRET_KEY,{expiresIn:'1d'});  
        //populate each post  if in the pasts array
        const populatedPosts= await Promise.all(
            user.posts.map(async (postId)=>{
                const post  = await Post.findById(postId);
                if(post.author.equals(user._id)){
                    return post;
                }
                return null;
            })
        )
        user = {
            _id:user._id,
            username:user.username,
            email:user.email,
            profilePicture:user.profilePicture,
            bio:user.bio,
            followers:user.followers,
            following:user.following,
            posts:populatedPosts
        }
       
        return res.cookie ('token',token ,{httpOnly:true ,someSite:'strict',maxAge: 1*24*60*60*1000}).json({
           user,
            message:`Welcome Back ${user.username}`,
            success:true
        });
     
    } catch (error) {
console.log(error)
    };
};

//logout fuction
export const logout = async (_, res)=>{
    try {
        return res.cookie("token","",{maxage:0}).json({
            message:"Logged Out Successfully",
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

//GetProfile function

export const getProfile= async (req,res)=>{
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).select('-password');
        return res.status(200).json({
            message:"Success",
            user,
            success:true
        })
    } catch (error) {
        console.log(error)
        
    }
}

//Edit Profile Function..
export const editProfile = async (req,res)=>{
  try {
    const userId  = req.id;
    const {bio, gender}= req.body;
    const profilePicture = req.file; 
    let cloudResponse;

   if(profilePicture){
       const fileUri =getDataUri(profilePicture);
       cloudResponse = await cloudinary.uploader.upload(fileUri);
   } 
   const user = await User.findById(userId).select('-password');  //use select('-password') to remove password 
   if(!user){
    return res.status(404).json({
        message:"User not Found",
        success:false
    })
   }
   if(bio) user.bio = bio;
   if(gender) user.gender = gender;
   if(profilePicture) user.profilePicture = cloudResponse.secure_url;
   await user.save();
    
   return res.status(200).json({
    message:"Profile Updated",
    success:true,
    user,
    profilePicture
});

  } catch (error) {
    console.log(error);

  };
};

//Get Suggested User funtion..

export const getSuggestedUsers= async (req,res)=>{
    try {
        const getSuggestedUsers = await User.find({_id:{$ne:req.id}}).select("-password");
        if(!getSuggestedUsers){
            return res.status(400).json({
                message:" currently ,no active user found",
                success:false

            })
        }
        return res.status(200).json({
            message:"Following Users Found.",
            success:true,
            users:getSuggestedUsers
        })
    } catch (error) {
        console.log(error)
    }
}

//Follow unfollow function..
export const followOrUnfollow = async (req,res)=>{
    try {
        const followByMe= req.id;
        const followHer= req.params.id;
        if(followByMe === followHer){
            return res.status(400).json({
                message:"You Can't follow/unfollow yourself!",
                success:false
            }) 
        }
        const user = await User.findById(followByMe);
        const targetUser= await User.findById(followHer);
        if (!user || !targetUser){
            return res.status(400).json({
                message:"User not Found",
                success:false
            })
        }
// I will check whether I need to follow or not.
const isFollowing = user.following.includes(followHer);
if(isFollowing){
    //unfollow logic
    await Promise.all([
        User.updateOne({ _id: followByMe }, {$pull :{following: followHer}}),
        User.updateOne({_id:followHer},{$pull:{followers: followByMe}}),
    ]);
    return res.status(200).json({message:"Unfollowed Successfully!", success:true})
} else{
//follow logic
await Promise.all([
    User.updateOne({_id:followByMe},{$push:{following:followHer}}),
    User.updateOne({_id:followHer},{$push:{followers:followByMe}}),
]);
return res.status(200).json({message:"followed Successfully!", success:true})
}
    } catch (error) {
        console.log(error)
    }
}




