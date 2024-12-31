import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userContext';

const SignUp = props => {
    const user = useContext(UserContext).user
    const setUser = useContext(UserContext).setUser

    const handleSignUp = async (event) => {
        event.preventDefault()
        let data = new FormData(event.target);
        let username = data.get('username')
        let password = data.get('password')
        var res = null
        try {
            res = await axios.post("http://192.168.5.217:5000/create-user", {username, password})
        }
        catch {
            return;
        }
        
        let user = res.data.user
        if(user) {
          localStorage.setItem('user', JSON.stringify(user))
          setUser(user)
        //   fetchTracksByCollection(user.id)
        }
        else {
          alert("Server Error")
        }
      }

    return (
        <div style={{ marginTop: '10px' }}>
            <form onSubmit={(event) => handleSignUp(event)}>
                <div>
                <label>
                    Username:
                    <input type="text" name="username" />
                </label>
                </div>
                <div>
                <label>
                    Password:
                    <input type="password" name="password" />
                </label>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default SignUp