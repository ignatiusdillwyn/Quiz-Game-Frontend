import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
      {/* Simple background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 text-6xl opacity-10">?</div>
        <div className="absolute bottom-10 left-10 text-6xl opacity-10">!</div>
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Simple accent strip */}
          <div className="h-1.5 bg-gradient-to-r from-blue-400 to-purple-500"></div>

          <div className="p-8">
            {/* Logo section - simplified */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                Quiz Game
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Test your knowledge
              </p>
            </div>

            {/* Form outlet */}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;