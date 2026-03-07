import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/authService';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="py-8">
      <div className="text-center max-w-2xl mx-auto mb-16 mt-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Welcome to <span className="text-indigo-600">Document Hub</span>, {user?.username}!
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Manage your documents with ease and collaborate securely.
        </p>
      </div>

      <div className="mt-12 max-w-lg mx-auto grid gap-8 lg:grid-cols-3 lg:max-w-none">

        <div className="flex flex-col rounded-2xl shadow-lg overflow-hidden bg-white border border-gray-100 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
          <div className="flex-1 p-8 flex flex-col justify-between">
            <div className="flex-1">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Document</h3>
              <p className="text-gray-500 text-base">
                Securely upload new documents to your personal repository for safekeeping.
              </p>
            </div>
            <div className="mt-6">
              <Link
                to="/upload"
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                Upload Now
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl shadow-lg overflow-hidden bg-white border border-gray-100 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
          <div className="flex-1 p-8 flex flex-col justify-between">
            <div className="flex-1">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">My Documents</h3>
              <p className="text-gray-500 text-base">
                View, manage, and organize all your previously uploaded files in one place.
              </p>
            </div>
            <div className="mt-6">
              <Link
                to="/documents"
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm"
              >
                View Documents
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {user?.roles?.some(r => r.name === 'ROLE_ADMIN') && (
          <div className="flex flex-col rounded-2xl shadow-lg overflow-hidden bg-white border border-gray-100 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="flex-1 p-8 flex flex-col justify-between">
              <div className="flex-1">
                <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                  <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Admin Panel</h3>
                <p className="text-gray-500 text-base">
                  Manage users, permissions, and overall system configuration settings.
                </p>
              </div>
              <div className="mt-6">
                <Link
                  to="/admin"
                  className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                  Go to Admin Console
                  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;