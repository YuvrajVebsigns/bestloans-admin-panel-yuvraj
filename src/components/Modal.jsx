// import React from "react";

// const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmText }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
//       {" "}
//       <div className="bg-white p-6 rounded-lg shadow-lg w-80">
//         <h2 className="text-lg font-bold mb-4">{title}</h2>
//         <p className="text-gray-600">{message}</p>
//         <div className="flex justify-end mt-4">
//           <button
//             className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-2"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//           <button
//             className="px-4 py-2 bg-red-600 text-white rounded-md"
//             onClick={onConfirm}
//           >
//             {confirmText}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;

import React from "react";

const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmText }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-xs bg-transparent bg-opacity-50"
      
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600">{message}</p>
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
