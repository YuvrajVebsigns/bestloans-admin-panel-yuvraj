import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import API, { buildApiUrl, fetchAdminDashboard } from "../../api/api";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CIBILScore = () => {
  const navigate = useNavigate();
  const [creditScoreData, setCreditScoreData] = useState({
    total_count: 0,
    current_page: 1,
    records: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10; // Static limit

  useEffect(() => {
    const getCreditScoreData = async () => {
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
          `/admin/dashboard/credit-score-details?${queryParams}`,
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
          const formattedCreditScoreData = responseData.data.records.map(
            (record) => ({
              id: record.id,
              name: record.name || "N/A",
              mobile: record.mobile || "N/A",
              PAN_number: record.PAN_number || "N/A",
              email: record.email || "Checked From CIBIL",
              credit_score: record.credit_score || "N/A",
              credit_report_link: record.credit_report_link || "N/A",
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

          setCreditScoreData({
            total_count: responseData.data.total_count || 0,
            current_page: page,
            records: formattedCreditScoreData,
          });
        } else {
          console.warn("Unexpected response format:", responseData);
        }
      } catch (error) {
        console.error("Error fetching credit score data:", error);
      }
    };

    getCreditScoreData();
  }, [page, searchQuery]); // Re-fetch when page or searchQuery changes

  const exportToExcel = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) throw new Error("Authentication token not found");

      // Fetch all credit score data (without pagination)
      const response = await fetchAdminDashboard(
        "/admin/dashboard/credit-score-details?limit=1000&offset=0", // ✅ Fetch all records
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
        throw new Error("Failed to fetch credit score data");
      }

      const records = response.data.data.records.map((record, index) => ({
        "Sr. No.": index + 1,
        Name: record.name || "N/A",
        Mobile: record.mobile || "N/A",
        PAN: record.PAN_number || "N/A",
        Email: record.email || "Checked from CIBIL",
        "Credit Score": record.credit_score || "N/A",
        "Credit Report Link": record.credit_report_link || "N/A",
        "Created At": new Date(record.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      }));

      const ws = XLSX.utils.json_to_sheet(records);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Credit Score Data");

      XLSX.writeFile(wb, "Credit_Score_Data.xlsx");
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const getFileNameFromUrl = (url) => {
    if (!url) return "credit-report.pdf";
    const urlParts = url.split("/");
    const lastSegment = urlParts[urlParts.length - 1] || "credit-report.pdf";
    return decodeURIComponent(lastSegment.split("?")[0]);
  };

  const downloadCreditReport = async (credit_report_link) => {
    if (!credit_report_link || credit_report_link === "N/A") {
      toast.error("No report link available");
      return;
    }

    const token = localStorage.getItem("jwt_token");
    console.log("Downloading from:", credit_report_link);

    try {
      // Use fetch directly (not API) since backend returns full URL
      const response = await fetch(credit_report_link, {
        method: "GET",
        headers: {
          "x-auth-token": token,
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      console.log("✅ Blob received, size:", blob.size);

      // Create download
      const objectUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = getFileNameFromUrl(credit_report_link);
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(objectUrl);

      toast.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Unable to download report: " + error.message);
    }
  };

  const checkFromCIBIL = () => {
    navigate("/check-cibil-score");
  };

  return (
    <div className="p-6">
      {/* Header & Search */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Credit Score Data
        </h2>
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
        <button
          onClick={checkFromCIBIL} // your function to handle CIBIL check
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-100 focus:ring-4 focus:ring-blue-300"
        >
          Check from CIBIL
        </button>
      </div>

      {/* Table */}
      <div className="mt-4 bg-white shadow-lg rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                <th className="border p-3">Sr. No.</th>
                <th className="border p-3">Name</th>
                <th className="border p-3">Mobile</th>
                <th className="border p-3">PAN Number</th>
                <th className="border p-3">Email</th>
                <th className="border p-3">Credit Score</th>
                <th className="border p-3">Credit Report</th>
                <th className="border p-3">Created At</th>
              </tr>
            </thead>
            <tbody>
              {creditScoreData.records.length > 0 ? (
                creditScoreData.records.map((record, index) => {
                  const serialNumber = (page - 1) * limit + (index + 1);
                  return (
                    <tr
                      key={record.id}
                      className="text-center border-b hover:bg-gray-50"
                    >
                      <td className="border p-3">{serialNumber}</td>
                      <td className="border p-3">{record.name}</td>
                      <td className="border p-3">{record.mobile}</td>
                      <td className="border p-3">{record.PAN_number}</td>
                      <td className="border p-3">{record.email}</td>
                      <td className="border p-3">{record.credit_score}</td>
                      <td className="border p-3">
                        {record.credit_report_link !== "N/A" ? (
                          <button
                            type="button"
                            onClick={() => downloadCreditReport(record.credit_report_link)}
                            className="text-blue-500 underline"
                          >
                            Download
                          </button>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="border p-3">{record.created_at}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-500">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          totalItems={creditScoreData.total_count}
          itemsPerPage={limit}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default CIBILScore;
