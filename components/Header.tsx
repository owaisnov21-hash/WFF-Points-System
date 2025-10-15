import React from 'react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  logoUrl: string | null;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout, logoUrl }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {logoUrl ? (
            <img src={logoUrl} alt="Event Logo" className="h-10 w-auto" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.998 5.998 0 0116 10c0 .343-.011.683-.033 1.014a.75.75 0 01-1.465-.389A4.498 4.498 0 0013 10a1 1 0 10-2 0v.5a3.5 3.5 0 01-3.5 3.5 3.5 3.5 0 01-3.5-3.5v-2.027c0-.265-.105-.52-.293-.707a6.004 6.004 0 01-2.375-2.265z" clipRule="evenodd" />
            </svg>
          )}
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
            World Fusion Fest
          </h1>
        </div>
        <nav className="flex items-center space-x-4">
            {currentUser ? (
                <>
                    <div className="text-right">
                        <span className="font-semibold text-gray-700">{currentUser.username}</span>
                        <span className="block text-xs text-blue-600 font-medium capitalize">{currentUser.role}</span>
                    </div>
                    <button
                        onClick={onLogout}
                        className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-red-500 text-white hover:bg-red-600 shadow-sm"
                    >
                        Logout
                    </button>
                </>
            ) : (
                <span className="text-sm font-medium text-gray-500">Public View / Please Login</span>
            )}
        </nav>
      </div>
    </header>
  );
};

export default Header;