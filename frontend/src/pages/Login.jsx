import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
// import { loadCredit, login } from '../action/userAction';
import {toast} from "react-toastify"
import { useDispatch } from 'react-redux';
import SpinnerLoader from '../utility/SpinnerLoader';
import { AuthContext } from '../utility/AuthContext';


export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state to manage spinner visibility
  const {login} = useContext(AuthContext)

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);

    const myForm = {
      email,
      password
    };
    try {
      const response = await login(myForm);
      
      if (response.success === true) {
          toast.success(response.message || "User Login Successfully!");
          setEmail("")
          setPassword("")
          setLoading(false); // Hide spinner after successful login
          navigate("/");
      } else {
        toast.error(response.message || "Login failed!");
        setLoading(false);
          
      }
    } catch (error) {
        toast.error('Login failed!');
        setLoading(false); // Hide spinner after error
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center sm:px-6 lg:px-8">
      {loading ? 
        <SpinnerLoader />
      : 
      <>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Sign up
                </button>
              </div>

              <p className="mt-6 text-left  text-gray-900">
                Dont't have an account ? <a href='/signup' className='underline text-blue-700'>Signup</a>
              </p>
            </form>
          </div>
        </div>
      </>
       }

    </div>
  );
}