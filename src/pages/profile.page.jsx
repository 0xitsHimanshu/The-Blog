import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { UserContext } from "../App";
import About from "../components/about.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import InPageNavigation from "../components/inpage-navigation.component";
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";
import PageNotFound from "./404.page";

export const profileDataStructure = {
  personal_info: {
    fullname: "",
    email: "",
    username: "",
    bio: "",
    profile_img: "",
  },
  social_links: {},
  account_info: {
    total_posts: "",
    total_reads: "",
  },
  joinedAt: "",
};

const ProfilePage = () => {
  let { id: profileId } = useParams();
  let [profile, setProfile] = useState(profileDataStructure);
  let [loading, setLoading] = useState(true);
  let [blogs, setBlogs] = useState(null);
  let [profileLoaded, setProfileLoaded] = useState("");

  let {
    personal_info: { fullname, username: profile_username, bio, profile_img },
    account_info: { total_posts, total_reads },
    social_links,
    joinedAt,
  } = profile;

  // let {
  //   userAuth: {
  //     user: { username },
  //   },
  // } = useContext(UserContext);

  let userContext = useContext(UserContext);
  let username = userContext?.userAuth?.user?.username;

  const fetchUserProfile = () => {
    setLoading(true);
    axios
      .post(`${import.meta.env.VITE_SERVER_URL}/users/get-profile`, {
        username: profileId,
      })
      .then(({ data: user }) => {
        if(user){
          setProfile(user);
          setProfileLoaded(profileId)
          getBlogs({ user_id: user._id });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getBlogs = ({ page = 1, user_id }) => {
    user_id = user_id == undefined ? blogs.user_id : user_id;

    axios
      .post(`${import.meta.env.VITE_SERVER_URL}/blog/search-blogs`, {
        author: user_id,
        page,
      })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/blog/search-blogs-count",
          data_to_send: { author: user_id },
        });

        formatedData.user_id = user_id;
        setBlogs(formatedData);
      });
  };

  useEffect(() => {
    if(profileId != profileLoaded){
      setBlogs(null);
    }
    if(blogs == null){
      resetState();
      fetchUserProfile();
    }
    
  }, [profileId, blogs]);

  const resetState = () => {
    setProfile(profileDataStructure); 
    setLoading(true);
    setProfileLoaded("");
  };

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (

        profile_username ? 
            <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
              <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[40%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">
                <img
                  src={profile_img}
                  className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"
                />
                <h1 className="text-xl "> @{profile_username}</h1>
                <p className="text-2xl capitalize h-6 font-medium">{fullname}</p>

                <p>
                  {total_posts.toLocaleString()} Blogs -{" "}
                  {total_reads.toLocaleString()} Reads
                </p>

                <div className="flex gap-4 mt-2">
                  {profileId == username ? (
                    <Link
                      to={"/settings/edit-profile"}
                      className="btn-light rounded-md"
                    >
                      Edit Profile
                    </Link>
                  ) : (
                    " "
                  )}
                </div>

                <About
                  className={"max-md:hidden "}
                  bio={bio}
                  socialLinks={social_links}
                  joinedAt={joinedAt}
                />
              </div>

              <div className="max-md:mt-12 w-full ">
                <InPageNavigation
                  routes={["Blogs Published", "About"]}
                  defaultHidden={["About"]}
                >
                  <>
                    {blogs == null ? (
                      <Loader />
                    ) : blogs.results.length ? (
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
                      })
                    ) : (
                      <NoDataMessage message="No blogs found" />
                    )}
                    <LoadMoreDataBtn state={blogs} fetchDataFucn={getBlogs} />
                  </>

                
                  <About bio={bio} socialLinks={social_links} joinedAt={joinedAt} />
                </InPageNavigation>
              </div>
            </section>
        :
        <PageNotFound />
      )}
    </AnimationWrapper>
  );
};

export default ProfilePage;
