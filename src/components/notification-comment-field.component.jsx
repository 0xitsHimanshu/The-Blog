import React, { useContext, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { UserContext } from '../App';
import axios from 'axios';

const NotificationCommentField = ({_id, blog_author, index=undefined, replyingTo = undefined, setIsReplying, notification_id, notificationData}) => {
    const [comment, setComment] = useState("");

    const {_id: user_id} = blog_author;
    const {userAuth} = useContext(UserContext);
    const accessToken = userAuth?.accessToken;

    const {notifications, notifications: {results}, setNotifications} = notificationData;

    
    const handleComment = () => {
  
      if (!comment.length) {
        return toast.error("Write something to comment...");
      }
  
      axios
        .post(
          `${import.meta.env.VITE_SERVER_URL}/blog/add-comment/`,
          { _id, comment, blog_author: user_id, replying_to: replyingTo, notification_id },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        .then(({ data }) => {
          setIsReplying(false);
          results[index].reply = {comment, _id: data._id};
          setNotifications({...notifications, results});
        })
        .catch((err) => {
          console.log(err.message);
        });
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