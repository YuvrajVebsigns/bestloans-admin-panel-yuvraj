import React from "react";

const Header = () => {
  return (
    <header className="flex justify-between items-center bg-white shadow-md py-5 px-6">
      {/* Left - Logo & Menu Icon */}
      <div className="flex items-center space-x-4">
        <button className="md:hidden focus:outline-none">
          <img
            src="https://img.icons8.com/ios-filled/50/000000/menu.png"
            alt="Menu"
            className="w-6 h-6"
          />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Best Loans Admin Panel</h1>
      </div>

      {/* Center - Search Bar */}
      {/* <div className="hidden md:flex bg-gray-100 rounded-lg px-3 py-2 items-center w-80">
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none w-full text-gray-700"
        />
        <img
          src="https://img.icons8.com/ios-filled/50/000000/search.png"
          alt="Search"
          className="w-5 h-5 text-gray-500"
        />
      </div> */}

      {/* Right - Notifications & Profile */}
      <div className="flex items-center space-x-6">
        {/* Notification Icon */}
        {/* <div className="relative cursor-pointer">
          <img
            src="https://img.icons8.com/ios-filled/50/000000/appointment-reminders.png"
            alt="Notifications"
            className="w-6 h-6"
          />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 flex justify-center items-center rounded-full">
            3
          </span>
        </div> */}

        {/* Profile Image */}
        {/* <div className="relative">
          <img
            src="https://img.icons8.com/ios-filled/50/000000/user-male-circle.png"
            alt="Profile"
            className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer"
          />
        </div> */}
      </div>
    </header>
  );
};

export default Header;
