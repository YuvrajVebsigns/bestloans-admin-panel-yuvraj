import { useLocation, Navigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import RoutesComponent from "../routes";

const AppLayout = () => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("jwt_token"); // Check if user is logged in
  const isDashboard = location.pathname.startsWith("/dashboard"); // Check if user is in admin panel

  if (!isAuthenticated && isDashboard) {
    return <Navigate to="/" replace />; // Redirect to login if not authenticated
  }

  return (
    <div className="overflow-x-auto">
      {isAuthenticated ? (
        <div className="relative max-w-screen overflow-x-auto">
          {/* Fixed Header */}
          <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
            <Header />
          </div>

          <div className="flex">
            {/* Fixed Sidebar */}
            <div className="fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 bg-gray-800 text-white shadow-lg">
              <Sidebar />
            </div>

            {/* Scrollable Content */}
            <div className="w-full ml-64 mt-[64px] p-4 overflow-y-auto h-[calc(100vh-64px)]">
              <RoutesComponent />
            </div>
          </div>
        </div>
      ) : (
        <RoutesComponent /> // Show login page without sidebar & header
      )}
    </div>
  );
};

export default AppLayout;
