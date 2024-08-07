import React, { useContext, useState } from "react";
import { getDay } from "../common/date";
import { UserContext } from "../App";
import CommentField from "./comment-field.component";
import { BlogContext } from "../pages/blog.page";
import axios from "axios";

const CommentCard = ({ index, leftVal, commentData }) => {
  let {
    commented_by: {
      personal_info: { profile_img, fullname, username: commented_by_username },
    },
    commentedAt,
    comment,
    _id,
    children
  } = commentData;
  let {
    blog,
    blog: {
      comments,  
      activity,
      activity: { total_parent_comments },
      comments: { results: commentsArr },
      author: {personal_info: {username: blog_author}}
    },
    setBlog,
    setTotalParentCommentsLoaded,
  } = useContext(BlogContext);
  // let {userAuth: {accessToken, user: { username, fullname, profile_img}}} = useContext(UserContext)
  const { userAuth } = useContext(UserContext);
  const accessToken = userAuth?.accessToken;
  const username = userAuth?.user?.username;
  const [isReplying, setIsReplying] = useState(false);

  const getParentIndex = () => {
    let startingPoint = index - 1;
    try {
        while (commentsArr[startingPoint].childrenLevel > commentData.childrenLevel) {
            startingPoint--;
        }
    } catch {
        startingPoint = undefined;
    }
    return startingPoint;
  }

  const removeCommentsCard = (startingPoint, isDelete = false) => {
    if (commentsArr[startingPoint]) {
      while (
        commentsArr[startingPoint].childrenLevel > commentData.childrenLevel
      ) {
        commentsArr.splice(startingPoint, 1);
        if (!commentsArr[startingPoint]) {
          break;
        }
      }
    }

    if(isDelete){
        let parentIndex = getParentIndex();
        if(parentIndex != undefined){
            commentsArr[parentIndex].children = commentsArr[parentIndex].children.filter(child => child._id != _id);
            
            if(!commentsArr[parentIndex].children.length){
                commentsArr[parentIndex].isReplyLoaded = false;
            }
        }

        commentsArr.splice(index, 1);
    }

    if(commentData.childrenLevel == 0 && isDelete){
        setTotalParentCommentsLoaded(preValue => preValue - 1);
    }

    setBlog({
      ...blog,
      comments: { results: commentsArr },
      activity: {
        ...activity,
        total_parent_comments:
          total_parent_comments -
          (commentData.childrenLevel == 0 && isDelete ? 1 : 0),
      },
    });
  };

  const deleteCommentandReplies = (e) => {
    e.target.setAttribute("disabled", true);

    axios
     .post(`${import.meta.env.VITE_SERVER_URL}/blog/delete-comment`, {_id}, {headers: {Authorization: `Bearer ${accessToken}`}})
     .then(({data}) => {
        e.target.removeAttribute("disabled");
        removeCommentsCard(index+1, true); 
     })
     .catch(err => {
        console.log(err.mesaage);
     })
  }

  // console.log(commentData);
  const handleReplyClick = () => {
    if (!accessToken) {
      return toast.error("You need to login to reply");
    }

    setIsReplying((preValue) => !preValue);
  };

  const handleHideReply = () => {
    commentData.isReplyLoaded = false;

    removeCommentsCard(index + 1);
  };

  const loadReplies = ({skip = 0}) => {
    if(children.length){
        handleHideReply();

        axios
         .post(`${import.meta.env.VITE_SERVER_URL}/blog/get-replies`, {_id, skip})
         .then(({data: {replies}}) => {
            commentData.isReplyLoaded = true;
            
            for(let i = 0; i < replies.length; i++){
                replies[i].childrenLevel = commentData.childrenLevel + 1;
                commentsArr.splice(index + 1 + i + skip, 0, replies[i]);
            }

            setBlog({...blog, comments: {...comments, results: commentsArr}});
         })

    }
  }

  return (
    <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
      <div className="my-5 p-6 rounded-md border border-grey">
        <div className="flex gap-3 items-center mb-8">
          <img src={profile_img} className="w-6 h-6 rounded-full" />

          <p className="line-clamp-2">
            {fullname} @{commented_by_username}
          </p>
          <p className="min-w-fit">{getDay(commentedAt)}</p>
        </div>

        <p className="text-xl ml-3">{comment}</p>

        <div className="flex gap-3 items-center mt-5">
          {commentData.isReplyLoaded ? (
            <button
              className="text-dark-grey p-2 px-3 hover:bg-grey/70 rounded-full flex items-center gap-2"
              onClick={handleHideReply}
            >
              <i className="fi fi-rs-comment-dots"></i> Hide reply
            </button>
          ) : (
            <button
              className="text-dark-grey p-2 px-3 hover:bg-grey/70 rounded-full flex items-center gap-2"
              onClick={loadReplies}  
            >
              <i className="fi fi-rs-comment-dots"></i>{ children.length} reply
            </button>
          )}
          <button
            className=" p-2 px-3 hover:bg-grey/70 rounded-full flex items-center gap-2"
            onClick={handleReplyClick}
          >
            <i className="fi fi-br-reply-all"></i>
            <p className="underline">reply</p>
          </button>

          {
            username == commented_by_username || username == blog_author ? 
                <button className="p-2 px-3 rounded-full ml-auto hover:bg-red/30 hover:text-red flex items-center "
                    onClick={deleteCommentandReplies}
                >
                    <i className="fi fi-rr-trash pointer-events-none"></i>
                </button>
            : ""
          }
        </div>

        {isReplying ? (
          <CommentField
            action="reply"
            index={index}
            replyingTo={_id}
            setReplying={setIsReplying}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
export default CommentCard;
