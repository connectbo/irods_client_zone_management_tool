import React, { useState } from 'react';

import Cookies from 'js-cookie';

import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import '../App.css';

function Authenticate() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [logged, setLoggin] = useState(false);

    const handleUsername = event => {
        setUsername(event.target.value);
    }

    const handlePassword = event => {
        setPassword(event.target.value);
    }

    async function handleAuthenticate() {
        const authResult = await axios({
            method: 'POST',
            url: 'http://54.210.60.122:80/irods-rest/1.0.0/auth',
            params: {
                user_name: username,
                password: password,
                auth_type: 'native'
            }
        }).then(res => {
            if (res.status == 200) {
                console.log(token)
                Cookies.set('token', res.data, { expires: new Date().getTime() + 60 * 60 * 1000 });
                setToken(res.data)
                window.location.replace(window.location.href + 'home');
            }
        })
    }

    async function handleList() {
        console.log(token);
        const listResult = await axios({
            method: 'GET',
            url: 'http://54.210.60.122:80/irods-rest/1.0.0/list',
            params: {
                'path': '/tempZone/home/rods',
                'stat': 'False',
                'permissions': 'False',
                'offset': '0',
                'limit': '100'
            },
            headers: {
                'Accept': 'application/json',
                'Authorization': `${token}`
            }
        }).then(res => {
            console.log(res);
            console.log(Cookies.get('token'));
        })
    }

    return (
        <div>
            <div className="login">
                <b>iRODS Administrator Dashboard</b>
                <hr />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        label="Username"
                        required
                        onChange={handleUsername} />
                    <br />
                    <TextField
                        label="Password"
                        type="password"
                        required
                        onChange={handlePassword} />
                    <br />
                    <button className="login-button" onClick={handleAuthenticate}>Login</button>
            </div>
        </div>
    );
}

export default Authenticate;
