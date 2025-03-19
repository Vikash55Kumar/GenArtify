import React, { useContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Generate } from './pages/Generate';
import { Pricing } from './pages/Pricing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ToastContainer } from 'react-toastify';
import { AuthContext } from "./utility/AuthContext";
import Footer from './components/Footer';
function App() {

  const {user} = useContext(AuthContext);

  return (
    <>
      <ToastContainer 
        position="top-center"  // This will show the toast in the center of the screen
        autoClose={3000}  // Toast will disappear after 4 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        closeButton={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate" element={user ? <Generate /> : <Login />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;