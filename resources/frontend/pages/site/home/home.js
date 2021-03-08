import React, {useState, useEffect} from 'react';
import TextField from "../../../components/form/text-field/text-field";
import {Formik, Field} from "formik";
import Select from "react-select";
import axios from "axios";

import styles from './home.module.scss'

const titles = ["#", "Currency", "Rate"];
const conversionTitles = ["#", "From Currency", "From Amount", "To Currency", "To Amount", "User", "Date"];

const Home = () => {

    const [currencies, setCurrencies] = useState([]);

    const [conversions, setConversions] = useState([]);

    useEffect(() => {
        axios.get("/api/data")
            .then(response => {
                setCurrencies(response.data.currencies);
                setConversions(response.data.conversions);
            })
    }, []);

    const handleChangeInput = (val, key, setFieldValue, values) => {
        setFieldValue(key, val);
        if (key === "currency_from") {
            if (val && values.currency_to && values.amount_from) {
                const fD = new FormData();
                fD.append("currency_from", val);
                fD.append("currency_to", values.currency_to);
                setFieldValue("amount_from", parseFloat(values.amount_from).toFixed(3));
                fD.append("amount_from", parseFloat(values.amount_from).toFixed(3));
                axios.post("/api/conversion", fD)
                    .then(response => {
                        setConversions(response.data.conversions);
                        setFieldValue("amount_to", response.data.amount);
                    });
            }
        }
        if (key === "currency_to") {
            if (val && values.currency_from && values.amount_from) {
                const fD = new FormData();
                fD.append("currency_from", values.currency_from);
                fD.append("currency_to", val);
                setFieldValue("amount_from", parseFloat(values.amount_from).toFixed(3));
                fD.append("amount_from", parseFloat(values.amount_from).toFixed(3));
                axios.post("/api/conversion", fD)
                    .then(response => {
                        setConversions(response.data.conversions);
                        setFieldValue("amount_to", response.data.amount);
                    });
            }
        }
        if (key === "amount_from") {
            if (val && values.currency_from && values.currency_to) {
                const fD = new FormData();
                fD.append("currency_from", values.currency_from);
                fD.append("currency_to", values.currency_to);
                setFieldValue("amount_from", parseFloat(val).toFixed(3));
                fD.append("amount_from", parseFloat(val).toFixed(3));
                axios.post("/api/conversion", fD)
                    .then(response => {
                        setConversions(response.data.conversions);
                        setFieldValue("amount_to", response.data.amount);
                    });
            }
        }
    };

    return currencies && !!currencies.length && (
        <div className={styles.root}>
            <div className={styles.layout}>
                <div>
                    <Formik
                        initialValues={{
                            currency_from: false,
                            amount_from: 0,
                            currency_to: false,
                            amount_to: 0
                        }}
                    >
                        {({ values, handleSubmit, setFieldValue }) => (
                            <form id={'form'} onSubmit={handleSubmit}>
                                <Field
                                    component={Select}
                                    options={currencies}
                                    placeholder={"From"}
                                    isClearable
                                    getOptionLabel={option => option.name}
                                    getOptionValue={option => option.id}
                                    onChange={(option) =>
                                        handleChangeInput(option ? option.id : false, "currency_from", setFieldValue, values)
                                    }
                                    value={currencies.find(currency => currency.id === parseInt(values.currency_from)) || false}
                                />
                                <TextField
                                    label={'Amount From'}
                                    name={'amount_from'}
                                    type={'number'}
                                    onChange={(e) => handleChangeInput(e.target.value, "amount_from", setFieldValue, values)}
                                    value={values.amount_from}
                                    autoComplete={false}
                                />
                                <Field
                                    component={Select}
                                    options={currencies}
                                    placeholder={"To"}
                                    isClearable
                                    getOptionLabel={option => option.name}
                                    getOptionValue={option => option.id}
                                    onChange={(option) =>
                                        handleChangeInput(option ? option.id : false, "currency_to", setFieldValue, values)
                                    }
                                    value={currencies.find(currency => currency.id === parseInt(values.currency_to)) || false}
                                />
                                <TextField
                                    label={'Amount To'}
                                    name={'amount_to'}
                                    type={'number'}
                                    value={values.amount_to}
                                    autoComplete={false}
                                    disabled
                                />
                            </form>
                        )}
                    </Formik>
                </div>
                <div>
                    <table className={styles.table}>
                        <thead className={styles.tableHead}>
                        <tr>
                            {titles.map(title =>
                                <th
                                    key={title}
                                    className={`
                                ${styles.tableHeadCell}
                                ${title === "Rate" ? styles.tableRateCell : ""}
                            `}
                                >
                                    {title}
                                </th>
                            )}
                        </tr>
                        </thead>
                        <tbody>
                        {currencies.map((currency, index) =>
                            <tr key={currency.name} className={styles.tableRow}>
                                <td key={"#"} className={styles.tableCell}>{index+1}</td>
                                <td key={"currency"} className={styles.tableCell}>
                                    {currency.name}
                                </td>
                                <td key={"rate"} className={`${styles.tableCell} ${styles.tableRateCell}`}>
                                    {currency.rate}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                <div>
                    <table className={styles.table}>
                        <thead className={styles.tableHead}>
                        <tr>
                            {conversionTitles.map(title =>
                                <th
                                    key={title}
                                    className={`
                                ${styles.tableHeadCell}
                                ${["From Amount", "To Amount"].includes(title) ? styles.tableRateCell : ""}
                            `}
                                >
                                    {title}
                                </th>
                            )}
                        </tr>
                        </thead>
                        <tbody>
                        {conversions.map((conversion, index) =>
                            <tr key={conversion.id} className={styles.tableRow}>
                                <td key={"#"} className={styles.tableCell}>{index+1}</td>
                                <td key={"from_currency"} className={styles.tableCell}>
                                    {conversion.from_currency}
                                </td>
                                <td key={"from_amount"} className={`${styles.tableCell} ${styles.tableRateCell}`}>
                                    {conversion.from_amount}
                                </td>
                                <td key={"to_currency"} className={styles.tableCell}>
                                    {conversion.to_currency}
                                </td>
                                <td key={"to_amount"} className={`${styles.tableCell} ${styles.tableRateCell}`}>
                                    {conversion.to_amount}
                                </td>
                                <td key={"user"} className={styles.tableCell}>
                                    {conversion.user}
                                </td>
                                <td key={"date"} className={styles.tableCell}>
                                    {conversion.date}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
export default Home
