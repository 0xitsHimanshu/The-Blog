import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';

export const blogStructure = {
    title: "",
    des: "",
    content: [],
    tags: [],
    author: {personal_info: {}},
    banner: "",
    publishedAt: "",
}

const BlogPage = () => {

    let {blog_id} = useParams();
    const [blog, setBlog] = useState(blogStructure);
    const [loading, setLoading] = useState(true);
    let {title, content, banner, author: {personal_info: {fullname, username, profile_img}}, publishedAt} = blog;

    const fetchBlog = () => {
        axios
         .post(`${import.meta.env.VITE_SERVER_URL}/blog/get-blog`, {blog_id})
         .then(({data: {blog}}) => {
            setBlog(blog);        
         })
         .catch(err => {
             console.log(err);
         })
    }

    useEffect(()=> {
        fetchBlog();
    }, [])

  return (
    <AnimationWrapper>
        {
            loading ? <Loader /> 
            :
            <div className='max-w-[900px] center py-10 max-lg:px-[5vw]'>
                <img src={banner} className='aspesct-video'/>

                <div className='mt-12'>
                    <h1></h1>
                </div>
            </div>  
        }
    </AnimationWrapper>
  )
}

export default BlogPage