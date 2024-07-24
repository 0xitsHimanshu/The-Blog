import React, { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import axios from "axios";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import { activeTabRef } from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";

const HomePage = () => {

  let [blogs, setBlog] = useState(null);
  let [trendingBlogs, setTrendingBlogs] = useState(null);
  let [pageState, setPageState] = useState("home");
  let Categories = ["Programming", "Technology", "Lifestyle", "Health", "Finance", "Logo", "Space"]

  const fetchLatestBlogs = ({page = 1}) => {
    axios
      .post(`${import.meta.env.VITE_SERVER_URL}/blog/latest-blogs`, {page})
      .then(async ({ data }) => {
        // format the data 
        let formatedData = await filterPaginationData({
            state: blogs,
            data: data.blogs,
            page,
            countRoute: "/blog/all-latest-blogs-count",
        })

        setBlog(formatedData);
      })
      .catch((err) => console.log(err));
  };

  const fetchBlogbyCategory = ({page = 1}) => {
    axios
      .post(`${import.meta.env.VITE_SERVER_URL}/blog/search-blogs`, {tag: pageState, page})
      .then( async ({ data }) => {

        let formatedData = await filterPaginationData({
            state: blogs,
            data: data.blogs,
            page,
            countRoute: "/blog/search-blogs-count",
            data_to_send: {tag: pageState}
        })

        setBlog(formatedData);
      })
      .catch((err) => console.log(err));
  }

  const fetchTrendingBlogs = () => {
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/blog/trending-blogs`)
      .then(({ data }) => {
        setTrendingBlogs(data.blogs);
      })
      .catch((err) => console.log(err));
  };

  const loadBlogByCategory = (e) => {
    let category = e.target.innerText.toLowerCase();
    
    setBlog(null);

    if(pageState == category){
        setPageState("home");
        return;
    }

    setPageState(category)
  };

  useEffect(() => {

    activeTabRef.current.click();

    if(pageState == "home")
        fetchLatestBlogs({page: 1});
    else
        fetchBlogbyCategory({page: 1});

    if(!trendingBlogs)
        fetchTrendingBlogs();


  }, [pageState]);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justi gap-10 ">
        {/* Latest blogs */}
        <div className="w-full">
          <InPageNavigation
            routes={[pageState, "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
            
              {blogs == null ? (
                <Loader />
              ) : (
                blogs.results.length ?
                blogs.results.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <BlogPostCard
                        content={blog}
                        author={blog.author.personal_info}
                      />
                    </AnimationWrapper>
                  );
                }) :
                <NoDataMessage message="No blogs found" />
              )}
              <LoadMoreDataBtn state={blogs} fetchDataFucn={(pageState == 'home' ? fetchLatestBlogs : fetchBlogbyCategory )} />
            </>

            {/* Trending blogs --> Below */}
            {trendingBlogs == null ? (
              <Loader />
            ) : (
              trendingBlogs.length ?
              trendingBlogs.map((blog, i) => {
                return (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={i}
                  >
                    <MinimalBlogPost blog={blog} index={i} />
                  </AnimationWrapper>
                );
              }) :
              <NoDataMessage message="No trending blogs found" />
            )}
          </InPageNavigation>
        </div>

        {/* filters   */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">
                Stories form all interests
              </h1>

              <div className="flex gap-3 flex-wrap">
                {Categories.map((category, i) => {
                    const categorytoLower = category.toLowerCase();
                  return (
                    <button
                      onClick={loadBlogByCategory}
                      className={
                        "tag " + (pageState === categorytoLower ? " bg-black text-white ": " ")
                      }
                      key={i}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending <i className="fi fi-rr-arrow-trend-up"></i>
              </h1>

              {trendingBlogs == null ? (
                <Loader />
              ) : (
                trendingBlogs.length ? 
                trendingBlogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <MinimalBlogPost blog={blog} index={i} />
                    </AnimationWrapper>
                  );
                }) :
                <NoDataMessage message="No trending blogs found" />
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
