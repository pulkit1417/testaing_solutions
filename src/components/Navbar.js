import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {LogOut} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase.config';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-indigo-600 border-b border-indigo-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-white"
          >
            <span className="text-xl font-semibold">Note App</span>
          </Link>
          
          {user && (
            <div className="flex items-center space-x-4">              
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;