import React, { useContext, useState } from 'react'
import { getDay } from '../common/date';
import { UserContext } from '../App';
import CommentField from './comment-field.component';


const CommentCard = ({index, leftVal, commentData}) => {
  
    let {commented_by :{ personal_info: {profile_img, fullname, username}}, commentedAt, comment, _id } = commentData;
    // let {userAuth: {accessToken, user: { username, fullname, profile_img}}} = useContext(UserContext)
    const { userAuth } = useContext(UserContext);
    const accessToken = userAuth?.accessToken;
    const [ isReplying, setIsReplying ] = useState(false);
    
    // console.log(commentData);
    const handleReplyClick = () => {
        if(!accessToken){
            return toast.error('You need to login to reply')
        }

        setIsReplying(preValue => !preValue);
    }

    return (
    <div className='w-full' style={{paddingLeft:`${leftVal * 10}px` }}>
        <div className='my-5 p-6 rounded-md border border-grey'>
            <div className='flex gap-3 items-center mb-8'>
                <img src={profile_img} className='w-6 h-6 rounded-full' />

                <p className='line-clamp-2'>{fullname} @{username}</p>
                <p className='min-w-fit'>{getDay(commentedAt)}</p>
            </div>

            <p className='text-xl ml-3'>{comment}</p>

            <div className='flex gap-5 items-center mt-5'>
                <button className='underline mb-5' onClick={handleReplyClick}>
                    reply
                </button>
            </div>

            {
               isReplying ? 
                <CommentField action="reply" index={index} replyingTo={_id} setReplying={setIsReplying}/>
               : "" 
            }
        </div>
    </div>
  )
}

export default CommentCard