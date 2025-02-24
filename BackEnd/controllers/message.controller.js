import { Conversation } from "../models/conversation.model";
import { Message } from "../models/message.model";

//for chatting
export const sendMessage= async (req, res)=>{
    try {
        const senderId= req.id;
        const receiverId= req.params.id;
        const {message} = req.body;
        const conversation = await Conversation.findOne({
            participants:{$all:[senderId, receiverId]}
        })
        //if conversation not started yet
        if(!conversation){
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        };
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        if(newMessage) conversation.messages.push(newMessage._id);
        await Promise.all([conversation.save(),newMessage.save()])
        // socket io for real time data transfer...

        return res.status(201).json({ success:true, newMessage});

    } catch (error) {
        console.log(error)
    }
}
//for getMessage
export const getMessage= async (req, res)=>{
    try {
        const senderId = req.id;
        const receiverId= req.params.id;
        const conversation = await Conversation.find({
            participants:({$all:[senderId, receiverId]})
        });
        if(!conversation) return res.status(200).json({success:true, message:[]})
        return res.status(200).json({success:true, messages:conversation?.messages}) //? used to geathering all of possiblites ...
    
    } catch (error) {
        
    }
}
