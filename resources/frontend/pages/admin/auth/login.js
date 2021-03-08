import React from 'react';
import axios from 'axios';
import { navigate } from '@reach/router';
import { Formik } from 'formik';
import TextField from '../../../components/form/text-field/text-field';
import Button from '../../../components/button/button';

import styles from './auth.module.scss';

export default function Login() {

    const sendData = (values, { setSubmitting }) => {
        const formData = new FormData();
        setSubmitting(true);
        Object.keys(values).map((key) => formData.append(key, values[key]));
        axios.post('/api/auth/login', formData).then((response) => {
            localStorage.access_token = response.data.access_token;
            axios.interceptors.request.use(function (config) {
                config.headers.Authorization = 'Bearer ' + localStorage.access_token;
                return config;
            });
            axios
                .get('/api/auth/user')
                .then((response) => {
                    navigate('/');
                })
                .catch(function (error) {
                    // handle error
                    navigate('/login');
                });
        });
    };

    return (
        <div className={styles.login}>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                }}
                onSubmit={(values, { setSubmitting }) => sendData(values, { setSubmitting })}
            >
                {({ values, handleSubmit, handleChange }) => (
                    <form id={'form'} onSubmit={handleSubmit} className={styles.form}>
                        <h3> Login </h3>
                        <TextField
                            label={"Email"}
                            name={'email'}
                            type={'text'}
                            onChange={handleChange}
                            value={values.email}
                        />
                        <TextField
                            label={'Password'}
                            name={'password'}
                            type={'password'}
                            onChange={handleChange}
                            value={values.password}
                            autoComplete={false}
                        />
                        <div className={styles.actions}>
                            <Button isSubmit={true} type="gray">
                                <span className={styles.button}>Login</span>
                            </Button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
}
