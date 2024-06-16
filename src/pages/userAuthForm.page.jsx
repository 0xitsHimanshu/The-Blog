import React, { useContext, useRef } from "react";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link, Navigate } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { StoreinSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
  const authform = useRef(null);
  let {
    userAuth: { accessToken },
    setUserAuth,
  } = useContext(UserContext);

  //   console.log(accessToken);

  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_URL + "/users" + serverRoute, formData)
      .then(({ data }) => {
        StoreinSession("user", JSON.stringify(data));
        setUserAuth(data);
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //defining the server route
    let serverRoute = type == "sign-in" ? "/signin" : "/signup";

    // regex for email and password
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    let form = new FormData(authform.current);
    let formData = {};

    form.forEach((value, key) => {
      formData[key] = value;
    });

    let { name, email, password } = formData;

    if (name)
      if (name.length < 3)
        return toast.error("Name should be atleast 3 characters long");
    if (!emailRegex.test(email)) return toast.error("Invalid email");
    if (!passwordRegex.test(password))
      return toast.error(
        "Password should be atleast 6 characters long and should contain atleast 1 uppercase letter, 1 lowercase letter and 1 number"
      );

    userAuthThroughServer(serverRoute, formData);
  };

  const handleGoogleAuth =  (e) => {

    e.preventDefault();

    authWithGoogle().then( user => {
        console.log(user);
    }).catch( err => {
        toast.error("Trouble login through google");
        return console.log(err);
    });

  };

  return accessToken ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper key={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form ref={authform} className="w-[80%] max-w-[400px]">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type == "sign-in" ? "Welcome back" : "Join us today"}
          </h1>

          {type != "sign-in" ? (
            <InputBox
              name="name"
              type="text"
              placeholder="Name"
              icon="fi-rr-user"
            />
          ) : (
            ""
          )}

          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
          />

          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-key"
          />

          <button
            className="btn-dark center mt-14"
            type="submit"
            onClick={handleSubmit}
          >
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
                  onClick={handleGoogleAuth}  
          >
            <img src={googleIcon} className="w-5" />
            continue with google
          </button>

          { 
            type == "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account?
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join us today.
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member ?
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign in here.
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
