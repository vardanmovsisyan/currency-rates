import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from './text-field.module.scss';

export default function TextField({
                                      name,
                                      value,
                                      placeholder,
                                      type,
                                      error,
                                      onChange,
                                      autoComplete,
                                      disabled,
                                      label,
                                      hidden,
                                  }) {
    const [isActive, setActive] = useState(false);

    const handleOnBlur = () => value && value.toString().trim().length === 0 && setActive(false);

    const handleOnFocus = () => setActive(true);

    useEffect(() => {
        if (value || value === 0) {
            setActive(true);
        }
    }, []);

    return (
        <div className={`${styles.inputWrapper} ${hidden ? styles.hidden : ''}`}>
            {error && <div className={styles.error}>{error}</div>}
            {hidden && (
                <input
                    hidden={hidden}
                    id={name}
                    disabled={disabled ? "disabled" : false}
                    name={name}
                    className={styles.input}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    autoComplete="off"
                    onBlur={handleOnBlur}
                    onFocus={handleOnFocus}
                />
            )}
            {!hidden &&
            (autoComplete ? (
                <input
                    id={name}
                    disabled={disabled ? "disabled" : false}
                    name={name}
                    className={styles.input}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={handleOnBlur}
                    onFocus={handleOnFocus}
                />
            ) : (
                <input
                    id={name}
                    disabled={disabled ? "disabled" : false}
                    name={name}
                    className={styles.input}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    autoComplete="off"
                    onBlur={handleOnBlur}
                    onFocus={handleOnFocus}
                />
            ))}
            <label className={` ${isActive ? styles.active : styles.label} `} htmlFor={name}>
                {label}
            </label>
        </div>
    );
}
TextField.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    error: PropTypes.string,
    onChange: PropTypes.func,
    autoComplete: PropTypes.bool,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    hidden: PropTypes.bool,
};
TextField.defaultProps = {
    label: null,
    type: 'text',
    placeholder: '',
    value: '',
    error: '',
    autoComplete: true,
    onChange: () => {},
    name: '',
    disabled: false,
    hidden: false,
};
