import React, { createContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios';
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';
import { getDay } from '../common/date';
import BlogInteraction from '../components/blog-interaction.component';
import BlogPostCard from '../components/blog-post.component';
import BlogContent from '../components/blog-content.component';
import CommentsContainer, { fetchComments } from '../components/comments.component';

export const blogStructure = {
    title: "",
    des: "",
    content: [],
    author: {personal_info: {}},
    banner: "",
    publishedAt: "",
}

export const BlogContext = createContext({})

const BlogPage = () => {
    
    let {blog_id} = useParams();
    const [blog, setBlog] = useState(blogStructure);
    const [similarBlogs, setSimilarBlogs] = useState(null);
    const [loading, setLoading] = useState(true);
    const [islikedByUser, setIsLikedByUser] = useState(false);
    const [commentsWrapper, setCommentWrapper] = useState(true);
    const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

    let {title, content, banner, author: {personal_info: {fullname, username, profile_img}}, publishedAt} = blog;

    const fetchBlog = () => {
      axios
        .post(`${import.meta.env.VITE_SERVER_URL}/blog/get-blog`, { blog_id })
        .then(async ({ data: { blog } }) => {
            
          blog.comments = await fetchComments({ blog_id: blog._id, setParentCommentCountFnc: setTotalParentCommentsLoaded});
            
          setBlog(blog);

          axios
            .post(`${import.meta.env.VITE_SERVER_URL}/blog/search-blogs`, {
              tag: blog.tags[0],
              limit: 6,
              eleminate_blog: blog_id,
            })
            .then(({ data }) => {
              setSimilarBlogs(data.blogs);
            })
            .catch((err) => console.log(err));

          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };

    useEffect(()=> {
        resetState();
        fetchBlog();
    }, [blog_id])

    const resetState = () => {
        setBlog(blogStructure);
        setSimilarBlogs(null);
        setLoading(true);
        setIsLikedByUser(false);
        setCommentWrapper(false);
        setTotalParentCommentsLoaded(0);
    }

  return (
    <AnimationWrapper>
        {
            loading ? <Loader /> 
            :
            <BlogContext.Provider value={{blog, setBlog, islikedByUser, setIsLikedByUser, commentsWrapper, setCommentWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded}}>

                <CommentsContainer />
                <div className='max-w-[900px] center py-10 max-lg:px-[5vw]'>
                    <img src={banner} className='aspect-video border rounded-md'/>

                    <div className='mt-12'>
                        <h2>{title}</h2>
                        <div className='flex max-sm:flex-col justify-between my-8'>
                            <div className='flex gap-5 items-start'>
                                <img src={profile_img} className="w-12 h-12 rounded-full" />

                                <p className='capitalize'>
                                    {fullname}
                                    <br />
                                    @
                                    <Link to={`/user/${username}`} className='underline'>{username} </Link> 
                                </p>
                            </div>

                            <p className='text-dark-grey opacity-75 max-sm: mt-6 max-sm: ml-12 max-sm: pl-5'>
                                Published at {getDay(publishedAt)}
                            </p>
                        </div>

                        <BlogInteraction />
                        {/* Blog content  */}

                        <div className='my-12 font-gelasio blog-page-content'>
                            {
                                content[0].blocks.map((block, i) => {
                                    return <div key={i} className='my-4 md:my-8'>
                                        <BlogContent block={block} />
                                    </div>
                                })
                            }
                        </div>

                        <BlogInteraction />
                        {
                            similarBlogs != null && similarBlogs.length ? 
                            <>
                                <h1 className='text-2xl mt-14 mb-10 font-medium' >Similar blogs</h1>
                                {
                                    similarBlogs.map((blog, i) => {
                                        let { author: {personal_info}} = blog;

                                        return <AnimationWrapper key={i} transition={{duration: 1, delay: i* 0.8}}>
                                            <BlogPostCard content={blog} author={personal_info}/>
                                        </AnimationWrapper>
                                    })  
                                }
                            </>
                            : ""
                        }
                    </div>
                </div>
            </BlogContext.Provider>  
        }
    </AnimationWrapper>
  )
}

export default BlogPage