import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import {
  ShoppingCart,
  HelpCircle,
  Settings,
  Download,
  LogOut,
} from 'lucide-react';
import avatar from "../../assets/avatar.png";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, handleLogout } from '../Firebase/Firebase';

export default function ProfileDropdown({ isOpen, onClose }) {
  const dropdownRef = useRef(null);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  // close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-4 top-14 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full flex items-center justify-center"
          />
          <div className="flex-1">
            <p className="font-semibold text-gray-800">{user?.displayName || "User"}</p>
          </div>
        </div>
      </div>

      {/* View and Edit Profile Button */}
      <div className="p-4 border-b border-gray-200">
        <button className="w-full bg-blue-800 hover:bg-blue-800 text-white font-semibold py-3 rounded transition">
          View and edit profile
        </button>
      </div>

      {/* Progress Section */}
      <div className="p-4 border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-800 mb-2">2 steps left</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className="bg-yellow-400 h-2 rounded-full"
            style={{ width: '66%' }}
          ></div>
        </div>
        <p className="text-xs text-gray-500">
          We are built on trust. Help one another to get to know each other better.
        </p>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        {/* My ADS */}
        <Link
          to="/myads"
          className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition text-gray-700 text-sm"
        >
          <ShoppingCart size={20} className="text-gray-600" />
          <span className="font-medium">My ADS</span>
        </Link>

        {/* Buy Business Packages */}
        <button
          className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition text-gray-700 text-sm"
          onClick={() => console.log('Clicked: Buy Business Packages')}
        >
          <ShoppingCart size={20} className="text-gray-600" />
          <span className="font-medium">Buy Business Packages</span>
        </button>

        {/* View Cart */}
        <button
          className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition text-gray-700 text-sm"
          onClick={() => console.log('Clicked: View Cart')}
        >
          <ShoppingCart size={20} className="text-gray-600" />
          <span className="font-medium">View Cart</span>
        </button>

        {/* Help */}
        <button
          className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition text-gray-700 text-sm"
          onClick={() => console.log('Clicked: Help')}
        >
          <HelpCircle size={20} className="text-gray-600" />
          <span className="font-medium">Help</span>
        </button>

        {/* Settings */}
        <button
          className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition text-gray-700 text-sm"
          onClick={() => console.log('Clicked: Settings')}
        >
          <Settings size={20} className="text-gray-600" />
          <span className="font-medium">Settings</span>
        </button>

        {/* Install OLX Lite App */}
        <button
          className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition text-gray-700 text-sm"
          onClick={() => console.log('Clicked: Install OLX Lite app')}
        >
          <Download size={20} className="text-gray-600" />
          <span className="font-medium">Install OLX Lite app</span>
        </button>

        {/* Logout */}
        <button
          className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition text-gray-700 text-sm"
          onClick={async () => {
            const result = await Swal.fire({
              title: 'Are you sure?',
              text: "You will be logged out!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, logout!'
            });

            if (result.isConfirmed) {
              try {
                const logoutResult = await handleLogout();
                if (logoutResult.success) {
                  Swal.fire(
                    'Logged Out!',
                    'You have been successfully logged out.',
                    'success'
                  );
                  onClose();
                  navigate('/');
                } else {
                  Swal.fire(
                    'Error',
                    'Failed to logout',
                    'error'
                  );
                }
              } catch (error) {
                Swal.fire(
                  'Error',
                  'An error occurred during logout',
                  'error'
                );
              }
            }
          }}
        >
          <LogOut size={20} className="text-gray-600" />
          <span className="font-medium">Logout</span>
        </button>

        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </div>
  );
}
