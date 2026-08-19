import { useEffect, useState } from "react";
import { FaAddressBook } from "react-icons/fa";
import { fetchAdminDashboard } from "../../api/api";
import Pagination from "../../components/Pagination";

const EmployeeData = () => {
  const [employeeData, setEmployeeData] = useState({
    total_count: 0,
    current_page: 0,
    employees: [],
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1); // Dynamic page number
  const [searchQuery, setSearchQuery] = useState(""); // Dynamic search input
  const limit = 20; // Static limit

  useEffect(() => {
    const getEmployeeData = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) throw new Error("Authentication token not found");

        const queryParams = new URLSearchParams({
          page,
          limit,
          searchQuery,
        }).toString();

        const response = await fetchAdminDashboard(
          `/admin/dashboard/all_employee`, // Append query params
          "get",
          {}, // Empty body because GET request doesn't support body
          {
            headers: {
              "x-auth-token": token,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API Response:", response); // Debugging

        const responseData = response.data || response;

        if (responseData.success && responseData.payload) {
          const formattedEmployees = responseData.payload.employees.map(
            (app) => ({
              public_id: app.public_id,
              name: `${app.first_name || ""} ${app.last_name || ""}`.trim(),

              mobile: app.mobile || "N/A",
              email: app.email || "N/A",
            })
          );

          setEmployeeData({
            total_count: responseData.payload.total_count || 0,
            current_page: responseData.payload.current_page || 0,
            employees: formattedEmployees,
          });
        } else {
          console.warn("Unexpected response format:", responseData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    getEmployeeData();
  }, []);

  return (
    <div className="p-6">
      {/* Applicants Table */}
      <div className="mt-8 bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Employee Details
          </h2>

          {/* <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 w-[400px] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          /> */}
        </div>

        {/* Scrollable Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                <th className="border p-3">Sr. No.</th>
                <th className="border p-3">Name</th>
                <th className="border p-3">Mobile</th>
                <th className="border p-3">Email ID</th>
              </tr>
            </thead>
            <tbody>
              {employeeData.employees.length > 0 ? (
                employeeData.employees.map((employees, index) => {
                  const serialNumber =
                    (employeeData.current_page - 1) * 10 + (index + 1);

                  return (
                    <tr
                      key={index}
                      className="text-center border-b hover:bg-gray-50"
                    >
                      <td className="border p-3">{serialNumber}</td>
                      <td className="border p-3">{employees.name || "N/A"}</td>
                      <td className="border p-3">{employees.mobile}</td>
                      <td className="border p-3">{employees.email}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="13" className="text-center p-4 text-gray-500">
                    No employee found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Component */}
        <Pagination
          totalItems={employeeData.total_count}
          itemsPerPage={limit}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default EmployeeData;
