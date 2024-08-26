import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import pageNotFoundImgDark from "../imgs/404-dark.png";
import pageNotFoundImgLight from "../imgs/404-light.png";
import fullLogoDark from "../imgs/full-logo-dark.png";
import fullLogoLight from "../imgs/full-logo-light.png";
import { ThemeContext } from '../App';

const PageNotFound = () => {

  const {theme, setTheme} = useContext(ThemeContext);

  return (
    <section className='h-cover relative p-10 flex flex-col items-center gap-20 text-center'>
        <img src={theme=="light" ? pageNotFoundImgDark : pageNotFoundImgLight} className='select-none border-2 border-grey w-72 aspect-square object-cover rounded'/>

        <h1 className='text-4xl font-gelasio leading-7'>Page not found</h1>
        <p className='text-dark-grey text-xl leading-7 -mt-8'>The page you are looking does not exists. Kindly head back to our <Link to={"/"} className='text-black underline'> Home page </Link> </p>

        <div className='mt-auto'>
            <img src={theme=="light" ? fullLogoDark : fullLogoLight } className='h-8 object-contain block mx-auto select-none' /> 
            {/* have to change the full-logo in the end */}
            <p className='mt-5 text-dark-grey'>Read millions of stories around world.</p>
        </div>
    </section>
  )
}

export default PageNotFound