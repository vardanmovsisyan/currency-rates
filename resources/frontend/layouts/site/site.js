import React from 'react';
import PropTypes from 'prop-types';
import Header from './components/header/header';

import styles from './site.module.scss';

export default function Site({ children }) {

    return (
        <>
            <Header />
            <main className={styles.main}>
                {children}
            </main>
        </>
    );
}

Site.propTypes = {
    children: PropTypes.node.isRequired,
};


