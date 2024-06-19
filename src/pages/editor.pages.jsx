import React , {useContext, useState} from 'react'
import { UserContext } from '../App'
import { Navigate } from 'react-router-dom';
import BlogEditor from '../components/blog-editor.component';
import PublishForm from '../components/publish-form.component';

const Editor = () => {

  const [editorState, setEditorState] = useState("editor");
  let {userAuth: {accessToken}} = useContext(UserContext);


  return (

    accessToken === null ? <Navigate to={"/signin"} />
    : editorState == 'editor' ? <BlogEditor /> : <PublishForm />

  )
}

export default Editor