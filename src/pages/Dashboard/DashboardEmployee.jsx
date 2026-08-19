// import { FaAddressBook } from "react-icons/fa";
// import { fetchAdminDashboard } from "../../api/api";

// const DashboardEmployee = ({ data = {} }) => {
//   return (
//     <div className="p-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {[
//           { title: "Total Applications", count: data.total_application || 0, icon: <FaAddressBook /> },
//           { title: "Applications Completed", count: data.completed_status || 0, icon: <FaAddressBook /> },
//           { title: "Applications Pending", count: data.pending_status || 0, icon: <FaAddressBook /> },
//         ].map((item, index) => (
//           <div key={index} className="bg-white shadow-lg rounded-xl p-6 flex items-center">
//             <div className="flex-1">
//               <h5 className="text-gray-600 text-sm uppercase">{item.title}</h5>
//               <span className="text-3xl font-bold text-blue-600">{item.count}</span>
//             </div>
//             <div className="text-white bg-blue-500 p-3 rounded-full shadow-md">
//               {item.icon}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DashboardEmployee;

// import { useEffect, useState } from "react";
// import { FaAddressBook } from "react-icons/fa";
// import { fetchAdminDashboard } from "../../api/api";

// const DashboardEmployee = () => {
//   const [dashboardData, setDashboardData] = useState({
//     total_application: 0,
//     completed_status: 0,
//     pending_status: 0,
//   });

//   useEffect(() => {
//     const getDashboardData = async () => {
//       try {
//         const token = localStorage.getItem("jwt_token");
//         if (!token) throw new Error("Authentication token not found");

//         const response = await fetchAdminDashboard(
//           "/admin/dashboard/all_applicantion", // Correct API path
//           "get", // HTTP method
//           {}, // No data needed for GET
//           { headers: { "x-auth-token": token } } // Attach headers
//         );

//         console.log("API Response:", response); // Debugging

//         // Ensure payload exists before accessing data
//         if (response.success && response.payload) {
//           setDashboardData({
//             total_application: response.payload.total_application || 0,
//             completed_status: response.payload.completed_status || 0,
//             pending_status: response.payload.pending_status || 0,
//           });
//         } else {
//           console.warn("Unexpected response format:", response);
//         }
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//       }
//     };

//     getDashboardData();
//   }, []);

//   return (
//     <div className="p-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {[
//           { title: "Total Applications", count: dashboardData.total_application, icon: <FaAddressBook /> },
//           { title: "Applications Completed", count: dashboardData.completed_status, icon: <FaAddressBook /> },
//           { title: "Applications Pending", count: dashboardData.pending_status, icon: <FaAddressBook /> },
//         ].map((item, index) => (
//           <div key={index} className="bg-white shadow-lg rounded-xl p-6 flex items-center">
//             <div className="flex-1">
//               <h5 className="text-gray-600 text-sm uppercase">{item.title}</h5>
//               <span className="text-3xl font-bold text-blue-600">{item.count}</span>
//             </div>
//             <div className="text-white bg-blue-500 p-3 rounded-full shadow-md">
//               {item.icon}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DashboardEmployee;

import { useEffect, useState } from "react";
import { FaAddressBook } from "react-icons/fa";
import { fetchAdminDashboard } from "../../api/api";
import Pagination from "../../components/Pagination";

const DashboardEmployee = () => {
  const [dashboardData, setDashboardData] = useState({
    total_application: 0,
    completed_status: 0,
    total_applicants: 0,
    pending_status: 0,
    current_page: 0,
    applicants: [],
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1); // Dynamic page number
  const [searchQuery, setSearchQuery] = useState(""); // Dynamic search input
  const limit = 10; // Static limit

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) throw new Error("Authentication token not found");

        // Convert requestData into query params
        const queryParams = new URLSearchParams({
          page,
          limit,
          searchQuery,
        }).toString();

        const response = await fetchAdminDashboard(
          `/admin/dashboard/all_applicantion?${queryParams}`, // Append query params
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
          const formattedApplicants = responseData.payload.applicant.map(
            (app) => ({
              public_id: app.public_id,
              name: `${app.applicant_first_name || ""} ${
                app.applicant_middle_name || ""
              } ${app.applicant_last_name || ""}`.trim(),
              father_name: `${app.applicant_father_first_name || ""} ${
                app.applicant_father_middle_name || ""
              } ${app.applicant_father_last_name || ""}`.trim(),
              gender: app.applicant_gender || "N/A",
              marital_status: app.applicant_marital_status || "N/A",
              dependent: app.dependent || 0,
              dob: app.applicant_DOB || "N/A",
              pan_number: app.applicant_pan_number || "N/A",
              monthly_income: app.monthly_income || 0,
              loan_amount: app.loan_amount || 0,
              status: app.status || "N/A",
              bank_with_partner: app.bank_with_partner || "N/A",
              created_at: new Date(app.created_at).toLocaleDateString(),
            })
          );

          setDashboardData({
            total_application: responseData.payload.total_application || 0,
            completed_status: responseData.payload.completed_status || 0,
            pending_status: responseData.payload.pending_status || 0,
            total_applicants: responseData.payload.total_applicants || 0,
            current_page: responseData.payload.current_page || 0,
            applicants: formattedApplicants,
          });
        } else {
          console.warn("Unexpected response format:", responseData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    getDashboardData();
  }, [page, searchQuery]);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Total Applications",
            count: dashboardData.total_application,
            icon: <FaAddressBook />,
          },
          {
            title: "Applications Completed",
            count: dashboardData.completed_status,
            icon: <FaAddressBook />,
          },
          {
            title: "Applications Pending",
            count: dashboardData.pending_status,
            icon: <FaAddressBook />,
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl p-6 flex items-center"
          >
            <div className="flex-1">
              <h5 className="text-gray-600 text-sm uppercase">{item.title}</h5>
              <span className="text-3xl font-bold text-blue-600">
                {item.count}
              </span>
            </div>
            <div className="text-white bg-blue-500 p-3 rounded-full shadow-md">
              {item.icon}
            </div>
          </div>
        ))}
      </div>
      {/* Applicants Table */}
      <div className="mt-8 bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Applicant Details
          </h2>

          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 w-[400px] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Scrollable Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                <th className="border p-3">Sr. No.</th>
                <th className="border p-3">Name</th>
                <th className="border p-3">Gender</th>
                <th className="border p-3">Marital Status</th>
                <th className="border p-3">Dependent</th>
                <th className="border p-3">Father Name</th>
                <th className="border p-3">DOB</th>
                <th className="border p-3">PAN Number</th>
                <th className="border p-3">Monthly Income</th>
                <th className="border p-3">Loan Amount</th>
                <th className="border p-3">Status</th>
                <th className="border p-3">Bank</th>
                <th className="border p-3">Created At</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.applicants.length > 0 ? (
                dashboardData.applicants.map((applicant, index) => {
                  const serialNumber =
                    (dashboardData.current_page - 1) * 10 + (index + 1);

                  return (
                    <tr
                      key={index}
                      className="text-center border-b hover:bg-gray-50"
                    >
                      <td className="border p-3">{serialNumber}</td>
                      <td className="border p-3">{applicant.name || "N/A"}</td>
                      <td className="border p-3">{applicant.gender}</td>
                      <td className="border p-3">{applicant.marital_status}</td>
                      <td className="border p-3">{applicant.dependent}</td>
                      <td className="border p-3">
                        {applicant.father_name || "N/A"}
                      </td>
                      <td className="border p-3">
                        {applicant.dob
                          ? new Date(applicant.dob).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </td>
                      <td className="border p-3">{applicant.pan_number}</td>
                      <td className="border p-3">
                        {applicant.monthly_income.toLocaleString()}
                      </td>
                      <td className="border p-3">
                        {applicant.loan_amount.toLocaleString()}
                      </td>
                      <td className="border p-3">{applicant.status}</td>
                      <td className="border p-3">
                        {applicant.bank_with_partner}
                      </td>
                      <td className="border p-3">
                        {applicant.created_at
                          ? new Date(applicant.created_at).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="13" className="text-center p-4 text-gray-500">
                    No applicants found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Component */}
        <Pagination
          totalItems={dashboardData.total_applicants}
          itemsPerPage={limit}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default DashboardEmployee;
