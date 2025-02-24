import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
//creating array 
const sidebarItems = [
  { icon: <Home />, text: "Home" },
  { icon: <Search />, text: "Search" },
  { icon: <TrendingUp />, text: "Explore" },
  { icon: <MessageCircle />, text: "Messages" },
  { icon: <Heart />, text: "Notifications" },
  { icon: <PlusSquare />, text: "Create" },
  {
    icon: (
      <Avatar className="h-6 w-6  ">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

    ), text: "Profile"
  },
  { icon: <LogOut />, text: "Logout" },
]
const LeftSidebar = () => {
  const navigate= useNavigate();
  const logoutHandler = async ()=>{
    try {
      const res = await axios.get('http://localhost:8000/api/v1/user/logout', {withCredentials:true});
      if(res.data.success){
navigate("/login");
toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
  const sidebarHandler = (textType)=>{
if(textType == 'Logout') logoutHandler(); //this logout handler work like this when map used ..
  }
  return (
    <div className='fixed z-10 shadow-lg w-[15%] top-0 bottom-0 h-screen px-4 left-0 my-7'>
     <div className='flex flex-col  gap-5 mt-3'>
      <h1 className='text-red-800 font-bold text-2xl'>Insta<span className='text-green-900'>Gram</span></h1>
     {
        sidebarItems.map((item, index) => {
          return (
            <div onClick={()=>sidebarHandler(item.text)} className='flex item-center gap-4 relative hover:bg-gray-100 p-2 rounded-xl cursor-pointer' key={index}>
              {item.icon}
              <span>{item.text}</span>
            </div>
          )
        })}
     </div>
    </div>
  )
}

export default LeftSidebar