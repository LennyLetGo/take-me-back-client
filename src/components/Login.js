import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userContext';

const Login = props => {
    const user = useContext(UserContext).user
    const setUser = useContext(UserContext).setUser

    const handleSignIn = async (event) => {
        event.preventDefault()
        let data = new FormData(event.target);
        let username = data.get('username')
        let password = data.get('password')
        var res = null
        try{
            res = await axios.post("http://ec2-3-128-188-22.us-east-2.compute.amazonaws.com:5000/login", {username, password})
        }
        catch {
            return
        }
        let user = res.data.user
        if(user) {
          localStorage.setItem('user', JSON.stringify(user))
          setUser(user)
        //   fetchTracksByCollection(user.id)
        }
        else {
          alert("Invalid username or password")
        }
      }

    return (
        <div style={{ marginTop: '10px' }}>
            <form onSubmit={(event) => handleSignIn(event)}>
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

export default Login