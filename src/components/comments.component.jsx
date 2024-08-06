import React, { useContext } from 'react'
import { BlogContext } from '../pages/blog.page'
import CommentField from './comment-field.component';
import axios from 'axios';
import NoDataMessage from './nodata.component';
import AnimationWrapper from '../common/page-animation';
import CommentCard from './comment-card.component';
import LoadMoreDataBtn from './load-more.component';

export const fetchComments = async ({skip=0, blog_id, setParentCommentCountFnc, comment_array = null}) => {
    let res;

    await axios.post(`${import.meta.env.VITE_SERVER_URL}/blog/get-comment`, {blog_id, skip})
          .then(({data}) => {
             data.map(comment => {
                    comment.childrenLevel = 0;
             })

             setParentCommentCountFnc(preVal => preVal + data.length);

             if(comment_array == null){
                res = {results: data}
             } else {
                res = {results: [...comment_array, ...data]}
             }
          })
              

    return res;
}

const CommentsContainer = () => {
    let {blog, blog: {_id, title, comments: {results: commentsArr}, activity: {total_parent_comments}}, commentsWrapper, setCommentWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded, setBlog} = useContext(BlogContext);

    const loadMoreComments = async () => {
        let newCommentsArr = await fetchComments({skip: totalParentCommentsLoaded, blog_id: _id, setParentCommentCountFnc: setTotalParentCommentsLoaded, comment_array: commentsArr});

        setBlog({...blog, comments: newCommentsArr});
    }

  return (
    <div
      className={
        "max-sm:w-full fixed " +
        (commentsWrapper
          ? "top-0 sm:right-0 "
          : "top-[100%] sm:right-[-100%] placeholder:") +
        " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden"
      }
    >
      <div className="relative">
        <h1 className="text-xl font-medium">Comments</h1>
        <p className="text-lg mt-2 w-[70%] text-dark-grey line-clamp-1">
          {title}
        </p>

        <button
          onClick={() => setCommentWrapper((preVal) => !preVal)}
          className="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey"
        >
          <i className="fi fi-br-cross text-xl mt-1"></i>
        </button>
      </div>

      <hr className="border-grey my-8 w-[120%] -ml-10" />

      <CommentField action={"Comment"} />

      {commentsArr && commentsArr.length ? (
        commentsArr.map((comment, i) => {
          return (
            <AnimationWrapper key={i}>
              <CommentCard
                index={i}
                leftVal={comment.childrenLevel * 4}
                commentData={comment}
              />
            </AnimationWrapper>
          );
        })
      ) : (
        <NoDataMessage message="No comments found" />
      )}

      {total_parent_comments > totalParentCommentsLoaded ? (
        <button onClick={loadMoreComments} className="w-[100%] h-12 text-dark-grey p-2 px-3 hover:bg-grey/70 border border-grey rounded-full flex items-center justify-center gap-2">
          Load more
        </button>
      ) : (
        ""
      )}
    </div>
  );
}

export default CommentsContainer