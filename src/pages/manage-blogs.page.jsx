import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../App';
import { filterPaginationData } from '../common/filter-pagination-data';
import { Toaster } from 'react-hot-toast';
import InPageNavigation from '../components/inpage-navigation.component';
import Loader from '../components/loader.component';
import NoDataMessage from '../components/nodata.component';
import AnimationWrapper from '../common/page-animation';
import ManagePublishedBlogCard from '../components/manage-blogcard.component';

const ManageBlogs = () => {

  const {userAuth} = useContext(UserContext);
  const accessToken = userAuth?.accessToken;

  const [blogs, setBlogs] = useState(null);
  const [drafts, setDrafts] = useState(null);
  const [query, setQuery] = useState("");

  const getBlogs = ({page, draft, deleteDocCount = 0}) => {

    axios
     .post(`${import.meta.env.VITE_SERVER_URL}/blog/user-written-blogs`, {page, draft, query, deleteDocCount}, {
         headers: {
            'Authorization': `Bearer ${accessToken}`
         }
     })
     .then(async ({data}) => {
        
         let formatedData = await filterPaginationData({
             state: draft ? drafts : blogs,
             data: data.blogs,
            page,
            user: accessToken,
            countRoute: "/blog/user-written-blogs-count",
            data_to_send: {draft, query}
        })
        if(draft){
            setDrafts(formatedData);
        } else{
            setBlogs(formatedData);
        }
        
     })
     .catch(err => console.log(err));

  }

  useEffect(()=> {
        if(accessToken){
            if(blogs == null){
                getBlogs({page: 1, draft: false});
            }
            if(drafts == null){
                getBlogs({page: 1, draft: true});
            }
        }
  }, [accessToken, blogs, drafts, query])

  const handleSearch = (e) => {
    let searchQuery = e.target.value

    setQuery(searchQuery);

    if(e.keyCode == 13 && searchQuery.length){
        setBlogs(null);
        setDrafts(null);
    }
  }

  const handleChange = (e) => {
    if(!e.target.value.length){
        setQuery("");
        setBlogs(null);
        setDrafts(null);
    }
  }

  return (
    <>
        <h1 className='max-md:hidden'>
             Manage Blogs
        </h1>

        <Toaster />

        <div className='relative max-md:mt-5 md:mt-8 mb-10'>

            <input 
                type="search" 
                className='w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey'
                placeholder='Search Blogs'
                onChange={handleChange}
                onKeyDown={handleSearch}
            />

            <i className='fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey'></i>
            
        </div>

        <InPageNavigation routes={['Published Blogs', 'Drafts']}>

            { //published blogs

                blogs == null ? <Loader /> : 
                 blogs.results.length ? 
                <>
                    {
                        blogs.results.map((blog, i) =>{
                             
                            return <AnimationWrapper key={i} transition={{delay: i* 0.04}}>

                                <ManagePublishedBlogCard blog={blog} />

                            </AnimationWrapper>
                        })
                    }
                </> 
                 : <NoDataMessage message={'No published blogs'} />
            }

            <h1>This is Draft Blogs</h1>

        </InPageNavigation>
    </>
  )
}

export default ManageBlogs