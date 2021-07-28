import './App.css';
import { useState } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  

  const [newUser, setNewUser] = useState(false)
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo:'',
    error: '',
    success: false
  });
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();

  const handleSignIn = () =>{
    firebase.auth().signInWithPopup(googleProvider)
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


  const handleSubmit = (e) =>{
    if (newUser && user.email && user.password) {
        firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
      
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo)

        updateUserName(user.name)
        
      })
      .catch((error) => {
        const newUserInfo ={...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo)
      });
    }
    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then((res) => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo)
        console.log('sign in user info', res.user)
      })
      .catch((error) => {
        const newUserInfo ={...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo)
      });
    }
    e.preventDefault();
  }


  const handleBlur = (e) =>{
    let isFormValid = true;
    if (e.target.name === 'email') {
      isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFormValid = isPasswordValid && passwordHasNumber;
    }
    if (isFormValid) {
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo)
    }
  }
  
  const updateUserName = (name) =>{
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,

    }).then(() => {
      console.log('user name update successfully')
    }).catch((error) => {
      console.log(error)
    });  
  }
  
  const handleFbSignIn = () =>{
  firebase
  .auth()
  .signInWithPopup(fbProvider)
  .then((result) => {
    var user = result.user;
    console.log(user)
  })
  .catch((error) => {
    var errorMessage = error.message;
    console.log(errorMessage)
  });
  }
  return (
    <div style={{textAlign: 'center'}}>
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button>:
        <button onClick={handleSignIn}>Sign In</button>
      }
      <br />

      <button onClick={handleFbSignIn}>log in with facebook</button>

      {
        user.isSignedIn && <div>
          <img src={user.photo} alt="" />
          <h2>{user.name}</h2>
          <h4>{user.email}</h4>
        </div>
      }
      <h1>React Authentication</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>password: {user.password}</p>

      <input type="checkbox" onChange={() =>setNewUser(!newUser)} name="newUser"/>
      <label htmlFor="newUser">New User Sign Up</label>
      <form onSubmit={handleSubmit}>
        {newUser && <input type="text" name="name" placeholder="Your Name" onBlur={handleBlur} required/>}<br />
        <input type="text" placeholder="Your Email" name="email" onBlur={handleBlur}  required /><br />
        <input type="password" placeholder="Enter Your Password" name="password" onBlur={handleBlur} required/><br />
        <input type="submit" value={newUser ? 'sign up' : 'sign in'} />
      </form>
      <p style={{color: 'red'}}>{user.error}</p>
      {
        user.success && <p style = {{color: 'green'}}>User {newUser ? 'Created': 'Logged In'} Successfully</p>
      }
      
    </div>
  );
}

export default App;
