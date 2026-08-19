import { useState } from "react";
import { toast } from "react-toastify";
import { authenticateAdmin } from "../api/api";
import { useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";
import { IoMdLock } from "react-icons/io";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import Loader from "../components/Loader";
import ForgotPasswordModal from "../components/OtpModal"; // Import the OTP modal
import VerifyOtpModal from "../components/VerifyOTPModal"; // Verify OTP Modal

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isVerifyOtpOpen, setIsVerifyOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "SUPER_ADMIN",
  });
  const navigate = useNavigate(); // React Router hook for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Signing in...", formData); // Debugging log

    try {
      const response = await authenticateAdmin(
        formData,
        "/admin/auth/sign_in",
        "post"
      );

      console.log("Response Data:", response); // Log the response for debugging

      if (response.data.success) {
        toast.success("Login successful!");

        // Extract necessary data from response
        const { user, jwt_token, refreshToken } = response.data.payload.user;

        // Store in localStorage
        localStorage.setItem("public_id", user.public_id);
        localStorage.setItem("admin_email", user.email);
        localStorage.setItem("jwt_token", jwt_token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("role", user.role);

        // ✅ Redirect to home page
        navigate("/dashboard");
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

  const handleForgotPasswordSubmit = (mobile, isdCode) => {
    console.log("Forgot Password OTP sent to:", mobile, isdCode);
    setIsForgotPasswordOpen(false); // Close Forgot Password Modal
    setIsVerifyOtpOpen(true); // Open Verify OTP Modal
  };

  const handleOtpVerification = (enteredOtp) => {
    console.log("Verified OTP:", enteredOtp);
    setIsVerifyOtpOpen(false);
    toast.success("OTP Verified! Redirecting...");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {loading && <Loader />} {/* Show loader when loading */}
        <Card className="shadow-lg border border-gray-200 dark:border-gray-800 bg-white ">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl  font-semibold text-gray-900 dark:text-gray-100">
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <select
                name="role"
                value={formData.role}
                className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                onChange={handleChange}
              >
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="EMPLOYEE">Employee</option>
              </select>

              {/* Email Field */}
              <div className="relative">
                <FaUserShield className="absolute text-2xl left top-6 text-gray-500 dark:text-gray-300" />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="w-full pl-10 p-2  rounded"
                  onChange={handleChange}
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <IoMdLock className="absolute text-2xl left top-6 text-gray-500 dark:text-gray-300" />
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  className="w-full pl-10 p-2  rounded"
                  onChange={handleChange}
                />
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Sign In
              </Button>
            </form>

            {/* Forgot Password & Sign Up Links */}
            <div className="text-center mt-4">
              <button
                onClick={() => setIsForgotPasswordOpen(true)}
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
              >
                Forgot password?
              </button>
              {/* <span className="mx-2 text-gray-500 dark:text-gray-400">|</span> */}
              {/* <a
                href="/register"
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
              >
                Create an account
              </a> */}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <ForgotPasswordModal
          isOpen={isForgotPasswordOpen}
          setIsOpen={setIsForgotPasswordOpen}
          onOtpSent={handleForgotPasswordSubmit} // ✅ Pass function to open OTP modal
        />
      )}

      {/* Verify OTP Modal */}
      {isVerifyOtpOpen && (
        <VerifyOtpModal
          isOpen={isVerifyOtpOpen}
          setIsOpen={setIsVerifyOtpOpen}
          onVerify={handleOtpVerification}
        />
      )}
    </div>
  );
}
