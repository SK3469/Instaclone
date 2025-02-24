import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Post = () => {
  return (
    <div className='my-7 w-full mx-auto max-w-sm '>
      <div className=' flex items-center gap-3 '>
       <Avatar>
        <AvatarImage src="" alt="post_image"/>
        <AvatarFallback>CN</AvatarFallback>
       </Avatar>
       <h1>Username</h1>
      </div>
      <div className='h-[400px] w-[400px] object-cover rounded-xl border border-red-700  '>middle</div>
      <div>lower</div>
    </div>
  )
}

export default Post