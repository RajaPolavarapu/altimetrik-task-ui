import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../redux/addUserSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/NewUser.css';

const NewUser = () => {
    const [userData, setUserData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        password: '',
        confirmPassword: '',
        payment_type: '',
        address: '',
    });

    const [errorState, setErrorState] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { addUser: { status, error, message } } = useSelector((state) => state);

    useEffect(() => {
        setErrorState(error);
    }, [error])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
        if (userData.password !== userData.confirmPassword) {
            setErrorState("Password  & Confirm Password Must Match")
        }
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (userData.password !== userData.confirmPassword) {
            setErrorState("Password  & Confirm Password Must Match");
            return;
        }
        e.target.reset();
        dispatch(addUser(userData));
        setUserData({});
    };

    return (
        <div className="container">
            <form onSubmit={handleRegister}>
                <h2 className="title">Register New User</h2>
                <div className="form-group">
                    <label className="label" htmlFor="username">Username</label>
                    <input
                        className="input"
                        type="text"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label className="label" htmlFor="firstName">First Name</label>
                    <input
                        className="input"
                        type="text"
                        name="first_name"
                        required
                        value={userData.first_name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label className="label" htmlFor="lastName">Last Name</label>
                    <input
                        className="input"
                        type="text"
                        name="last_name"
                        required
                        value={userData.last_name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label className="label" htmlFor="password">Password</label>
                    <input
                        className="input"
                        type="password"
                        name="password"
                        value={userData.password}
                        required
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label className="label" htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        className="input"
                        type="password"
                        name="confirmPassword"
                        required
                        value={userData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label className="label" htmlFor="paymentType">Preferred Payment Method</label>
                    <select
                        className="select"
                        required
                        name="payment_type"
                        value={userData.payment_type}
                        onChange={handleChange}
                    >
                        <option value="">Select a Payment Method</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="paypal">Debit Card</option>
                        <option value="bitcoin">UPI</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="label" htmlFor="address">Address</label>
                    <input
                        className="input"
                        type="text"
                        name="address"
                        value={userData.address}
                        onChange={handleChange}
                    />
                </div>
                <button className="button" type='submit'>
                    Register
                </button>
                <button className="button login" onClick={() => navigate("/")}>
                    Login
                </button>
                {errorState && <p className="error">{errorState}</p>}
                {status === "success" && <p className="success">{message}</p>}
            </form>
        </div>
    );
};

export default NewUser;
