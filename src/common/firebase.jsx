// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnZncRIeiRgYVsaVuLyxw77dI310VFFho",
  authDomain: "the-blog-react-js.firebaseapp.com",
  projectId: "the-blog-react-js",
  storageBucket: "the-blog-react-js.appspot.com",
  messagingSenderId: "885776497863",
  appId: "1:885776497863:web:96c8e1df47068570ed12e2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle = async () => {
    let user = null;

    await signInWithPopup(auth, provider)
     .then((result)=>{
        user = result.user;
     })
     .catch((error)=>{
        console.log(error);
     });

    return user;
};