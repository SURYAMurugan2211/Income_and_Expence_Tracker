import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  onAddTransaction?: () => void;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children,
  onAddTransaction = () => {},
  onLogout = () => {}
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        onMenuClick={toggleSidebar}
        onAddTransaction={onAddTransaction}
        onLogout={onLogout}
      />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          onLogout={onLogout}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;