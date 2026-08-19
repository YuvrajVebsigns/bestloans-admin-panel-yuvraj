import { useEffect, useState } from "react";
import { FaAddressBook } from "react-icons/fa";
import { fetchAdminDashboard } from "../../api/api";
import Pagination from "../../components/Pagination";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

const ApplicantData = () => {
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
              applicant_email: app.applicant_email || "N/A",
              applicant_mobile: app.applicant_mobile || "N/A",
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

  const exportToExcel = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) throw new Error("Authentication token not found");

      console.log("📌 Fetching all applicant data...");

      const response = await fetchAdminDashboard(
        `/admin/dashboard/all_applicantion?page=1&limit=10000`, // Large limit to get all data
        "get",
        {},
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📌 API Response:", response);

      // ✅ Ensure correct response handling
      if (response?.data?.success && response?.data?.payload?.applicant) {
        console.log("✅ Data received, processing for export...");

        const applicants = response.data.payload.applicant.map((app) => ({
          "Full Name": `${app.applicant_first_name || ""} ${
            app.applicant_middle_name || ""
          } ${app.applicant_last_name || ""}`.trim(),
          "Father's Name": `${app.applicant_father_first_name || ""} ${
            app.applicant_father_middle_name || ""
          } ${app.applicant_father_last_name || ""}`.trim(),
          Gender: app.applicant_gender || "N/A",
          "Marital Status": app.applicant_marital_status || "N/A",
          Dependent: app.dependent || 0,
          DOB: app.applicant_DOB || "N/A",
          Email: app.applicant_email || "N/A",
          Mobile: app.applicant_mobile || "N/A",
          "PAN Number": app.applicant_pan_number || "N/A",
          "Monthly Income": app.monthly_income?.toLocaleString() || 0,
          "Loan Amount": app.loan_amount?.toLocaleString() || 0,
          Status: app.status || "N/A",
          "Bank Partner": app.bank_with_partner || "N/A",
          "Created At": new Date(app.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        }));

        console.log("✅ Processed Data:", applicants);

        // Convert to worksheet
        const ws = XLSX.utils.json_to_sheet(applicants);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Applicants");

        // Save file
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(data, `ApplicantsData_${new Date().toISOString()}.xlsx`);

        toast.success("Excel file exported successfully!");
      } else {
        console.error("❌ Unexpected API Response:", response);
        toast.error("Failed to export data.");
      }
    } catch (error) {
      console.error("❌ Error exporting to Excel:", error);
      toast.error("Error exporting to Excel.");
    }
  };

  return (
    <div className="p-6">
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
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-100 focus:ring-4 focus:ring-green-300"
          >
            <Download size={20} className="text-white" />
            Export to Excel
          </button>
        </div>

        {/* Scrollable Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                <th className="border p-3">Sr. No.</th>
                <th className="border p-3">Name</th>
                <th className="border p-3">Email ID</th>
                <th className="border p-3">Mobile</th>
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
                      <td className="border p-3">
                        {applicant.applicant_email || "N/A"}
                      </td>
                      <td className="border p-3">
                        {applicant.applicant_mobile || "N/A"}
                      </td>
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

export default ApplicantData;
