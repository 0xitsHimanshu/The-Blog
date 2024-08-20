import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast';

const NotificationCommentField = ({_id, blog_author, index=undefined, replyingTo = undefined, setIsReplying, notification_id, notificationData}) => {
    const [comment, setComment] = useState("");
    
    const handleComment = () => {
        console.log('Clicked');
    }

    return (
        <>
          <Toaster />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Leave a reply..."
            className={
              "input-box pl-5 placeholder:text-dark-grey resize-none h-[100px] overflow-auto "}
          ></textarea>
          <button onClick={handleComment} className="btn-dark mt-5 px-10">
            Reply
          </button>
        </>
      );
}

export default NotificationCommentField