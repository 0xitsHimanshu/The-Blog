import React, { useContext, useState } from "react";
import { UserContext } from "../App";
import toast, { Toaster } from "react-hot-toast";
import { BlogContext } from "../pages/blog.page";
import axios from "axios";

const CommentField = ({ action, index=undefined, replyingTo=undefined, setReplying }) => {
  let {
    blog,
    blog: {
      _id,
      author: { _id: blog_author },
      comments,
      comments: { results: commentsArr },
      activity,
      activity: { total_comments, total_parent_comments },
    },
    setBlog,
    totalParentCommentsLoaded,
    setTotalParentCommentsLoaded,
  } = useContext(BlogContext);
  // let {userAuth: {accessToken, user: { username, fullname, profile_img}}} = useContext(UserContext)
  const { userAuth } = useContext(UserContext);

  // Ensure userAuth and user are defined before destructuring
  const accessToken = userAuth?.accessToken;
  const username = userAuth?.user?.username ?? "";
  const fullname = userAuth?.user?.fullname ?? "";
  const profile_img = userAuth?.user?.profile_img ?? "";

  const [comment, setComment] = useState("");

  const handleComment = () => {
    if (!accessToken) {
      return toast.error("You need to login to comment");
    }

    if (!comment.length) {
      return toast.error("Write something to comment...");
    }

    axios
      .post(
        `${import.meta.env.VITE_SERVER_URL}/blog/add-comment/`,
        { _id, comment, blog_author, replying_to: replyingTo },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then(({ data }) => {

        setComment("");
        data.commented_by = {
          personal_info: { username, fullname, profile_img },
        };
        let newCommentArr;

        if(replyingTo){
            const parentComment = commentsArr[index];
            if (!parentComment.children) {
                parentComment.children = [];
            }
            parentComment.children.push(data);
            data.childrenLevel = parentComment.childrenLevel + 1;
            parentComment.isReplyLoaded = true;

            newCommentArr = [
                ...commentsArr.slice(0, index + 1),
                data,
                ...commentsArr.slice(index + 1),
            ];

            setReplying(false);

        } else {
            data.childrenLevel = 0;
            newCommentArr = [data, ...commentsArr];
        }

        let parentCommentIncVal = replyingTo ? 0 : 1;

        setBlog({
          ...blog,
          comments: { ...comments, results: newCommentArr },
          activity: {
            ...activity,
            total_comments: total_comments + 1,
            total_parent_comments: total_parent_comments + parentCommentIncVal,
          },
        });

        setTotalParentCommentsLoaded(
          (preValue) => preValue + parentCommentIncVal
        );
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <>
      <Toaster />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a comment..."
        className={
          "input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto " +
          (action === "reply" ? " mt-2" : "")
        }
      ></textarea>
      <button onClick={handleComment} className="btn-dark mt-5 px-10">
        {action}
      </button>
    </>
  );
};

export default CommentField;