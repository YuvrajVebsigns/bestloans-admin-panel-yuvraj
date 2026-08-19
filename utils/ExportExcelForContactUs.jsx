import * as XLSX from "xlsx";
import { fetchAdminDashboard } from "../src/api/api";


const exportToExcel = async () => {
  try {
    console.log("📌 Fetching all contact data...");

    const token = localStorage.getItem("jwt_token"); // Ensure you have the token
    if (!token) {
      console.warn("❌ No auth token found!");
      return;
    }

    const queryParams = "limit=99999"; // Ensure all data is fetched

    const response = await fetchAdminDashboard(
      `/admin/dashboard/contact?${queryParams}`,
      "get",
      {}, // No body for GET request
      {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response || !response.data || !response.data.payload) {
      console.warn("⚠️ No data available for export.", response);
      return;
    }

    console.log("✅ Data Received:", response.data.payload);

    // Extract different categories
    const {
      contact_us_data = [],
      query_data = [],
      home_loan_data = [],
      sme_loan_data = [],
      apf_builder_data = [],
      enquiry_data = [],
    } = response.data.payload;

    // Convert each category into sheet data
    const sheets = {
      "Contact Us": contact_us_data,
      "Queries": query_data,
      "Home Loans": home_loan_data,
      "SME Loans": sme_loan_data,
      "APF Builder": apf_builder_data,
      "Enquiries": enquiry_data,
    };

    // Create a new Excel workbook
    const wb = XLSX.utils.book_new();

    // Add sheets for each category
    Object.keys(sheets).forEach((sheetName) => {
      if (sheets[sheetName].length > 0) {
        const ws = XLSX.utils.json_to_sheet(sheets[sheetName]);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      }
    });

    // Generate and download Excel file
    XLSX.writeFile(wb, "ContactData.xlsx");

    console.log("✅ Excel file exported successfully!");
  } catch (error) {
    console.error("❌ Error exporting data:", error);
  }
};


export default exportToExcel;
