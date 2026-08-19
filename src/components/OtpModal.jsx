// import { useState } from "react";

// export default function ForgotPasswordModal({ isOpen, setIsOpen, onOtpSent }) {
//   const [mobile, setMobile] = useState("");
//   const [isdCode, setIsdCode] = useState("+91");
//   const [error, setError] = useState("");

//   function closeModal() {
//     setIsOpen(false);
//   }

//   function handleSubmit(e) {
//     e.preventDefault();
//     if (!/^\+\d{1,4}$/.test(isdCode)) {
//       setError("Invalid ISD Code");
//       return;
//     }
//     if (!/^\d{7,15}$/.test(mobile)) {
//       setError("Invalid Mobile Number");
//       return;
//     }
//     setError("");

//     console.log("Sending OTP to:", mobile, isdCode);

//     // Simulate API call with a timeout
//     setTimeout(() => {
//       console.log("OTP Sent Successfully!");
//       onOtpSent(mobile, isdCode); // ✅ Trigger Verify OTP Modal
//     }, 1000);
//   }

//   return (
//     <div
//       className={`fixed inset-0 flex items-center justify-center ${
//         isOpen ? "visible opacity-100" : "invisible opacity-0"
//       } transition-opacity duration-300`}
//     >
//       {/* Overlay */}
//       <div
//         className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-md"
//         onClick={closeModal}
//       ></div>

//       {/* Modal Box */}
//       <div className="relative w-full max-w-md bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-xl p-6 transition-transform duration-300 transform scale-100">
//         {/* Header */}
//         <div className="flex justify-between items-center border-b pb-3">
//           <h2 className="text-xl font-semibold text-gray-800">
//             Forgot Password
//           </h2>
//           <button
//             className="text-gray-500 hover:text-red-500"
//             onClick={closeModal}
//           >
//             ✕
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="mt-4">
//           <div className="mb-4">
//             <label className="block text-gray-600 text-sm font-medium mb-1">
//               ISD Code
//             </label>
//             <input
//               type="text"
//               value={isdCode}
//               onChange={(e) => setIsdCode(e.target.value)}
//               placeholder="+1"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//               required
//               disabled
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-600 text-sm font-medium mb-1">
//               Mobile Number
//             </label>
//             <input
//               type="text"
//               value={mobile}
//               onChange={(e) => setMobile(e.target.value)}
//               placeholder="Enter your mobile number"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//               required
//             />
//           </div>

//           {/* Error Message */}
//           {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full py-2 rounded-lg text-white text-lg font-medium bg-gradient-to-r from-blue-600 to-blue-400 hover:opacity-90 transition-all"
//           >
//             Send OTP
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { toast } from "react-toastify";
import { authenticateAdmin } from "../api/api"; // ✅ Import API helper

export default function ForgotPasswordModal({ isOpen, setIsOpen, onOtpSent }) {
  const [mobile, setMobile] = useState("");
  const [isdCode, setIsdCode] = useState("+91");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!/^\+\d{1,4}$/.test(isdCode)) {
      setError("Invalid ISD Code");
      setLoading(false);
      return;
    }
    if (!/^\d{7,15}$/.test(mobile)) {
      setError("Invalid Mobile Number");
      setLoading(false);
      return;
    }

    console.log("Sending OTP to:", { isd_code: isdCode, mobile });

    try {
      const response = await authenticateAdmin(
        { isd_code: isdCode, mobile },
        "/admin/auth/forgot_password",
        "post"
      );

      console.log("Response Data:", response);

      if (response.data.success) {
        toast.success("OTP Sent Successfully!");

        // ✅ Store Mobile & ISD Code in Local Storage (Optional)
        localStorage.setItem("otp_mobile", mobile);
        localStorage.setItem("otp_isd_code", isdCode);

        // ✅ Trigger Verify OTP Modal
        onOtpSent(mobile, isdCode);
        setIsOpen(false); // Close Forgot Password Modal
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);

      // ✅ Handle API Errors Properly
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error connecting to server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center ${isOpen ? "visible opacity-100" : "invisible opacity-0"} transition-opacity duration-300`}>
      {/* Overlay */}
      <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-md" onClick={closeModal}></div>

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-xl p-6 transition-transform duration-300 transform scale-100">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">Forgot Password</h2>
          <button className="text-gray-500 hover:text-red-500" onClick={closeModal}>✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">ISD Code</label>
            <input
              type="text"
              value={isdCode}
              onChange={(e) => setIsdCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">Mobile Number</label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter your mobile number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg text-white text-lg font-medium bg-gradient-to-r from-blue-600 to-blue-400 hover:opacity-90 transition-all flex justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
