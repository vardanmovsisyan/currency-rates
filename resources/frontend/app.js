import React from 'react';
import ReactDOM from 'react-dom';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import { Router } from '@reach/router';
import PrivateRoute from './components/private-route/private-route';

import styles from './app.module.scss';
// Website
import Site from './layouts/site/site';
import Home from "./pages/site/home/home";

//Admin Panel
import Login from './pages/admin/auth/login';

export default function App() {
    return (
        <div>
            <Router className={styles.router}>
                <Login path="/login" />
                <PrivateRoute as={Site} path="/">
                    <Home path="/"/>
                </PrivateRoute>
            </Router>
        </div>
    );
}

if (document.getElementById('root')) {
    ReactDOM.render(<App />, document.getElementById('root'));
}
