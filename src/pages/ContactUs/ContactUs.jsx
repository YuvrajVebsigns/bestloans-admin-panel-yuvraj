import React, { useState, useEffect } from "react";
import Pagination from "../../components/Pagination"; // Assume Pagination component is available
import { fetchAdminDashboard } from "../../api/api"; // Ensure correct API function is imported
import { Download } from "lucide-react";
import exportToExcel from "../../../utils/ExportExcelForContactUs";

const ContactUs = () => {
  const [contactData, setContactData] = useState([]); // Store table data
  const [activeTab, setActiveTab] = useState("enquiry"); // Default tab
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0); // Store total count for pagination

  const categories = [
    { key: "enquiry", label: "Enquiry" },
    { key: "query", label: "Queries" },
    { key: "home_loan", label: "Home Loan" },
    { key: "sme_loan", label: "SME Loan" },
    { key: "contact_us", label: "Contact Us" },
    { key: "apf_builder", label: "APF Builder" },
  ];

  useEffect(() => {
    const getContactData = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) throw new Error("Authentication token not found");

        const queryParams = new URLSearchParams({
          page,
          limit,
          searchQuery,
        }).toString();

        const response = await fetchAdminDashboard(
          `/admin/dashboard/contact?${queryParams}`, // Append query params
          "get",
          {}, // No body for GET request
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
          const selectedDataKey = `${activeTab}_data`; // Append "_data" to match API response
          const selectedData = responseData.payload[selectedDataKey] || [];

          setTotalCount(responseData.payload.total_counts?.[activeTab] || 0);
          setContactData(selectedData);

          console.log("Setting data for:", selectedDataKey, selectedData); // Debugging
        } else {
          console.warn("Unexpected response format:", responseData);
          setContactData([]);
        }
      } catch (error) {
        console.error("Error fetching contact data:", error);
        setContactData([]);
      }

      setLoading(false);
    };

    getContactData();
  }, [page, limit, searchQuery, activeTab]); // Re-fetch when page, limit, search, or tab changes

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const filteredData = contactData.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Tabs for Categories */}
      <div className="flex space-x-3 mb-4">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => {
              setActiveTab(category.key);
              setPage(1); // Reset to first page when switching tabs
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === category.key
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">Contact Details</h2>
        <input
          type="text"
          placeholder="Search by name..."
          className="border p-2 rounded-md w-64"
          value={searchQuery}
          onChange={handleSearch}
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
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  <th className="border p-3">Sr. No.</th>
                  <th className="border p-3">Name</th>
                  <th className="border p-3">Mobile</th>
                  <th className="border p-3">Email ID</th>
                  <th className="border p-3">Message</th>
                  <th className="border p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => {
                    const serialNumber = (page - 1) * limit + (index + 1);
                    return (
                      <tr
                        key={item.form_id}
                        className="text-center border-b hover:bg-gray-50"
                      >
                        <td className="border p-3">{serialNumber}</td>
                        <td className="border p-3">{item.name || "N/A"}</td>
                        <td className="border p-3">{item.mobile || "N/A"}</td>
                        <td className="border p-3">{item.email || "N/A"}</td>
                        <td className="border p-3">{item.message || "N/A"}</td>
                        <td className="border p-3">{item.status || "N/A"}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-gray-500">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Component */}
        <Pagination
          totalItems={totalCount}
          itemsPerPage={limit}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default ContactUs;
