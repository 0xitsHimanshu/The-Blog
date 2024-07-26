import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";

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

  let {
    personal_info: { fullname, username: profile_username, bio, profile_img },
    account_info: { total_posts, total_reads },
    social_links,
    joinedAt,
  } = profile;

  const fetchUserProfile = () => {
    axios
      .post(`${import.meta.env.VITE_SERVER_URL}/users/get-profile`, {
        username: profileId,
      })
      .then(({ data: user }) => {
        setProfile(user);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);
  return (
    <AnimationWrapper>
      {loading ? <Loader /> : 
        <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
            <div className="flex flex-col max-md:items-center gap-5 min-w-[250px]">
                <img src={profile_img} className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32" />
                <h1 className="text-xl "> @{profile_username}</h1>
                <p className="text-2xl capitalize h-6 font-medium">{fullname}</p>

                <p>{total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} Reads</p>
            </div>
        </section>
      }
    </AnimationWrapper>
  );
};

export default ProfilePage;
