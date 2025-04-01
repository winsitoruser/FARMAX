import React from 'react';
import { FaSearch, FaBell, FaComments, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

interface SmartAdminHeaderProps {
  username?: string;
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
}

const SmartAdminHeader: React.FC<SmartAdminHeaderProps> = ({
  username = 'Admin User',
  title = 'Analytics Dashboard',
  subtitle = 'Welcome to your dashboard overview',
  showSearch = true,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Title */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h1>
            <p className="text-gray-500 text-sm md:text-base">{subtitle}</p>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto">
            {/* Search */}
            {showSearch && (
              <div className="relative flex-grow md:flex-grow-0 max-w-md mr-2">
                <input
                  type="text"
                  placeholder="Search dashboard..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-gray-50"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            )}
            
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative p-2 text-gray-600 hover:bg-orange-50 rounded-full"
            >
              <FaBell />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 rounded-full bg-orange-500 text-white text-xs">3</span>
            </Button>
            
            {/* Messages */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative p-2 text-gray-600 hover:bg-orange-50 rounded-full"
            >
              <FaComments />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 rounded-full bg-green-500 text-white text-xs">7</span>
            </Button>
            
            {/* User Profile */}
            <div className="flex items-center ml-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-2">
                <FaUserCircle size={24} />
              </div>
              <div className="hidden md:block">
                <span className="text-sm font-medium text-gray-700">{username}</span>
              </div>
              <FaChevronDown className="ml-1 h-3 w-3 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartAdminHeader;
