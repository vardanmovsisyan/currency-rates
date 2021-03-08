import React, { useState, useEffect } from 'react';
import Loader from '../../components/loader/loader';
import { navigate } from '@reach/router';
import axios from 'axios';

export default function PrivateRoute({ as: Component, ...props }) {
    const [isUserLoggedIn, setUserLoggedIn] = useState(false);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof localStorage.access_token == 'undefined') {
            setLoading(false);
            navigate('/login');
        }
        axios.interceptors.request.use(function (config) {
            config.headers.Authorization = 'Bearer ' + localStorage.access_token;
            return config;
        });
        axios
            .get('/api/auth/user')
            .then((response) => {
                if (response.data.name) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                    setLoading(false);
                    setUserLoggedIn(true);
                }
            })
            .catch(function (error) {
                setLoading(false);
                navigate('/login');
            });
    }, []);

    return (
        <>
            {isLoading ? <Loader /> : isUserLoggedIn && <Component {...props} />}
        </>
    );
}
