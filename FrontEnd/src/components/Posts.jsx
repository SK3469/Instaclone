import React from 'react'
import Post from './Post'

const Posts = () => {
  return (
    <div>
      <div>
        {
          [1,2,3,4,5,6,7,8].map((item, index) =><Post/>)
        }
      </div>
    </div>
  )
}

export default Posts