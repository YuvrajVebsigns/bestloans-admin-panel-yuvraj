// import { useEffect, useState } from "react";
// import Pagination from "../../components/Pagination";
// import { fetchAdminDashboard } from "../../api/api";
// import { Download } from "lucide-react";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { toast } from "react-toastify";

// const CreditScoreData = () => {
//   const [creditScoreData, setCreditScoreData] = useState({
//     total_count: 0,
//     current_page: 1,
//     records: [],
//   });
//   const [searchQuery, setSearchQuery] = useState("");
//   const [page, setPage] = useState(1);
//   const limit = 10; // Static limit

//   useEffect(() => {
//     const getCreditScoreData = async () => {
//       try {
//         const token = localStorage.getItem("jwt_token");
//         if (!token) throw new Error("Authentication token not found");

//         const queryParams = new URLSearchParams({
//           page,
//           limit,
//           searchQuery,
//         }).toString();

//         const response = await fetchAdminDashboard(
//           `/admin/dashboard/credit-score-details?${queryParams}`, // Append query params
//           "get",
//           {}, // Empty body for GET request
//           {
//             headers: {
//               "x-auth-token": token,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         console.log("API Response:", response); // Debugging

//         const responseData = response.data || response;

//         if (responseData.success && responseData.data) {
//           const formattedCreditScoreData = responseData.data.records.map(
//             (record) => ({
//               id: record.id,
//               name: record.name || "N/A",
//               mobile: record.mobile || "N/A",
//               PAN_number: record.PAN_number || "N/A",
//               email: record.email || "N/A",
//               credit_score: record.credit_score || "N/A",
//               credit_report_link: record.credit_report_link || "N/A",
//               created_at: new Date(record.created_at).toLocaleDateString(
//                 "en-GB",
//                 {
//                   day: "2-digit",
//                   month: "short",
//                   year: "numeric",
//                 }
//               ),
//             })
//           );

//           setCreditScoreData({
//             total_count: responseData.data.total_count || 0,
//             current_page: responseData.data.current_page || 1,
//             records: formattedCreditScoreData,
//           });
//         } else {
//           console.warn("Unexpected response format:", responseData);
//         }
//       } catch (error) {
//         console.error("Error fetching credit score data:", error);
//       }
//     };

//     getCreditScoreData();
//   }, [page, searchQuery]); // Re-fetch when page or searchQuery changes

//   const exportToExcel = async () => {
//     try {
//       const token = localStorage.getItem("jwt_token");
//       if (!token) throw new Error("Authentication token not found");

//       // Fetch all credit score data (without pagination)
//       const response = await fetchAdminDashboard(
//         "/admin/dashboard/credit-score-details", // Ensure this API returns all data
//         "get",
//         {},
//         {
//           headers: {
//             "x-auth-token": token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.data.success) {
//         throw new Error("Failed to fetch credit score data");
//       }

//       const records = response.data.data.records.map((record, index) => ({
//         "Sr. No.": index + 1,
//         Name: record.name || "N/A",
//         Mobile: record.mobile || "N/A",
//         PAN: record.PAN_number || "N/A",
//         Email: record.email || "N/A",
//         "Credit Score": record.credit_score || "N/A",
//         "Credit Report Link": record.credit_report_link || "N/A",
//         "Created At": new Date(record.created_at).toLocaleDateString("en-GB", {
//           day: "2-digit",
//           month: "short",
//           year: "numeric",
//         }),
//       }));

//       const ws = XLSX.utils.json_to_sheet(records);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Credit Score Data");

//       XLSX.writeFile(wb, "Credit_Score_Data.xlsx");
//     } catch (error) {
//       console.error("Error exporting data:", error);
//     }
//   };

//   return (
//     <div className="p-6">
//       {/* Header & Search */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold text-gray-700">
//           Credit Score Data
//         </h2>
//         <input
//           type="text"
//           placeholder="Search by Name, Mobile, or PAN..."
//           className="border border-gray-300 w-[400px] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <button
//           onClick={exportToExcel}
//           className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-100 focus:ring-4 focus:ring-green-300"
//         >
//           <Download size={20} className="text-white" />
//           Export to Excel
//         </button>
//       </div>

//       {/* Table */}
//       <div className="mt-4 bg-white shadow-lg rounded-xl p-6">
//         <div className="overflow-x-auto">
//           <table className="min-w-[1200px] w-full border-collapse border border-gray-200">
//             <thead>
//               <tr className="bg-gray-100 text-gray-600 text-sm">
//                 <th className="border p-3">Sr. No.</th>
//                 <th className="border p-3">Name</th>
//                 <th className="border p-3">Mobile</th>
//                 <th className="border p-3">PAN Number</th>
//                 <th className="border p-3">Email</th>
//                 <th className="border p-3">Credit Score</th>
//                 <th className="border p-3">Credit Report</th>
//                 <th className="border p-3">Created At</th>
//               </tr>
//             </thead>
//             <tbody>
//               {creditScoreData.records.length > 0 ? (
//                 creditScoreData.records.map((record, index) => {
//                   const serialNumber =
//                     (creditScoreData.current_page - 1) * limit + (index + 1);
//                   return (
//                     <tr
//                       key={record.id}
//                       className="text-center border-b hover:bg-gray-50"
//                     >
//                       <td className="border p-3">{serialNumber}</td>
//                       <td className="border p-3">{record.name}</td>
//                       <td className="border p-3">{record.mobile}</td>
//                       <td className="border p-3">{record.PAN_number}</td>
//                       <td className="border p-3">{record.email}</td>
//                       <td className="border p-3">{record.credit_score}</td>
//                       <td className="border p-3">
//                         {record.credit_report_link !== "N/A" ? (
//                           <a
//                             href={record.credit_report_link}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-500 underline"
//                           >
//                             Download
//                           </a>
//                         ) : (
//                           "N/A"
//                         )}
//                       </td>
//                       <td className="border p-3">{record.created_at}</td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="text-center p-4 text-gray-500">
//                     No credit score data found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <Pagination
//           totalItems={creditScoreData.total_count}
//           itemsPerPage={limit}
//           currentPage={page}
//           onPageChange={setPage}
//         />
//       </div>
//     </div>
//   );
// };

// export default CreditScoreData;

import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import API, { buildApiUrl, fetchAdminDashboard } from "../../api/api";
import { Download, X } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import Modal from "../../components/Modal";

const CreditScoreData = () => {
  const isSuperAdmin = localStorage.getItem("role") === "SUPER_ADMIN";
  const [creditScoreData, setCreditScoreData] = useState({
    total_count: 0,
    current_page: 1,
    records: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
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
              email: record.email || "N/A",
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
        Email: record.email || "N/A",
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

  const openDeleteModal = (recordId, panNumber) => {
    setSelectedRecord({ recordId, panNumber });
    setShowDeleteModal(true);
  };

  const deleteCreditScoreRecord = async () => {
    if (!isSuperAdmin) return;

    const recordId = selectedRecord?.recordId;
    const panNumber = selectedRecord?.panNumber;

    const token = localStorage.getItem("jwt_token");
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    if (!panNumber || panNumber === "N/A") {
      toast.error("PAN number not available for this record");
      return;
    }

    try {
      const response = await API.delete(`/admin/dashboard/credit-score/${panNumber}`, {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
        data: {
          reason: "User requested credit report deletion",
        },
      });

      const responseData = response.data || response;
      if (responseData.success === false) {
        throw new Error(responseData.message || "Failed to delete record");
      }

      setCreditScoreData((prev) => ({
        ...prev,
        total_count: Math.max(0, prev.total_count - 1),
        records: prev.records.filter(
          (record) => record.id !== recordId && record.PAN_number !== panNumber
        ),
      }));
      setShowDeleteModal(false);
      setSelectedRecord(null);
      toast.success(responseData.message || "Record deleted successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to delete record"
      );
    }
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
                {isSuperAdmin && <th className="border p-3">Action</th>}
              </tr>
            </thead>
            <tbody>
              {creditScoreData.records.length > 0 ? (
                creditScoreData.records.map((record, index) => {
                  const serialNumber =
                    (page - 1) * limit + (index + 1);
                  return (
                    <tr key={record.id} className="text-center border-b hover:bg-gray-50">
                      <td className="border p-3">{serialNumber}</td>
                      <td className="border p-3">{record.name}</td>
                      <td className="border p-3">{record.mobile}</td>
                      <td className="border p-3">{record.PAN_number}</td>
                      <td className="border p-3">{record.email}</td>
                      <td className="border p-3">{record.credit_score}</td>
                      <td className="border p-3">
                        {record.credit_report_link !== "N/A" ? (
                          <a href={buildApiUrl(record.credit_report_link)} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Download</a>
                        ) : "N/A"}
                      </td>
                      <td className="border p-3">{record.created_at}</td>
                      {isSuperAdmin && (
                        <td className="border p-3">
                          <button
                            type="button"
                            onClick={() => openDeleteModal(record.id, record.PAN_number)}
                            className="inline-flex items-center justify-center text-red-600 hover:text-red-700"
                            aria-label="Delete record"
                            title="Delete"
                          >
                            <X size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={isSuperAdmin ? 9 : 8} className="text-center p-4 text-gray-500">No data found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination totalItems={creditScoreData.total_count} itemsPerPage={limit} currentPage={page} onPageChange={setPage} />
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedRecord(null);
        }}
        onConfirm={deleteCreditScoreRecord}
        title="Confirm Delete"
        message={`Are you sure you want to delete this record for PAN ${selectedRecord?.panNumber || ""}?`}
        confirmText="Delete"
      />
    </div>
  );
};

export default CreditScoreData;
