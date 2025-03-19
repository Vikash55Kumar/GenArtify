// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { ImageIcon, User, UserPlus, LogOut, Star } from 'lucide-react';
// import { logout } from '../action/userAction';
// import { useDispatch, useSelector } from 'react-redux';
// import SpinnerLoader from "../utility/SpinnerLoader"


// export function Navbar({user={}}) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false)

//   const {isAuthenticated} = useSelector((state) => state.user);
//   console.log(isAuthenticated,);
  

//   const handleLogout = async (e) => {
//     e.preventDefault();

//     setLoading(true);
//     await dispatch(logout());
        
//     navigate("/")
//     setLoading(false);

// };
//   return (
//     <>
//       {loading ? 
//         <SpinnerLoader />
//       :    
//       <nav className="bg-white shadow-lg">
//         <div className="w-full px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16 items-center">
//             <div className="flex items-center">
//               <Link to="/" className="flex items-center space-x-2">
//                 <ImageIcon className="h-8 w-8 text-purple-600" />
//                 <span className="text-xl font-bold text-gray-900">ImageAI</span>
//               </Link>
//             </div>
            
//             <div className="flex items-center space-x-4">
//               <Link to="/generate" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
//                 Generate
//               </Link>
//               <Link to="/pricing" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
//                 Pricing
//               </Link>
//               {isAuthenticated ?
//                 <>
//                   <Link className="inline-flex items-center space-x-1 text-white bg-blue-500 px-3 py-2 hover:cursor-text border-2 rounded-md text-sm font-medium">
//                     <Star className="h-4 w-4" />
//                     <span>Credits : {user.credits}</span>
//                   </Link>

//                   <Link className="inline-flex items-center space-x-1 text-black px-3 py-2 hover:cursor-text border-2 rounded-md text-sm font-medium">
//                     <User className="h-4 w-4" />
//                     <span>{user.name}</span>
//                   </Link>

//                   <Link onClick={handleLogout} className="inline-flex items-center space-x-1 bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium">
//                     <LogOut className="h-4 w-4" />
//                     <span>Logout</span>
//                   </Link>

//                 </>
//                 :
//                 <>
//                   <Link to="/signup" className="inline-flex items-center space-x-1 text-white bg-blue-500 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
//                     <UserPlus className="h-4 w-4" />
//                     <span>Create Account</span>
//                   </Link>
//                 </>
//               }
//             </div>
//           </div>
//         </div>
//       </nav>
//     }
//     </>


//   );
// }





import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ImageIcon, User, UserPlus, LogOut, Star } from "lucide-react";
import SpinnerLoader from "../utility/SpinnerLoader";
import { AuthContext } from "../utility/AuthContext"; // ✅ Import Context

export function Navbar() {
  const { user, credits, logout } = useContext(AuthContext); // ✅ Get data from context
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    setIsLoggingOut(true);
    logout();
    navigate("/");
    setIsLoggingOut(false);
  };

  return (
    <>
      {isLoggingOut ? (
        <SpinnerLoader />
      ) : (
        <nav className="bg-white shadow-lg">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <ImageIcon className="h-8 w-8 text-purple-600" />
                  <span className="text-xl font-bold text-gray-900">ImageAI</span>
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  to="/generate"
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Generate
                </Link>
                <Link
                  to="/pricing"
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Pricing
                </Link>

                {user ? (
                  <>
                    <Link
                      className="inline-flex items-center space-x-1 text-white bg-blue-500 px-3 py-2 hover:cursor-text border-2 rounded-md text-sm font-medium"
                    >
                      <Star className="h-4 w-4" />
                      <span>Credits: {credits}</span>
                    </Link>

                    <Link
                      className="inline-flex items-center space-x-1 text-black px-3 py-2 hover:cursor-text border-2 rounded-md text-sm font-medium"
                    >
                      <User className="h-4 w-4" />
                      <span>{user}</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center space-x-1 bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="inline-flex items-center space-x-1 text-white bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Create Account</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
