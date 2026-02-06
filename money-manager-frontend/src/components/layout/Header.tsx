import React, { useState } from 'react';
import { MenuIcon, BellIcon, UserIcon, PlusIcon } from '../common/Icons';
import Button from '../common/Button';
import { authService } from '../../services/authService';

interface HeaderProps {
  onMenuClick: () => void;
  onAddTransaction: () => void;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onAddTransaction, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setShowUserMenu(false);
  };
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu button and Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden transition-colors"
              aria-label="Toggle menu"
            >
              <MenuIcon size={24} />
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-3xl">💰</span>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                Money Manager
              </h1>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-3">
            {/* Add Transaction Button */}
            <Button
              variant="primary"
              size="md"
              onClick={onAddTransaction}
              className="hidden sm:flex"
            >
              <PlusIcon size={20} />
              Add Transaction
            </Button>
            
            {/* Mobile Add Button */}
            <button
              onClick={onAddTransaction}
              className="sm:hidden p-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              aria-label="Add transaction"
            >
              <PlusIcon size={20} />
            </button>

            {/* Notifications */}
            <button
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors relative"
              aria-label="Notifications"
              title="No new notifications"
            >
              <BellIcon size={20} />
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                  <UserIcon size={18} />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.name || 'User'}
                </span>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{user?.email || ''}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;