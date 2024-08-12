import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../App'
import axios from 'axios';
import { profileDataStructure } from './profile.page';
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';
import toast, { ToastBar, Toaster } from 'react-hot-toast';
import InputBox from '../components/input.component';
import { uploadImage } from '../common/aws';
import { StoreinSession } from '../common/session';

const EditProfile = () => {
    const bioLimit = 150;
    const profileImgRef = useRef();
    const editProfileForm = useRef();

    const {userAuth, setUserAuth} = useContext(UserContext)
    const accessToken = userAuth?.accessToken;
    const username = userAuth?.user?.username;

    const [profile, setProfile] = useState(profileDataStructure)
    const [loading, setLoading] = useState(true)
    const [characterLeft, setCharacterLeft] = useState(bioLimit);
    const [updatedProfileImg, setUpdatedProfileImg] = useState(null);


    const {personal_info:{profile_img, fullname, username: profile_username, email, bio}, social_links} = profile;

    useEffect(() => {
        
        if(accessToken){
            axios
             .post(`${import.meta.env.VITE_SERVER_URL}/users/get-profile`, {username: username})
             .then(({data}) => {
                 setProfile(data)
                 setLoading(false);
              })
             .catch((err)=> {
                 console.log(err);
                 setLoading(false);
              })
             
        }
    }, [accessToken])

    const handleCharacterChange = (e) => {
        setCharacterLeft(bioLimit - e.target.value.length);
    }

    const handleImagePreview = (e) => {

        let img = e.target.files[0];
        profileImgRef.current.src = URL.createObjectURL(img);
        setUpdatedProfileImg(img);

    }

    const handleUploadImg = (e) => {
        e.preventDefault();

        if(updatedProfileImg){
            let loadingToast = toast.loading('Uploading image...');
            e.target.setAttribute('disabled', true);

            uploadImage(updatedProfileImg)
             .then(url => {
                if(url){
                    axios
                     .post(`${import.meta.env.VITE_SERVER_URL}/users/change-profile-img`, {url}, {
                        headers:{
                            'Authorization': `Bearer ${accessToken}`
                        }
                      })
                     .then(({data}) => {
                        let newUserAuth = { ...userAuth, user: { ...userAuth.user, profile_img: data.profile_img } };

                        StoreinSession("user",JSON.stringify(newUserAuth));
                        setUserAuth(newUserAuth);

                        setUpdatedProfileImg(null);
                        
                        toast.dismiss(loadingToast)
                        e.target.removeAttribute('disabled');
                        toast.success('Uploaded 👍')
                     })
                     .catch(({response}) => {
                        toast.dismiss(loadingToast)
                        e.target.removeAttribute('disabled');
                        toast.error(response.data.error);
                     })
                }
             })
             .catch(err => {
                toast.error('Failed to upload image. Try again later');
             })
        }
    }

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        let form = new FormData(editProfileForm.current)

        let formData = {};

        for(let [key, value] of form.entries()){
            formData[key] = value;
        }
        
        let {username, bio, youtube, facebook, twitter, instagram, github, website} = formData;

        if(username.length < 3){
            return toast.error('Username must be atleast 3 characters long');
        }
        if(bio.length > bioLimit){
            return toast.error(`Bio should be less than ${bioLimit} characters`);
        }

        let loadingToast = toast.loading('Updating profile...');
        e.target.setAttribute('disabled', true);

        axios
         .post(`${import.meta.env.VITE_SERVER_URL}/users/update-profile`, {username, bio, social_links: {youtube, facebook, twitter, instagram, github, website}},{
            headers:{
                'Authorization': `Bearer ${accessToken}`
            }
         })
         .then(({data}) => {
            if(userAuth.user.username != data.username){
                let newUserAuth = { ...userAuth, user: { ...userAuth.user, username: data.username } };

                StoreinSession("user",JSON.stringify(newUserAuth));
                setUserAuth(newUserAuth);
            }

            toast.dismiss(loadingToast)
            e.target.removeAttribute('disabled');
            toast.success('Profile updated 👍'
            )
         })
         .catch(({response}) => {
            toast.dismiss(loadingToast)
            e.target.removeAttribute('disabled');
            toast.error(response.data.error)
         })
    }

  return (
    <AnimationWrapper>
        {
            loading ? <Loader /> : 
            
            <form ref={editProfileForm}>
                <Toaster />

                <h1 className='max-md:hidden'>Edit profile</h1>

                <div className='flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10 '>
                    <div className='max-lg:center mb-5'>
                        <label htmlFor="uploadImg" id='profileImgLabel' className='relative block bg-grey rounded-full w-48 h-48 overflow-hidden border border-dark-grey/20'>
                            <div className='w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer'>
                                Upload Image 
                            </div>
                            <img ref={profileImgRef} src={profile_img} />
                        </label>
                        <input type='file' id='uploadImg' accept='.jpeg, .png , .jpg' hidden onChange={handleImagePreview}/>
                        <button className='btn-light mt-5 max-lg:center lg:w-full px-10' type='button' onClick={handleUploadImg}>Upload</button> 
                    </div>

                    <div className='w-full'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 sm:gap-5 md:grid-cols-2 md:gap-5'>
                            <div>
                                <InputBox name={"fullname"} type={"text"} value={fullname} placeholder={"Fullname"} disable={true} icon={"fi-rr-user"}/>
                            </div>

                            <div>
                                <InputBox name={"email"} type={"email"} value={email} placeholder={"email"} disable={true} icon={"fi-rr-envelope"}/>
                            </div>
                        </div>

                        <InputBox name={"username"} type={"text"} value={profile_username} placeholder={"username"} icon={"fi-rr-at"}/>

                        <p className='text-dark-grey -mt-3 text-sm'> * Username will use to search user and will be visible to all users.</p>

                        <textarea name="bio" maxLength={bioLimit} defaultValue={bio} placeholder='bio...' className='input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5 placeholder:text-dark-grey' onChange={handleCharacterChange}></textarea>
                        <p className='text-dark-grey text-right'>{characterLeft} characters left</p>

                        <p className='my-6 text-dark-grey'>Add your social handle below</p>

                        <div className='md:grid md:grid-cols-2 gap-x-6'>
                            {
                                Object.keys(social_links).map((key, index) => {
                                    let link = social_links[key];

                                    
                                    return <InputBox key={index} name={key} type={"text"} value={social_links[key]} placeholder={"https://"} icon={("fi "+ (key != 'website' ? "fi-brands-" + key : "fi-rr-globe"))}/>
                                })
                            }
                        </div>
                        <button className='btn-dark relative w-auto mt-7 mx-auto center' type='submit' onClick={handleUpdateProfile}>Update</button>
                    </div>

                </div>
            </form>
        }
    </AnimationWrapper>
  )
}

export default EditProfile