import { useState, useEffect } from "react";
import DashboardAdmin from "./DashboardAdmin";
import DashboardEmployee from "./DashboardEmployee";

const DashboardRole = () => {
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    console.log("role", storedRole);
    setRole(storedRole);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      {role === "ADMIN" || role === "SUPER_ADMIN" ? (
        <DashboardAdmin />
      ) : role === "EMPLOYEE" ? (
        <DashboardEmployee />
      ) : (
        <div className="text-center text-gray-500">Loading...</div>
      )}
    </div>
  );
};

export default DashboardRole;
