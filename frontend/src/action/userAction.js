import Cookies from 'js-cookie';
import { deleteAllCookies } from '../utility/tokenUtils';
import { 

    USER_SIGNUP_REQUEST,
    USER_SIGNUP_SUCCESS,
    USER_SIGNUP_FAIL,
    
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,

    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    GET_USER_FAIL,
    LOGOUT_USER_REQUEST,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_FAIL,
    LOAD_CREDIT_REQUEST,
    LOAD_CREDIT_SUCCESS,
    LOAD_CREDIT_FAIL,
    GENERATE_IMAGE_REQUEST,
    GENERATE_IMAGE_SUCCESS,
    GENERATE_IMAGE_FAIL,
    RAZOR_PAYMENT_REQUEST,
    RAZOR_PAYMENT_SUCCESS,
    RAZOR_PAYMENT_FAIL,
    VERIFY_PAYMENT_REQUEST,
    VERIFY_PAYMENT_SUCCESS,
    VERIFY_PAYMENT_FAIL,
    
} from '../constants/userConstants';

import axios from 'axios'

const api = import.meta.env.VITE_BACKEND_URL;

export const register = (credentials) => async (dispatch) => {
    try {
        dispatch({ type: USER_SIGNUP_REQUEST });

        const response = await axios.post(`${api}/users/register`, credentials);

        console.log("response", response);

        dispatch({
            type: USER_SIGNUP_SUCCESS,
            payload: response.data
        });
        return response.data;

    } catch (error) {
        dispatch({
            type: USER_SIGNUP_FAIL,
            payload: error.response.data.message || error.message
        });
        throw error;
    }
};

export const generateImage = (credentials) => async (dispatch) => {
    try {
        dispatch({ type: GENERATE_IMAGE_REQUEST });

        const Token = Cookies.get('token');
        console.log(Token);
        
        if (!Token) {
            throw new Error("Token not found");
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${Token}`
            }
        };

        const response = await axios.post(`${api}/image/generate-image`, credentials, config);

        console.log("response", response);

        dispatch({
            type: GENERATE_IMAGE_SUCCESS,
            payload: response.data
        });
        return response.data;

    } catch (error) {
        dispatch({
            type: GENERATE_IMAGE_FAIL,
            payload: error.response.data.message || error.message
        });
        throw error;
    }
};

export const razorpayPayment = (planId) => async (dispatch) => {
    try {
        dispatch({ type: RAZOR_PAYMENT_REQUEST });

        const Token = Cookies.get('token');
        console.log(Token);
        
        if (!Token) {
            throw new Error("Token not found");
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${Token}`
            }
        };

        const response = await axios.post(`${api}/users/razor-payment`, planId, config);

        dispatch({
            type: RAZOR_PAYMENT_SUCCESS,
            payload: response.data
        });
        return response.data;

    } catch (error) {
        dispatch({
            type: RAZOR_PAYMENT_FAIL,
            payload: error.response.data.message || error.message
        });
        throw error;
    }
};

export const verifyPayment = (razorpay_order_id) => async (dispatch) => {
    try {
        dispatch({ type: VERIFY_PAYMENT_REQUEST });
        console.log("axios verify", razorpay_order_id);
        
        const response = await axios.post(`${api}/users/verify-payment`,{razorpay_order_id});

        console.log("response", response);

        dispatch({
            type: VERIFY_PAYMENT_SUCCESS,
            payload: response.data
        });
        return response.data;

    } catch (error) {
        dispatch({
            type: VERIFY_PAYMENT_FAIL,
            payload: error.response.data.message || error.message
        });
        throw error;
    }
};
