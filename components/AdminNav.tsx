import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { FaHome, FaBox, FaSignOutAlt, FaUser, FaBars, FaTimes, FaEnvelope } from 'react-icons/fa';
import { useState } from 'react';

export default function AdminNav() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <nav className="bg-[#5D4037] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="flex-shrink-0 flex items-center">
              <Image 
                src="/befach-logo.png"
                alt="Befach International" 
                width={180} 
                height={50} 
                className="h-10 w-auto"
              />
              <span className="ml-2 font-bold text-xl hidden sm:inline">Admin</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/admin/dashboard" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/admin/dashboard') 
                  ? 'bg-[#F39C12] text-white' 
                  : 'text-white hover:bg-[#F39C12]/80'
              }`}
            >
              <span className="flex items-center">
                <FaHome className="mr-1" /> Dashboard
              </span>
            </Link>
            
            <Link 
              href="/admin/shipments" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/admin/shipments') 
                  ? 'bg-[#F39C12] text-white' 
                  : 'text-white hover:bg-[#F39C12]/80'
              }`}
            >
              <span className="flex items-center">
                <FaBox className="mr-1" /> Shipments
              </span>
            </Link>
            
            <Link 
              href="/admin/pabbly-integration" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/admin/pabbly-integration') 
                  ? 'bg-[#F39C12] text-white' 
                  : 'text-white hover:bg-[#F39C12]/80'
              }`}
            >
              <span className="flex items-center">
                <FaEnvelope className="mr-1" /> Pabbly + WATI
              </span>
            </Link>
            

            
            {user && (
              <div className="flex items-center ml-4">
                <div className="text-sm mr-4">
                  <span className="flex items-center">
                    <FaUser className="mr-1" /> 
                    <span className="hidden lg:inline">{user.email}</span>
                    <span className="lg:hidden">User</span>
                  </span>
                </div>
                
                <button 
                  onClick={signOut}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 text-white"
                >
                  <span className="flex items-center">
                    <FaSignOutAlt className="mr-1" /> 
                    <span className="hidden sm:inline">Sign Out</span>
                  </span>
                </button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && (
              <button 
                onClick={signOut}
                className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 text-white mr-2"
              >
                <FaSignOutAlt />
              </button>
            )}
            
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-[#F39C12]/80 focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/admin/dashboard" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/admin/dashboard') 
                  ? 'bg-[#F39C12] text-white' 
                  : 'text-white hover:bg-[#F39C12]/80'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center">
                <FaHome className="mr-2" /> Dashboard
              </span>
            </Link>
            
            <Link 
              href="/admin/shipments" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/admin/shipments') 
                  ? 'bg-[#F39C12] text-white' 
                  : 'text-white hover:bg-[#F39C12]/80'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center">
                <FaBox className="mr-2" /> Shipments
              </span>
            </Link>
            

            
            {user && (
              <div className="px-3 py-2 text-white">
                <span className="flex items-center text-sm">
                  <FaUser className="mr-2" /> {user.email}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 