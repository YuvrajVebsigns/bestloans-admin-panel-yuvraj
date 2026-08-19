import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { authenticateAdmin } from "../api/api"; // ✅ Import API helper

export default function VerifyOtpModal({ isOpen, setIsOpen, onVerify }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  function closeModal() {
    setIsOpen(false);
  }

  function handleChange(index, value) {
    if (/^\d?$/.test(value)) {
      let newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (otp.includes("")) {
      setError("Please enter a valid OTP.");
      return;
    }
    if (!newPassword || !confirmPassword) {
      setError("Please enter both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const mobile = localStorage.getItem("otp_mobile"); // Get stored mobile from forgot password modal
      const isdCode = localStorage.getItem("otp_isd_code");

      const response = await authenticateAdmin(
        {
          type: "FORGOT_PASSWORD",
          otp: otp.join(""),
          mobile,
          isd_code: isdCode,
          password: newPassword,
        },
        "/admin/auth/verify_otp",
        "post"
      );

      console.log("Response Data:", response);

      if (response.data.success) {
        toast.success("OTP Verified & Password Reset Successfully!");
        onVerify(otp.join("")); // Callback to handle successful OTP verification
        localStorage.removeItem("otp_mobile");
        localStorage.removeItem("otp_isd_code");
        closeModal(); // Close modal after success
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error connecting to server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    setResendLoading(true);
    setResendDisabled(true); // Disable button for 30 seconds

    try {
      const mobile = localStorage.getItem("otp_mobile");
      const isdCode = localStorage.getItem("otp_isd_code");

      const response = await authenticateAdmin(
        { isd_code: isdCode, mobile },
        "/admin/auth/resend_otp",
        "post"
      );

      console.log("Resend OTP Response:", response);

      if (response.data.success) {
        toast.success("OTP Resent Successfully!");
      } else {
        toast.error(response.data.message || "Failed to resend OTP.");
        setResendDisabled(false); // Enable button if failed
      }
    } catch (error) {
      console.error("Resend OTP Error:", error);
      toast.error("Error connecting to server. Please try again.");
      setResendDisabled(false);
    } finally {
      setResendLoading(false);
      
      // Enable the button after 30 seconds
      setTimeout(() => {
        setResendDisabled(false);
      }, 30000);
    }
  }

  return (
    <div className={`fixed inset-0 flex items-center justify-center ${isOpen ? "visible opacity-100" : "invisible opacity-0"} transition-opacity duration-300`}>
      {/* Overlay */}
      <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-lg" onClick={closeModal}></div>

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-white bg-opacity-90 backdrop-blur-lg shadow-2xl rounded-2xl p-6 transition-transform duration-300 transform scale-100">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-2xl font-semibold text-gray-800">Verify OTP</h2>
          <button className="text-gray-500 hover:text-red-500 text-2xl" onClick={closeModal}>
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* OTP Input Fields */}
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                maxLength="1"
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            ))}
          </div>

          {/* New Password */}
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          {/* Submit Button */}
          <button type="submit" className="w-full py-3 rounded-lg text-white text-lg font-medium bg-blue-600 hover:opacity-90 transition-all flex justify-center" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="text-center mt-4">
          <button className="text-blue-600 hover:underline text-sm" onClick={handleResendOtp} disabled={resendDisabled}>
            {resendLoading ? "Resending..." : resendDisabled ? "Resend OTP (Wait 30s)" : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}
