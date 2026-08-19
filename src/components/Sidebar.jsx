import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "./Modal"; // Import the reusable Modal component
import { BarChart, CreditCard, FileText, LayoutDashboard, LogOut, Monitor, Phone, Users } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [role, setRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the role from localStorage
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_email");
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("public_id");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");

    navigate("/");
  };

  return (
    // <div
    //   className={`h-screen bg-gray-900 text-white p-5 transition-all duration-300 ${
    //     isOpen ? "w-64" : "w-20"
    //   }`}
    // >

      <div className={`h-screen bg-gray-900 text-white p-5 transition-all duration-300 flex flex-col justify-between ${
        isOpen ? "w-64" : "w-20"
      }`}
      >
      {/* Toggle Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-xl font-bold ${!isOpen && "hidden"}`}>
          {role === "ADMIN" || role === "SUPER_ADMIN" ? "Admin Panel" : "Employee Panel"}
        </h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none"
        >
          <img
            src="https://img.icons8.com/ios-filled/50/ffffff/menu.png"
            alt="Toggle"
            className="w-6 h-6"
          />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-4 flex-1 overflow-y-auto pb-20">
        {/* Dashboard (Visible to Everyone) */}
        <SidebarItem
          isOpen={isOpen}
          icon={<LayoutDashboard size={24} color="white" />}
          text="Dashboard"
          link="/dashboard"
        />

        {/* Show all items only if role is ADMIN */}
        {(role === "ADMIN" || role === "SUPER_ADMIN") && (
          <>
            <SidebarItem
              isOpen={isOpen}
              icon={<Users size={24} color="white" />}
              text="Employee Data"
              link="/employee-data"
            />
            <SidebarItem
              isOpen={isOpen}
              icon={<FileText size={24} color="white" />}
              text="Applicant Data"
              link="/applicant-data"
            />
            <SidebarItem
              isOpen={isOpen}
              icon={<BarChart size={24} color="white" />}
              text="Credit Score Data"
              link="/credit-score-data"
            />
            <SidebarItem
              isOpen={isOpen}
              icon={<Phone size={24} color="white" />}
              text="Contact Us Info"
              link="/contact-us-info"
            />
            <SidebarItem
              isOpen={isOpen}
              icon={<FileText size={24} color="white" />}
              text="Documents Data"
              link="/documents"
            />
            <SidebarItem
              isOpen={isOpen}
              icon={<Monitor size={24} color="white" />}
              text="Landing Page Data"
              link="/landing-page"
            />
            <SidebarItem
              isOpen={isOpen}
              icon={<CreditCard size={24} color="white" />}
              text="Check CIBIL Score"
              link="/cibil-score"
            />
          </>
        )}

        {/* Logout Button - Always Visible */}
        <button 
          onClick={() => setShowModal(true)} 
          className="w-full flex items-center space-x-4 p-3 hover:bg-gray-700 bg-gray-900 rounded-lg transition-all duration-200 font-semibold mt-4"
        >
          <span className="w-6 h-6 text-white"><LogOut size={24} color="white" /></span>
          {isOpen && <span className="text-white">Logout</span>}
        </button>
      </nav>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
      />
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ isOpen, icon, text, link }) => {
  return (
    <Link
      to={link}
      className="flex items-center space-x-4 p-3 hover:bg-gray-700 rounded-lg transition-all duration-200"
    >
      <span className="w-6 h-6 text-white">{icon}</span>
      {isOpen && <span className="text-white">{text}</span>}
    </Link>
  );
};

export default Sidebar;
  