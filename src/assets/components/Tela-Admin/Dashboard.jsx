import React from 'react';
import { Search, Bell, Mail, User, BarChart2, FileText, Grid, Settings, ChevronRight, ArrowLeft, Rocket } from 'lucide-react';
import "./dash.css";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-60 bg-blue-600 text-white flex flex-col">
        {/* Logo */}
        <div className="p-4 flex items-center gap-2">
          <div className="bg-white rounded-full p-2 flex items-center justify-center">
            <Rocket className="text-blue-600 h-5 w-5" />
          </div>
          <div className="font-bold text-xl">MERCADIX ADMIN </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1">
          <div className="p-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-blue-700 rounded text-white">
              <Grid className="h-5 w-5" />
              <span>Dashboard</span>
            </div>
          </div>
          
          {/* Interface Section */}
          <div className="px-4 mt-2 mb-2">
            <p className="text-xs text-blue-300 px-4 mb-2">INTERFACE</p>
            <div className="flex items-center justify-between px-4 py-2 hover:bg-blue-700 rounded cursor-pointer">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5" />
                <span>Components</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between px-4 py-2 hover:bg-blue-700 rounded cursor-pointer">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5" />
                <span>Utilities</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
          
          {/* Addons Section */}
          <div className="px-4 mt-2">
            <p className="text-xs text-blue-300 px-4 mb-2">ADDONS</p>
            <div className="flex items-center justify-between px-4 py-2 hover:bg-blue-700 rounded cursor-pointer">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5" />
                <span>Pages</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between px-4 py-2 hover:bg-blue-700 rounded cursor-pointer">
              <div className="flex items-center gap-3">
                <BarChart2 className="h-5 w-5" />
                <span>Charts</span>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-2 hover:bg-blue-700 rounded cursor-pointer">
              <div className="flex items-center gap-3">
                <Grid className="h-5 w-5" />
                <span>Tables</span>
              </div>
            </div>
          </div>
        </nav>
        
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b flex items-center justify-between px-6 py-4">
          {/* Search */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search for..."
              className="pl-3 pr-10 py-2 border rounded-l bg-gray-50 text-sm w-64"
            />
            <button className="bg-blue-600 text-white p-2 rounded-r">
              <Search className="h-5 w-5" />
            </button>
          </div>
          
          {/* User Info */}
          <div className="flex items-center gap-6">
            <div className="relative">
                <button>
              <Bell className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3+</span>
              </button>
            </div>
            <div className="relative">
                <button>
              <Mail className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">7</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Douglas McGee</span>
              <div className="bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-700">Dashboard</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate Report
            </button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded border-l-4 border-blue-600 shadow flex items-center justify-between p-4">
              <div>
                <p className="text-xs font-bold text-blue-600">EARNINGS (MONTHLY)</p>
                <p className="text-2xl font-bold text-gray-700">$40,000</p>
              </div>
              <div className="text-gray-300">
                <FileText className="h-12 w-12" />
              </div>
            </div>
            
            <div className="bg-white rounded border-l-4 border-green-500 shadow flex items-center justify-between p-4">
              <div>
                <p className="text-xs font-bold text-green-500">EARNINGS (ANNUAL)</p>
                <p className="text-2xl font-bold text-gray-700">$215,000</p>
              </div>
              <div className="text-gray-300">
                <FileText className="h-12 w-12" />
              </div>
            </div>
            
            <div className="bg-white rounded border-l-4 border-teal-500 shadow flex items-center justify-between p-4">
              <div>
                <p className="text-xs font-bold text-teal-500">TASKS</p>
                <p className="text-2xl font-bold text-gray-700">50%</p>
                <div className="w-32 h-2 bg-gray-200 mt-2 rounded">
                  <div className="w-16 h-2 bg-teal-500 rounded"></div>
                </div>
              </div>
              <div className="text-gray-300">
                <FileText className="h-12 w-12" />
              </div>
            </div>
            
            <div className="bg-white rounded border-l-4 border-yellow-500 shadow flex items-center justify-between p-4">
              <div>
                <p className="text-xs font-bold text-yellow-500">PENDING REQUESTS</p>
                <p className="text-2xl font-bold text-gray-700">18</p>
              </div>
              <div className="text-gray-300">
                <FileText className="h-12 w-12" />
              </div>
            </div>
          </div>
          
          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-blue-600">Earnings Overview</h2>
                <button className="text-gray-400">...</button>
              </div>
              <div className="h-64 bg-white">
                {/* Line Chart Placeholder */}
                <svg className="w-full h-full">
                  <path
                    d="M0,200 Q50,180 100,160 T200,140 T300,120 T400,100 T500,80 T600,60 T700,40"
                    fill="none"
                    stroke="#4e73df"
                    strokeWidth="3"
                  />
                  <circle cx="700" cy="40" r="5" fill="#4e73df" />
                </svg>
              </div>
            </div>
            
            <div className="bg-white rounded shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-blue-600">Revenue Sources</h2>
                <button className="text-gray-400">...</button>
              </div>
              <div className="h-64 flex items-center justify-center">
                {/* Donut Chart Placeholder */}
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="80" fill="transparent" stroke="#36b9cc" strokeWidth="40" strokeDasharray="350 500" />
                  <circle cx="100" cy="100" r="80" fill="transparent" stroke="#1cc88a" strokeWidth="40" strokeDasharray="150 500" strokeDashoffset="-350" />
                  <circle cx="100" cy="100" r="80" fill="transparent" stroke="#4e73df" strokeWidth="40" strokeDasharray="150 500" strokeDashoffset="-150" />
                  <circle cx="100" cy="100" r="60" fill="white" />
                </svg>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;