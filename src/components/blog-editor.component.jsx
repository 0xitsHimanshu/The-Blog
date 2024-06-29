import React, { useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import defaultBanner from "../imgs/blog banner.png"
import AnimationWrapper from "../common/page-animation";
import { uploadImage } from "../common/aws";

const BlogEditor = () => {

  const blogBannerRef = useRef();

  const handleBannerUpload = (e) => {
    let img = e.target.files[0];
    
    if(img){
      uploadImage(img).then((url) => {
        if(url){
          blogBannerRef.current.src = url;
        }
      })
    }

  }

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">New Blog</p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2">Publish</button>
          <button className="btn-light py-2">Save Draft</button>
        </div>
      </nav>
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
                <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey rounded-2xl">
                    <label htmlFor="uploadBanner">
                        <img ref={blogBannerRef} src={defaultBanner} className="z-20"/>
                        <input
                          type="file"
                          id="uploadBanner"
                          accept=".png, .jpeg, .jpg"
                          hidden
                          onChange={handleBannerUpload}
                        />
                    </label>
                </div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
