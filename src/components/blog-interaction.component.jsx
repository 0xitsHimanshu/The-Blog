import React, { useContext, useEffect } from 'react'
import { BlogContext } from '../pages/blog.page'
import { Link } from 'react-router-dom'
import { UserContext } from '../App';

const BlogInteraction = () => {

    let {title,blog:  { blog_id, activity, activity: {total_likes, total_comments}, author: {personal_info: {username: author_username}}}, setBlog} = useContext(BlogContext);

    let userContext = useContext(UserContext);
    let username = userContext?.userAuth?.user?.username;

  return (
    <>
        <hr className='border-grey my-2'/>

        <div className='flex gap-6 justify-between'>
            <div className='flex gap-3 items-center'>
                <button className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'>
                    <i className='fi fi-rr-heart text-xl hover:text-red'></i>
                </button>
                <p className='text-xl text-dark-grey'>{total_likes}</p>

                <button className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'>
                    <i className='fi fi-rr-comment-dots text-xl hover:text-yellow'></i>
                </button>
                <p className='text-xl text-dark-grey'>{total_comments}</p>

            </div>

            <div className='flex gap-6 items-center'>

                {
                    username == author_username ?  
                    <Link to={`/editor/${blog_id}`} className=' flex gap-1 hover:text-purple' >
                        <i className="fi fi-sr-file-edit"></i> 
                        Edit
                    </Link>
                    : ""
                }

                <Link to={`https://x.com/intent/tweet/?text=Read${title}&url=${location.href}`}>
                    <i className="fi fi-brands-twitter text-2xl mr-3 hover:text-twitter"></i>
                </Link>
            </div>
        </div>

        <hr className='border-grey my-2' />    
    </>
  )
}

export default BlogInteraction