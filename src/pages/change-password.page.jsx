import React, { useRef } from 'react'
import AnimationWrapper from '../common/page-animation'
import InputBox from '../components/input.component'
import toast, { Toaster } from 'react-hot-toast';

const ChangePassword = () => {
    const changePasswordForm = useRef();
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    const handleSubmit = (e) => {

        e.preventDefault();
        let form = new FormData(changePasswordForm.current);
        let formData = {};

        for( let [key, value] of form.entries()){
            formData[key] = value;
        }

        let {currentPassword, newPassword} = formData;

        if(!currentPassword.length || !newPassword.length){
            return toast.error("Please fill the current and new password");
        }

        if(!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)){
            return toast.error("Password should be atleast 6 characters long and should contain atleast 1 uppercase letter, 1 lowercase letter and 1 number");
        }

        
    }

  return (
    <AnimationWrapper>
        <Toaster />
        <form ref={changePasswordForm} >
            <h1 className='max-md:hidden'>
                Change Password
            </h1>
            <div className='py-10 w-full md:max-w-[400px]'>
                <InputBox name={"currentPassword"} type={"password"} placeholder={"Current password"} className="profile-edit-input" icon={"fi-rr-unlock"} />

                <InputBox name={"newPassword"} type={"password"} placeholder={"New password"} className="profile-edit-input" icon={"fi-rr-unlock"} />

                <button onClick={handleSubmit} className='btn-dark px-10' type='submit'>Change Password</button>
            </div>
        </form>
    </AnimationWrapper>
  )
}

export default ChangePassword