import React, { useState } from 'react';
import { 
  Bars3Icon, 
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const MobileNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-white border-b px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 text-gray-600"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <h1 className="text-xl font-bold text-blue-600">JobTracker</h1>
          
          <button className="p-2 text-gray-600">
            <MagnifyingGlassIcon className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
          
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            {/* Mobile menu items */}
            <div className="p-4 space-y-2">
              {['Dashboard', 'Job Feed', 'Applications', 'AI Assistant', 'Settings'].map((item) => (
                <button
                  key={item}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavbar;