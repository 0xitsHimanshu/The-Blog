import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { getDay } from '../common/date';
import NotificationCommentField from './notification-comment-field.component';
import { UserContext } from '../App';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const NotificationCard = ({data, index, notificationState }) => {
    const [isReplying, setIsReplying] = useState(false);
    
    const {userAuth} = useContext(UserContext);
    const accessToken = userAuth?.accessToken;
    const author_username = userAuth?.user?.username;
    const author_profile_img = userAuth?.user?.profile_img;

    const {
      seen,
      type,
      reply,
      createdAt,
      comment,
      replied_on_comment,
      user,
      user: {
        personal_info: { profile_img, fullname, username: profile_username },
      },
      blog: { _id, blog_id, title, banner },
      _id: notification_id,
    } = data;

    let { notifications, notifications: { results, totalDocs}, setNotifications} = notificationState;


    const handleReplyClick = () => {
        setIsReplying(preVal => !preVal);
    }

    const handleDelete = (comment_id, type, target) => {
        target.setAttribute('disabled', 'true');

        axios.post(`${import.meta.env.VITE_SERVER_URL}/blog/delete-comment`, {_id: comment_id}, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(() => {

            if(type == 'comment'){
                results.splice(index, 1);
            } else {
                delete results[index].reply;
            }

            target.removeAttribute('disabled');
            setNotifications({...notifications, results, totalDocs: totalDocs - 1, deleteDocCount: notifications.deleteDocCount + 1 });
            toast.success(`${type} deleted successfully`);
            
        })
        .catch(err => {
            console.log(err.message);
        })
    }
  
    return (
     <>
     <Toaster />   
    <div className={'p-6 border-b border-grey border-l-black mb-2 '+ (!seen ? ' border-l-2' : "" )}>
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
                    {
                        !reply ? <button className='underline hover:text-black' onClick={handleReplyClick}>Reply</button> : ""
                    }
                    <button className='underline hover:text-black' onClick={(e)=> handleDelete(comment._id, "comment", e.target)}>Delete</button>
                </>
                : ""
            }
        </div>

        {
            isReplying ? 
             <div className='mt-8'>
                <NotificationCommentField _id={_id} blog_author={user} index={index} replyingTo={comment._id} setIsReplying={setIsReplying} notification_id={notification_id} notificationData={notificationState} />
             </div>
            : ""
        }

        {
            reply ? 
            <div className='ml-20 p-5 bg-grey mt-5 rounded-md'>
                <div className='flex gap-3 mb-3'>
                    <img src={author_profile_img} className='w-8 h-8 rounded-full'/>

                    <div>
                        <h1 className='font-medium text-xl text-dark-grey'>
                            <Link to={`/user/${author_username}`} className='mx-1 text-black underline'>@{author_username}</Link>
                            <span className='font-normal'>replied to</span>
                            <Link to={`/user/${profile_username}`} className='mx-1 text-black underline'>@{profile_username}</Link>
                        </h1>
                    </div>
                </div>

                <p className='ml-14 text-xl my-2'>{reply.comment}</p>

                <button className='underline hover:text-black ml-14 mt-2' onClick={(e)=> handleDelete(reply._id, "reply", e.target)}>Delete</button>
            </div> : ""
        }
    </div>
    </>
  )
}

export default NotificationCard