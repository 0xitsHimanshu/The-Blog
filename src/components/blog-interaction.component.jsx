import React, { useContext, useEffect } from 'react'
import { BlogContext } from '../pages/blog.page'
import { Link } from 'react-router-dom'
import { UserContext } from '../App';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

const BlogInteraction = () => {

    let { blog, blog: { _id, title ,blog_id, activity, activity: {total_likes, total_comments}, author: {personal_info: {username: author_username}}}, setBlog, islikedByUser, setIsLikedByUser, setCommentWrapper} = useContext(BlogContext);

    let userContext = useContext(UserContext);
    let accessToken = userContext?.userAuth?.accessToken;
    let username = userContext?.userAuth?.user?.username;

    useEffect(()=> {
        if(accessToken){
            axios
             .post(`${import.meta.env.VITE_SERVER_URL}/blog/isliked-by-user/`, { _id}, {headers: {'Authorization': `Bearer ${accessToken}`}})
             .then(({data: {result}})=> {
                setIsLikedByUser(Boolean(result));
             })
             .catch(err => {
                 console.log(err.message);
             })
        }
    }, [])

    const handleLike = () => {
        if(accessToken){
            setIsLikedByUser( preValue => !preValue);
            !islikedByUser ? total_likes++ : total_likes--;
            
            setBlog({...blog, activity: {...activity, total_likes}});

            axios
             .post(`${import.meta.env.VITE_SERVER_URL}/blog/like-blog/`, {_id, islikedByUser}, {headers: {Authorization: `Bearer ${accessToken}`}})
             .then(({data}) => {
                //  console.log(data);
             }).catch(err => {
                  console.log(err.message);
             })
        }
        else {
            toast.error('You need to login to like this blog')
        }
    }

  return (
    <>
      <Toaster />
      <hr className="border-grey my-2" />

      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button
            onClick={handleLike}
            className={
              "w-10 h-10 rounded-full flex items-center justify-center " +
              (islikedByUser ? "bg-red/20 text-red" : "bg-grey/80")
            }
          >
            <i
              className={
                "fi fi-" + (islikedByUser ? "sr" : "rr") + "-heart text-xl"
              }
            ></i>
          </button>
          <p className="text-xl text-dark-grey">{total_likes}</p>

          <button onClick={() => setCommentWrapper( preValue => !preValue) } className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
            <i className="fi fi-rr-comment-dots text-xl hover:text-yellow"></i>
          </button>
          <p className="text-xl text-dark-grey">{total_comments}</p>
        </div>

        <div className="flex gap-6 items-center">
          {username == author_username ? (
            <Link
              to={`/editor/${blog_id}`}
              className=" flex gap-1 hover:text-purple"
            >
              <i className="fi fi-sr-file-edit"></i>
              Edit
            </Link>
          ) : (
            ""
          )}

          <Link
            to={`https://x.com/intent/tweet/?text=Read${title}&url=${location.href}`}
          >
            <i className="fi fi-brands-twitter text-2xl mr-3 hover:text-twitter"></i>
          </Link>
        </div>
      </div>

      <hr className="border-grey my-2" />
    </>
  );
}

export default BlogInteraction