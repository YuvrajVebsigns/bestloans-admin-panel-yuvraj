import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import { fetchAdminDashboard } from "../../api/api";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

const LandingPageData = () => {
  const [landingPageData, setLandingPageData] = useState({
    total_count: 0,
    current_page: 1,
    records: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10; // Static limit

  useEffect(() => {
    const getLandingPageData = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) throw new Error("Authentication token not found");

        const offset = (page - 1) * limit; // Convert page number to offset

        const queryParams = new URLSearchParams({
          limit,
          offset,
          searchQuery,
        }).toString();

        const response = await fetchAdminDashboard(
          `/admin/dashboard/landing-page-applications?${queryParams}`,
          "get",
          {}, // Empty body for GET request
          {
            headers: {
              "x-auth-token": token,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API Response:", response);

        const responseData = response.data || response;

        if (responseData.success && responseData.data) {
          const formattedLandingPageData = responseData.data.records.map(
            (record) => ({
              id: record.id,
              full_name: record.full_name || "N/A",
              phone_number: record.phone_number || "N/A",
              pan_card_number: record.pan_card_number || "N/A",
              email_address: record.email_address || "N/A",
              loan_amount_required: record.loan_amount_required || "N/A",
              loan_type: record.loan_type || "N/A",
              location: record.location || "N/A",
              created_at: new Date(record.created_at).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              ),
            })
          );

          setLandingPageData({
            total_count: responseData.data.total_count || 0,
            current_page: page,
            records: formattedLandingPageData,
          });
        } else {
          console.warn("Unexpected response format:", responseData);
        }
      } catch (error) {
        console.error("Error fetching landing page data:", error);
      }
    };

    getLandingPageData();
  }, [page, searchQuery]); // Re-fetch when page or searchQuery changes

  const exportToExcel = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) throw new Error("Authentication token not found");

      // Fetch all landing page data (without pagination)
      const response = await fetchAdminDashboard(
        "/admin/dashboard/landing-page-applications?limit=1000&offset=0",
        "get",
        {},
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.success) {
        throw new Error("Failed to fetch landing page data");
      }

      const records = response.data.data.records.map((record, index) => ({
        "Sr. No.": index + 1,
        "Full Name": record.full_name || "N/A",
        "Phone Number": record.phone_number || "N/A",
        "PAN": record.pan_card_number || "N/A",
        "Email": record.email_address || "N/A",
        "Loan Amount Required": record.loan_amount_required || "N/A",
        "Loan Type": record.loan_type || "N/A",
        "Location": record.location || "N/A",
        "Created At": new Date(record.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      }));

      const ws = XLSX.utils.json_to_sheet(records);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Landing Page Data");

      XLSX.writeFile(wb, "Landing_Page_Data.xlsx");
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Landing Page Data</h2>
        <input
          type="text"
          placeholder="Search by Name, Mobile, or PAN..."
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
      <div className="mt-4 bg-white shadow-lg rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                <th className="border p-3">Sr. No.</th>
                <th className="border p-3">Full Name</th>
                <th className="border p-3">Phone Number</th>
                <th className="border p-3">PAN Number</th>
                <th className="border p-3">Email</th>
                <th className="border p-3">Loan Amount Required</th>
                <th className="border p-3">Loan Type</th>
                <th className="border p-3">Location</th>
                <th className="border p-3">Created At</th>
              </tr>
            </thead>
            <tbody>
              {landingPageData.records.length > 0 ? (
                landingPageData.records.map((record, index) => {
                  const serialNumber = (page - 1) * limit + (index + 1);
                  return (
                    <tr key={record.id} className="text-center border-b hover:bg-gray-50">
                      <td className="border p-3">{serialNumber}</td>
                      <td className="border p-3">{record.full_name}</td>
                      <td className="border p-3">{record.phone_number}</td>
                      <td className="border p-3">{record.pan_card_number}</td>
                      <td className="border p-3">{record.email_address}</td>
                      <td className="border p-3">{record.loan_amount_required}</td>
                      <td className="border p-3">{record.loan_type}</td>
                      <td className="border p-3">{record.location}</td>
                      <td className="border p-3">{record.created_at}</td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="7" className="text-center p-4 text-gray-500">No data found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination totalItems={landingPageData.total_count} itemsPerPage={limit} currentPage={page} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default LandingPageData;
