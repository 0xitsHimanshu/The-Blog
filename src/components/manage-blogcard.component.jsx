import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { getDay } from '../common/date';

const BlogStats = ({stats}) => {

  return (
    <div className="flex gap-2 max-lg:mb-6 max-lg:pb-6 max-lg:border-grey max-lg:border-b">
      {
      Object.keys(stats).map((key, i) => {
        return !key.includes("parent") ? 
          <div key={i} className={"flex flex-col items-center w-full h-full justify-center p-4 px-6 "+ (i != 0 ? " border-grey border-l" : "") }>
            <h1 className='text-xl lg:text-2xl mb-2'>{stats[key].toLocaleString()}</h1>
            <p className='max-lg:text-dark-grey capitalize'>{key.split("_")[1]}</p>
          </div> : ""
      })}
    </div>
  );
}

export const ManagePublishedBlogCard = ({blog}) => {
  
  const [showStats, setShowStats] = useState(false)

  let {banner , blog_id, title, publishedAt, activity} = blog;
  
  return (
      <>
        <div className='flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center'>
            <img src={banner} className='max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-grey object-cover' />

            <div className='flex flex-col justify-between py-2 w-full min-w-[300px]'>

              <div >
                  <Link to={`/blog/${blog_id}`} className='blog-title mb-4 hover:underline'>{title}</Link>

                  <p className='line-clamp-1'>Published on {getDay(publishedAt)}</p>
              </div>

              <div className='flex gap-6 mt-3'>
                  <Link to={`/editor/${blog_id}`} className='px-4 py-2 underline hover:bg-black/20 rounded-full'>Edit</Link>
                  <button 
                    className='lg:hidden px-4 py-2 underline text-twitter hover:bg-twitter/30 rounded-full flex items-center' onClick={()=> setShowStats(preVal => !preVal)}
                    >Stats
                  </button>
                  <button className='px-4 py-2 underline text-red hover:bg-red/30 rounded-full flex items-center'>Delete</button>
              </div>
            </div>

            <div className='max-lg:hidden'>
               <BlogStats stats={activity}/>
            </div>
        </div>

        {
          showStats ? <div className='lg:hidden'><BlogStats stats={activity}/></div> : ""
        }
      </>
  )
}

export const ManageDraftBlogCard = ({Draft, index}) => {

  let {title, des, blog_id} = Draft;
  
  return (
    <div className='flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-grey'>
       <h1 className='blog-index text-center pl-4 md:pl-6 flex-none'>{index < 10 ? '0'+index : index }</h1>

       <div>
        <h1 className='blog-title mb-3'>{title}</h1>

        <p className='line-clamp-2 '>{des.length ? des : 'No description'}</p>

        <div className='flex gap-6 mt-3'>
          <Link to={`/editor/${blog_id}`} className="px-4 py-2 underline hover:bg-black/20 rounded-full">Edit</Link>
          <button className="px-4 py-2 text-red hover:bg-red/20 rounded-full">Delete</button>
        </div>

       </div>
    </div>
  )
}