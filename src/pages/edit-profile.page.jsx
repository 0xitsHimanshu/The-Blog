import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../App'
import axios from 'axios';
import { profileDataStructure } from './profile.page';
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';

const EditProfile = () => {

    const {userAuth} = useContext(UserContext)
    const accessToken = userAuth?.accessToken;
    const username = userAuth?.user?.username;

    const [profile, setProfile] = useState(profileDataStructure)
    const [loading, setLoading] = useState(true)

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

  return (
    <AnimationWrapper>
        {
            loading ? <Loader /> : <h1>Edit Profile</h1>
        }
    </AnimationWrapper>
  )
}

export default EditProfile