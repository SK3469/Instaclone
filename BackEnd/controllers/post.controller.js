import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";



export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;
        if (!caption) {
            return res.status(400).json({
                message: "Image Required!",
                success: false
            })
        }
        //for image optimization use sharp npm 
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: "inside" })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        })
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }
        await post.populate({ path: 'author', select: '-password' });
        return res.status(201).json({
            message: 'Congratulations,New Post Added Successfully!',
            post,
            success: true
        });

    } catch (error) {
        console.log(error)
    }
};

//getAllPost function

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().short({ createdAt: -1 }).populate({ path: 'author', select: 'username,profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },// decending to accending order.
                populate: ({
                    path: 'author',
                    select: 'username, profilePicture'
                })

            })
        return res.status(200).json({
            message: "success",
            posts,
            success: true
        });
    } catch (
    error
    ) {
        console.log(error)
    }
}
//getUSerPost function

export const getUSerPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 }).populate({
            path: 'author',
            select: 'username. profilePicture'
        }).populate({
            path: 'comments',
            sort: { createdAt: -1 },// decending to accending order.
            populate: ({
                path: 'author',
                select: 'username, profilePicture'
            })

        })
        return res.status(200).json({
            message: "success",
            posts,
            success: true
        });
    } catch (
    error
    ) {
        console.log(error)
    }
}
//likePost function

export const likePost = async (req, res) => {
    try {
        const postLikerId = req.id; //post like karne wala
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post Not Found",
                success: false
            });
        };
        // Like Logic..
        await post.updateOne({ $addToSet: { likes: postLikerId } });
        await post.save();
        //Implementing soket-io for real time notification..

        return res.status(200).json({
            message: "Post liked", success: true
        })
    }

    catch (
    error
    ) {
        console.log(error)
    }
}
//dislikePost function

export const dislikePost = async (req, res) => {
    try {
        const postLikerId = req.id; //post like karne wala
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post Not Found",
                success: false
            });
        };
        // Like Logic..
        await post.updateOne({ $pull: { likes: postLikerId } });
        await post.save();
        //Implementing soket-io for real time notification..

        return res.status(200).json({
            message: "Post disliked", success: true
        })
    }

    catch (
    error
    ) {
        console.log(error)
    }
}

//addComment function

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const postCommenter = req.id;
        const { text } = req.body;
        const post = await Post.findById(postId);
        if (!text) {
            return res.status(400).json({ message: "Text-Required", success: false });
        }
        //comment
        const comment = await Comment.create({
            text,
            author: postCommenter,
            post: postId
        }).populate({
            path: 'author',
            select: 'username, profilePicture'
        });
        post.commemts.push(comment._id);
        await post.save();
        return res.status(201).json({ message: "comment added", success: true });
    } catch (
    error
    ) {
        console.log(error)
    }
}
//getCommentOfPost function

export const getCommentOfPost = async (req, res) => {
    try {
        const postId = req.params.id; // also written as {id:postId}
        const comments = await Comment.find({ post: postId }).populate('author', 'username', 'profilePicture');
        if (!comments)  return res.status(404).json({ message: 'No Comment Found', success: false }) 
        return res.status(200).json({ comments, success: true });
    } catch (
    error
    ) {
        console.log(error)
    }
}
//deletePost function

export const deletePost = async (req, res) => {
    try {
const postId = req.params.id;
const authorId= req.id;
const post = await Post.findById(postId);
if(!post){
    return res.status(404).json({message:"Post Not Found", success:false});
}
// check if the logged-in user is the owner of the post..
if (!post.author.toString()!== authorId)return res.status(403).json({message:"Unauthorized Request", success:false})
// delete post ...
await Post.findByIdAndUpdate(postId);
//remove the post id from the userpost..
let user =await  User.findById(authorId);
user.posts = user.posts.filter(id=> id.toString()!== postId);
await user.save()

// delete associated commnets
await Comment.deleteMany({post:postId});
return res.status(200).json({message:"Post Deleted", success:true});
    } catch (
    error
    ) {
        console.log(error)
    }
}

//bookmark post 
export const bookmarkPost = async (req,res)=>{
  try {
    const postId= req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if(!post) return res.status(404).json({message:"Post not Found",success:false});
    const user = await  User.findById(authorId);
    if(!user.bookmarks.includes(post._id)){
        //already book mark then remove
        await user.updateOne({$pull:{bookmarks:post._id}});
        await user.save();
        return res.status(200).json({type:'unsaved', message:"Post Removed", success:true}) 
    } else{
        // bookmark added
        await user.updateOne({$addToSet:{bookmarks:post._id}});
        await user.save();
        return res.status(200).json({type:'save', message:"Post saved", success:true}) 
    }
  } catch (error) {
    console.log(error)
  }
}