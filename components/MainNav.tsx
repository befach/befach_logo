import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/router';

const MainNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image 
                src="/images/befach-logo.png"
                alt="Befach International" 
                width={200} 
                height={60} 
                className="h-14 w-auto"
              />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="https://www.befach.com" 
              target="_blank"
              rel="noopener noreferrer"
              className={`px-3 py-2 rounded-md text-sm font-medium text-[#5D4037] hover:bg-[#F39C12]/10`}
            >
              Home
            </a>
            
            <Link 
              href="/track-new" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                router.pathname === '/track-new' 
                  ? 'bg-[#F39C12] text-white' 
                  : 'text-[#5D4037] hover:bg-[#F39C12]/10'
              }`}
            >
              Track Shipment
            </Link>
            
            <Link 
              href="/admin/login" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                router.pathname.startsWith('/admin') 
                  ? 'bg-[#5D4037] text-white' 
                  : 'text-[#5D4037] hover:bg-[#5D4037]/10'
              }`}
            >
              Admin
            </Link>
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#5D4037] hover:text-[#F39C12] focus:outline-none"
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
            <a 
              href="https://www.befach.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#5D4037] hover:bg-[#F39C12]/10"
            >
              Home
            </a>
            
            <Link 
              href="/track-new" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                router.pathname === '/track-new' 
                  ? 'bg-[#F39C12] text-white' 
                  : 'text-[#5D4037] hover:bg-[#F39C12]/10'
              }`}
            >
              Track Shipment
            </Link>
            
            <Link 
              href="/admin/login" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                router.pathname.startsWith('/admin') 
                  ? 'bg-[#5D4037] text-white' 
                  : 'text-[#5D4037] hover:bg-[#5D4037]/10'
              }`}
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNav; 