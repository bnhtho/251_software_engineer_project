import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Navbar';
import { useUser } from "../Context/UserContext";

const PageNotFound = () => {
  const { user } = useUser();
  const homePath = "/dashboard";
  
  return (

    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Illustration */}
        
        <div className="relative mb-12">
          {/* Background circle */}
          <div className="w-72 h-72 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center relative overflow-hidden">
            {/* Globe icon */}
            <div className="absolute top-6 left-8">
              <Globe className="w-10 h-10 text-blue-600 opacity-80" />
            </div>
            
            {/* Laptop with 404 */}
            <div className="relative z-10">
              {/* Laptop screen */}
              <div className="w-44 h-28 bg-gray-900 rounded-t-lg flex items-center justify-center relative shadow-lg">
                <div className="w-40 h-24 bg-white rounded flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-800 tracking-wider">404</span>
                </div>
                {/* Screen bezel */}
                <div className="absolute inset-0 border-2 border-gray-700 rounded-t-lg"></div>
              </div>
              
              {/* Laptop keyboard/base */}
              <div className="w-48 h-3 bg-gray-800 rounded-b-lg mx-auto shadow-md"></div>
              
              {/* Laptop stand */}
              <div className="w-32 h-1 bg-gray-600 mx-auto mt-1 rounded-full"></div>
            </div>
            
            {/* Magnifying glass */}
            <div className="absolute bottom-8 right-6">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-600 rounded-full bg-transparent"></div>
                <div className="absolute -bottom-2 -right-2 w-6 h-1 bg-blue-600 rounded-full transform rotate-45 origin-left"></div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-8 right-12 w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
            <div className="absolute top-16 right-6 w-1 h-1 bg-blue-500 rounded-full opacity-80"></div>
            <div className="absolute bottom-16 left-6 w-3 h-3 bg-blue-300 rounded-full opacity-50"></div>
            <div className="absolute bottom-24 left-12 w-1 h-1 bg-blue-400 rounded-full opacity-70"></div>
            
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white opacity-10"></div>
          </div>
          
          {/* Base shadow */}
          <div className="w-48 h-4 bg-gray-300 rounded-full mx-auto mt-4 opacity-30 blur-sm"></div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Page Not Found</h1>
          <p className="text-gray-500 text-base leading-relaxed max-w-sm mx-auto">
            We searched, but the page you requested could not be found. 
            Try going back to our homepage.
          </p>
          
          {/* Go Home Button */}
          <div className="pt-2">
            <Link
              to= {homePath}
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold text-sm uppercase tracking-wider rounded-full hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              GO HOME
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;