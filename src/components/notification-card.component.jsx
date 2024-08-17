import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { getDay } from '../common/date';
import NotificationCommentField from './notification-comment-field.component';

const NotificationCard = ({data, index, notificationState }) => {
    const [isReplying, setIsReplying] = useState(false);
    const {
      type,
      createdAt,
      comment,
      replied_on_comment,
      user: {
        personal_info: { profile_img, fullname, username: profile_username },
      },
      blog: { blog_id, title, banner },
    } = data;


    const handleReplyClick = () => {
        setIsReplying(preVal => !preVal);
    }
  
    return (
    <div className='p-6 border-b border-grey border-l-black mb-2'>
        <div className='flex gap-5 mb-3'>
            <img src={profile_img} className='w-14 h-14 flex-none rounded-full' />
            <div className='w-full'>
                <h1 className='font-medium text-xl text-dark-grey'>
                    <span className='lg:inline-block hidden capitalize'>{fullname}</span>
                    <Link to={`/user/${profile_username}`} className='mx-1 text-black underline'>@{profile_username}</Link>

                    <span className='font-normal'>
                        {
                            type == 'like' ? "Liked your blog" :
                            type == 'comment' ? "Commented on your blog" :
                            "Replied on "
                        }
                    </span>
                </h1>

                {   type == 'reply' ? 
                    <div className='p-4 mt-4 rounded-md bg-grey'>
                        <p>{replied_on_comment.comment}</p>
                    </div>
                    : 
                    <Link to={`/blog/${blog_id}`} className='font-medium text-dark-grey hover:underline line-clamp-1 flex gap-2 items-center justify-between'>
                        <span>{title}</span>
                        <img src={banner} className='w-20 rounded-md max-sm:hidden' />
                    </Link>
                }
            </div>
        </div>

        {
            type != 'like' ? 
            <p className='ml-14 pl-5 text-xl italic my-5'>{comment.comment}</p>
            : ""
        }

        <div className='ml-14 pl-5 mt-3 text-dark-grey flex gap-8 items-center'>
            <p>{getDay(createdAt)}</p>
            {
                type != 'like' ? 
                <>
                    <button className='underline hover:text-black' onClick={handleReplyClick}>Reply</button>
                    <button className='underline hover:text-black'>Delete</button>
                </>
                : ""
            }
        </div>

        {
            isReplying ? 
             <div className='mt-8'>
                <NotificationCommentField />
             </div>
            : ""
        }
    </div>
  )
}

export default NotificationCard