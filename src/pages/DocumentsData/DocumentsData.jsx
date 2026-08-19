import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import { fetchAdminDashboard } from "../../api/api";

const DocumentsData = () => {
  const [documentsData, setDocumentsData] = useState({
    total_documents: 0,
    current_page: 1,
    documents: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10; // Static limit

  useEffect(() => {
    const getDocumentsData = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) throw new Error("Authentication token not found");

        const queryParams = new URLSearchParams({
          page,
          limit,
          searchQuery,
        }).toString();

        const response = await fetchAdminDashboard(
          `/admin/dashboard/documents?${queryParams}`,
          "get",
          {},
          {
            headers: {
              "x-auth-token": token,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API Response:", response);

        const responseData = response.data || response;

        if (responseData.success && responseData.payload) {
          const formattedDocuments = responseData.payload.documents.map(
            (doc) => ({
              document_id: doc.document_id,
              name: `${doc.applicant_first_name || ""} ${
                doc.applicant_last_name || ""
              }`.trim(),
              applicant_mobile: doc.applicant_mobile || "N/A",
              applicant_email: doc.applicant_email || "N/A",
              document_type: doc.document_type || "N/A",
              document_proof_for: doc.document_proof_for || "N/A",
              file_url: doc.file_url || "#",
              created_at: new Date(doc.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
            })
          );

          setDocumentsData({
            total_documents: responseData.payload.total_documents || 0,
            current_page: responseData.payload.current_page || 1,
            documents: formattedDocuments,
          });
        } else {
          console.warn("Unexpected response format:", responseData);
        }
      } catch (error) {
        console.error("Error fetching documents data:", error);
      }
    };

    getDocumentsData();
  }, [page, searchQuery]);

  return (
    <div className="p-6">
      {/* Header & Search */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Documents Data</h2>
        <input
          type="text"
          placeholder="Search by Name, Email, or Document Type..."
          className="border border-gray-300 w-[400px] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
                <th className="border p-3">Email</th>
                <th className="border p-3">Document Type</th>
                <th className="border p-3">Document Proof For</th>
                <th className="border p-3">Uploaded Date</th>
                <th className="border p-3">Download File</th>
              </tr>
            </thead>
            <tbody>
              {documentsData.documents.length > 0 ? (
                documentsData.documents.map((doc, index) => {
                  const serialNumber =
                    (documentsData.current_page - 1) * limit + (index + 1);
                  return (
                    <tr
                      key={doc.document_id}
                      className="text-center border-b hover:bg-gray-50"
                    >
                      <td className="border p-3">{serialNumber}</td>
                      <td className="border p-3">{doc.name}</td>
                      <td className="border p-3">{doc.applicant_mobile}</td>
                      <td className="border p-3">{doc.applicant_email}</td>
                      <td className="border p-3">{doc.document_type}</td>
                      <td className="border p-3">{doc.document_proof_for}</td>
                      <td className="border p-3">{doc.created_at}</td>
                      <td className="border p-3">
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Download
                        </a>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-4 text-gray-500">
                    No documents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          totalItems={documentsData.total_documents}
          itemsPerPage={limit}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default DocumentsData;
