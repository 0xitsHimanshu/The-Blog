import React, { useContext, useEffect, useRef, useState } from 'react'
import AnimationWrapper from '../common/page-animation'
import InputBox from '../components/input.component'
import toast, { Toaster } from 'react-hot-toast';
import { UserContext } from '../App';
import axios from 'axios';

const ChangePassword = () => {
    let { userAuth: {accessToken} } = useContext(UserContext);

    const changePasswordForm = useRef();
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    const handleSubmit = (e) => {

        e.preventDefault();
        let form = new FormData(changePasswordForm.current);
        let formData = {};

        for( let [key, value] of form.entries()){
            formData[key] = value;
        }

        let {currentPassword, newPassword, confirmPassword} = formData;

        if(newPassword !== confirmPassword){
            return toast.error("Passwords do not match");
        }

        if(!currentPassword.length || !newPassword.length){
            return toast.error("Please fill the current and new password");
        }
        
        if(!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)){
            return toast.error("Password should be atleast 6 characters long and should contain atleast 1 uppercase letter, 1 lowercase letter and 1 number");
        }

        e.target.setAttribute('disabled', true);

        let loadingToast = toast.loading("Updating...");

        axios
         .post(`${import.meta.env.VITE_SERVER_URL}/users/change-password`, formData, {
            headers:{
                'Authorization': `Bearer ${accessToken}`,
            }
         })
         .then(() => {
            toast.dismiss(loadingToast);
            e.target.removeAttribute('disabled');
            return toast.success("Password changed successfully");
         })
         .catch(({response}) => {
            toast.dismiss(loadingToast);
            e.target.removeAttribute('disabled');
            return toast.error(response.data.error);
         })

    }


  return (
    <AnimationWrapper>
        <Toaster />
        <form ref={changePasswordForm} >
            <h1 className='max-md:hidden'>
                Change Password
            </h1>
            <div className='py-10 w-full md:max-w-[400px]'>
                <InputBox name={"currentPassword"} type={"password"} placeholder={"Current password"} className="profile-edit-input" icon={"fi-rr-unlock"}/>

                <InputBox name={"newPassword"} type={"password"} placeholder={"New password"} className="profile-edit-input" icon={"fi-rr-unlock"} />

                <InputBox name={"confirmPassword"} type={"password"} placeholder={"Confirm password"} className="profile-edit-input" icon={"fi-rr-unlock"} />


                <button onClick={handleSubmit} className='btn-dark px-10' type='submit'>Change Password</button>
            </div>
        </form>
    </AnimationWrapper>
  )
}

export default ChangePassword