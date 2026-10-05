import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { setAccessTokenUpdater } from "../api/axios";







export const AuthContext = createContext();

const AuthProvider = ({children}) => {
    // const [user, setUser] = useState( JSON.parse(localStorage.getItem('user')) || null );
    // const [token, setToken] = useState(localStorage.getItem('token'));
    const [accessToken, setAccessToken] = useState(
        localStorage.getItem('accessToken')
    );

    const [userType, setUserType] = useState(
        localStorage.getItem('user_type')
    );

    const updateAccessToken = (newAccessToken) => {
        // localStorage.setItem('accessToken', newAccessToken);
        setAccessToken(newAccessToken);
    };

    useEffect(() => {
        setAccessTokenUpdater(updateAccessToken);
    }, []);

    const navigate = useNavigate()

    const login = (data) => {
        // localStorage.setItem('token', data.token)
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('user_type', data.user_type)
        localStorage.setItem('user', JSON.stringify(data.user))

        setAccessToken(data.access)
        setUserType(data.user_type)
        // setToken(data.token);
        // setUser(data.user);
    } 


    // console.log(accessToken);

    const logout = () => {
        localStorage.clear();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user_type');
        localStorage.removeItem('user');


        setAccessToken(null)
        setUserType(null)

        navigate('/')
    };


    return (
        <AuthContext.Provider value={{login, logout, accessToken, userType}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
