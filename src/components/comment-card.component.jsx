import React, { useContext, useState } from "react";
import { getDay } from "../common/date";
import { UserContext } from "../App";
import CommentField from "./comment-field.component";
import { BlogContext } from "../pages/blog.page";
import axios from "axios";
import { toast } from "react-hot-toast";

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
    let StartingPoint = index-1;

    try {
        while(commentsArr[StartingPoint].childrenLevel >= commentData.childrenLevel){
            StartingPoint--;
        }
    } catch {
        StartingPoint = undefined;
    }
    return StartingPoint;
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
            commentsArr[parentIndex].children = commentsArr[parentIndex].children.filter(child => child != _id)

            if(!commentsArr[parentIndex].children.length){
                commentsArr[parentIndex].isReplyLoaded = false;
            }
        }

        commentsArr.splice(index,1)
    }

    if(commentData.childrenLevel == 0 && isDelete){
        setTotalParentCommentsLoaded( preVal => preVal -1);
    }

    setBlog({...blog,comments: { results: commentsArr }, activity: {...activity, total_parent_comments: total_parent_comments- (commentData.childrenLevel == 0 && isDelete ? 1 : 0)}});
  };

  const deleteCommentandReplies = (e) => {
    e.target.setAttribute('disabled', true);
    
    axios.post(`${import.meta.env.VITE_SERVER_URL}/blog/delete-comment`, {_id}, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(() => {
        e.target.removeAttribute('disable');
        removeCommentsCard(index+1, true);
    })
    .catch(err => {
        console.log(err.message);
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

  const loadReplies = ({skip = 0, currentIndex = index}) => {
    if(commentsArr[currentIndex].children.length){
        handleHideReply();

        axios
         .post(`${import.meta.env.VITE_SERVER_URL}/blog/get-replies`, { _id: commentsArr[currentIndex]._id, skip})
         .then(({data: {replies}}) => {
            commentsArr[currentIndex].isReplyLoaded = true; 
            
            for(let i = 0; i < replies.length; i++){
                replies[i].childrenLevel = commentsArr[currentIndex].childrenLevel + 1;
                commentsArr.splice(currentIndex + 1 + i + skip, 0, replies[i]);
            }

            setBlog({...blog, comments: {...comments, results: commentsArr}});
         })

    }
  }

const LoadMoreReplies = () => {
  let parentIndex = getParentIndex();

  const button = <button className="p-2 px-3 rounded-full hover:bg-grey/70 flex items-center justify-center gap-2" onClick={() =>loadReplies({skip: index - parentIndex,currentIndex: parentIndex,})}>
    <span className="underline">Load more replies</span>
    <i className="fi fi-br-rotate-right text-sm flex"></i>
  </button>

  if (commentsArr[index + 1]) {
    if(commentsArr[index + 1].childrenLevel < commentsArr[index].childrenLevel){
      if (index - parentIndex < commentsArr[parentIndex].children.length) {
        return button;
      }
    }
  } else {
      if(parentIndex){
        if (index - parentIndex < commentsArr[parentIndex].children.length) {
          return button;
        }
      }
   }

  return null;
};

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
                <button  className="p-2 px-3 rounded-full border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center "    
                        onClick={deleteCommentandReplies}
                >
                    <i className="fi fi-rr-trash pointer-events-none"></i>
                </button> : ""
          }
        </div>

        {isReplying ? (
            <div className="mt-8">
                <CommentField
                action="reply"
                index={index}
                replyingTo={_id}
                setReplying={setIsReplying}
              />
            </div>
        ) : (
          ""
        )}
      </div>

      <LoadMoreReplies />
    </div>
  );
};
export default CommentCard;
