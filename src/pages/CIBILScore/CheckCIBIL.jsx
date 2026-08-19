import React, { useState } from "react";
import { toast } from "react-toastify"; // Make sure react-toastify is installed
import API, { buildApiUrl, fetchAdminDashboard } from "../../api/api";
import { useNavigate } from "react-router-dom";

const CheckCIBIL = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    mobile: "",
    pan: "",
    consent: false,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     setLoading(true);
  //     setResult(null);

  //     console.log("Form Data Before Submission:", formData);

  //     const requestData = {
  //       name: formData.name,
  //       gender: formData.gender,
  //       mobile: formData.mobile,
  //       pan: formData.pan,
  //       consent: formData.consent ? "Y" : "N",
  //     };

  //     try {
  //       const token = localStorage.getItem("jwt_token");
  //       if (!token) throw new Error("Authentication token not found");

  //       const response = await fetchAdminDashboard(
  //         "/admin/dashboard/credit-score-cibil",
  //         "post",
  //         requestData,
  //         {
  //           headers: {
  //             "x-auth-token": token,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       console.log("Response Data:", response);

  //       if (response.success) {
  //         setResult(response.data);
  //         toast.success("CIBIL credit score fetched successfully!");
  //       } else {
  //         toast.error(response.message || "Something went wrong.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching CIBIL score:", error);
  //       toast.error(
  //         error.response?.data?.userMessage ||
  //           error.message ||
  //           "Error connecting to server. Please try again."
  //       );
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    console.log("Form Data Before Submission:", formData);

    const requestData = {
      name: formData.name,
      gender: formData.gender,
      mobile: formData.mobile,
      pan: formData.pan,
      consent: formData.consent ? "Y" : "N",
    };

    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetchAdminDashboard(
        "/admin/dashboard/credit-score-cibil",
        "post",
        requestData,
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response Data:", response);

      // Axios wraps the data inside response.data
      const responseData = response.data;

      if (responseData.success) {
        setResult(responseData.data);
        toast.success("CIBIL credit score fetched successfully!");
      } else {
        toast.error(responseData.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error fetching CIBIL score:", error);
      toast.error(
        error.response?.data?.userMessage ||
          error.message ||
          "Error connecting to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getFileNameFromUrl = (url) => {
    if (!url) return "credit-report.pdf";
    const urlParts = url.split("/");
    const lastSegment = urlParts[urlParts.length - 1] || "credit-report.pdf";
    return decodeURIComponent(lastSegment.split("?")[0]);
  };

  const downloadCreditReport = async (credit_report_link) => {
    if (!credit_report_link) {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Go back to previous page
        className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md transition-all duration-200"
      >
        &larr; Back
      </button>

      <form
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-gray-700 text-center">
          Check CIBIL Score
        </h2>

        {/* Name */}
        <div>
          <label className="block text-gray-600 mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-gray-600 mb-2">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-gray-600 mb-2">Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter your mobile number"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* PAN */}
        <div>
          <label className="block text-gray-600 mb-2">PAN Number</label>
          <input
            type="text"
            name="pan"
            value={formData.pan}
            onChange={handleChange}
            placeholder="Enter your PAN"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Consent */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-gray-600">
            I consent to check my CIBIL score
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Checking..." : "Check Score"}
        </button>

        {/* Result */}
        {result && (
          <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-lg mt-4">
            <p>
              <strong>Credit Score:</strong> {result.credit_score}
            </p>
            <p>
              <strong>Name:</strong> {result.name}
            </p>
            <p>
              <strong>PAN:</strong> {result.PAN_number}
            </p>
            {result.credit_report_link && (
              <p>
                <button
                  type="button"
                  onClick={() => downloadCreditReport(result.credit_report_link)}
                  className="text-blue-600 underline"
                >
                  Download 
                </button>
              </p>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default CheckCIBIL;
