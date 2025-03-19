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
//                 isAuthenticated: false,
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
            return {
                ...state,
                loading: true,
                isAuthenticated: false,
                error: null, // ✅ Clear previous errors when starting a new request
            };

        case USER_LOGIN_SUCCESS:
        case LOAD_CREDIT_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload,
                error: null, // ✅ Clear error on successful login
            };

        case USER_SIGNUP_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true, // ✅ Set authenticated to true on successful signup
                user: action.payload,
                error: null, // ✅ Clear error on successful signup
            };

        case USER_SIGNUP_FAIL:
        case USER_LOGIN_FAIL:
        case LOAD_CREDIT_FAIL:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                error: action.payload, // ✅ Store error only on failure
            };

        default:
            return state;
    }
};
