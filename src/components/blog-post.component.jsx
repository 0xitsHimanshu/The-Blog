import React from "react";
import { getDay } from "../common/date";
import { Link } from "react-router-dom";

const BlogPostCard = ({ content, author }) => {
  let {
    publishedAt,
    tags,
    title,
    des,
    banner,
    activity: { total_likes },
    blog_id: id,
  } = content;
  let { fullname, profile_img, username } = author;

  return (
    <Link
      to={`/blog/${id}`}
      className="flex gap-8 items-center border-b border-grey pb-5 mb-4"
    >
      <div className="w-full">
        <div className="flex gap-2 items-center mb-7">
          <img src={profile_img} className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1">
            {fullname} @{username}
          </p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
        </div>

        <h1 className="blog-title">{title}</h1>

        <p className="my-7 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">
          {des}
        </p>

        <div className="flex-shrink-0 mt-7" style={{ width: "100%" }}>
          <div className="flex flex-wrap gap-4">
            {tags.map((tag, index) => (
              <span key={index} className="btn-light py-1 px-4">
                {tag}
              </span>
            ))}
            <span className="ml-3 flex items-center gap-2 text-dark-grey">
              <i className="fi fi-rr-heart text-xl"></i>
              {total_likes}
            </span>
          </div>
        </div>
      </div>

      <div className="h-28 aspect-square bg-grey rounded-lg">
        <img
          src={banner}
          className="w-full h-full aspect-square object-cover rounded-lg"
          alt=""
        />
      </div>
    </Link>
  );
};

export default BlogPostCard;
