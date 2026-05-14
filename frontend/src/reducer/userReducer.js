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

} from "../constants/userConstants"

export const getUserReducer = (state = {userDetail : {}}, action) => {
  switch (action.type) {

      case GET_USER_REQUEST:
          return {
              ...state,
              loading : true,
          }
      
      case GET_USER_SUCCESS:
          return {
              ...state,
              loading : false,
              userDetail : action.payload
          }
      
      case GET_USER_FAIL:
          return {
              ...state,
              loading : false,
              userDetail : null,
              error : action.payload
      }
      
      default:
          return state;
  }
}

// export const userReducer = (state = {user : {}}, action) => {
//     switch (action.type) {
//         case USER_SIGNUP_REQUEST:
//         case USER_LOGIN_REQUEST:
//         case LOAD_CREDIT_REQUEST:
//             return {
//                 ...state,
//                 loading : true,
//                 isAuthenticated: false,
//             }

//         case USER_LOGIN_SUCCESS:
//         case LOAD_CREDIT_SUCCESS:
//             return {
//                 ...state,
//                 loading : false,
//                 isAuthenticated: true,
//                 user : action.payload
//             };

//         case USER_SIGNUP_FAIL:
//         case USER_LOGIN_FAIL:
//         case LOAD_CREDIT_FAIL:
//             return {
//                 ...state,
//                 loading : false,
//                 isAuthenticated: false,
//                 user:null,
//                 error: action.payload,
//             };

//         case USER_SIGNUP_SUCCESS:
//             return {
//                 ...state,
//                 loading : false,
//                 isAuthenticated: true,
//                 user : action.payload
//             };

//         default:
//             return state;
//     }
// }

export const userReducer = (state = { user: {} }, action) => {
    switch (action.type) {
        case USER_SIGNUP_REQUEST:
        case USER_LOGIN_REQUEST:
        case LOAD_CREDIT_REQUEST:
        case GENERATE_IMAGE_REQUEST:
        case RAZOR_PAYMENT_REQUEST:
        case VERIFY_PAYMENT_REQUEST:
            return {
                ...state,
                loading: true,
                isAuthenticated: false,
                error: null,
            };

        case USER_LOGIN_SUCCESS:
        case LOAD_CREDIT_SUCCESS:
        case GENERATE_IMAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload,
                error: null,
            };

        case USER_SIGNUP_SUCCESS:
        case RAZOR_PAYMENT_SUCCESS:
        case VERIFY_PAYMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload,
                error: null,
            };

        case USER_SIGNUP_FAIL:
        case USER_LOGIN_FAIL:
        case LOAD_CREDIT_FAIL:
        case GENERATE_IMAGE_FAIL:
        case RAZOR_PAYMENT_FAIL:
        case VERIFY_PAYMENT_FAIL:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                error: action.payload,
            };

        default:
            return state;
    }
};

