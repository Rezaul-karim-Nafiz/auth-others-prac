import './App.css';
import { useState } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo:''
  });

  const handleSignIn = () =>{
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const{displayName, photoURL, email} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser)
    })
    .catch(err => {
      console.log(err)
      console.log(err.message)
    })
  }
  const handleSignOut = () =>{
    firebase.auth().signOut()
    .then(res => {
      const signOutUser ={
        isSignedIn: false,
        name: '',
        email: '',
        photo: ''
      }
      setUser(signOutUser)
    })
    .catch((error) => {
      console.log(error)
    });
  }


  return (
    <div style={{textAlign: 'center'}}>
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button>:
        <button onClick={handleSignIn}>Sign In</button>
      }
      {
        user.isSignedIn && <div>
          <img src={user.photo} alt="" />
          <h2>{user.name}</h2>
          <h4>{user.email}</h4>
        </div>
      }

    </div>
  );
}

export default App;
