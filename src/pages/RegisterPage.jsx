import { useState } from "react";
import { toast } from "react-toastify";
import { authenticateAdmin } from "../api/api";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader"; // Import your Loader component

import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaMobileAlt,
  FaBriefcase,
} from "react-icons/fa";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    isd_code: "+91",
    mobile: "",
    password: "",
    role: "ADMIN",
    first_name: "",
    last_name: "",
    designation: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // React Router hook for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Form Data Before Submission:", formData); // Debugging log

    const requestData = {
      ...formData,
      isd_code: "+91", // Ensure it's included in the request data
    };

    try {
      const response = await authenticateAdmin(
        requestData,
        "/admin/auth/sign_up",
        "post"
      );

      console.log("Response Data:", response); // Log the response for debugging

      if (response.data.success) {
        toast.success("Sign up successfully done.");

        // Save email and mobile in localStorage
        localStorage.setItem("admin_email", formData.email);
        localStorage.setItem("admin_mobile", formData.mobile);

        // ✅ Redirect to home page after success
        navigate("/");
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);

      // Handle API errors properly
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error connecting to server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      {loading && <Loader />} {/* Show loader when loading */}
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First & Last Name */}
          <div className="flex space-x-2">
            <div className="relative w-1/2">
              <FaUser className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                required
                className="w-full pl-10 p-2 border rounded focus:ring focus:ring-blue-300"
                onChange={handleChange}
              />
            </div>
            <div className="relative w-1/2">
              <FaUser className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                required
                className="w-full pl-10 p-2 border rounded focus:ring focus:ring-blue-300"
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full pl-10 p-2 border rounded focus:ring focus:ring-blue-300"
              onChange={handleChange}
            />
          </div>

          {/* Country Code & Mobile */}
          <div className="flex space-x-2">
            <select
              name="isd_code"
              className="p-2 border rounded w-1/3 focus:ring focus:ring-blue-300"
              onChange={handleChange}
            >
              <option value="+91">+91 🇮🇳</option>
            </select>
            <div className="relative w-2/3">
              <FaMobileAlt className="absolute top-3 left-3 text-gray-400" />
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile Number"
                required
                className="w-full pl-10 p-2 border rounded focus:ring focus:ring-blue-300"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full pl-10 p-2 border rounded focus:ring focus:ring-blue-300"
              onChange={handleChange}
            />
          </div>

          {/* Role Selection */}
          <div>
            <select
              name="role"
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              onChange={handleChange}
            >
              <option value="ADMIN">Admin</option>
              <option value="EMPLOYEE">Employee</option>
            </select>
          </div>

          {/* Designation */}
          <div className="relative">
            <FaBriefcase className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              name="designation"
              placeholder="Designation"
              required
              className="w-full pl-10 p-2 border rounded focus:ring focus:ring-blue-300"
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
