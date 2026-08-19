// import { BrowserRouter as Router } from "react-router-dom";
// import RoutesComponent from "./routes";

// function App() {
//   return (
//     <Router>
//       <RoutesComponent />
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toast CSS
import AppLayout from "./components/AppLayouts"; // Layout component with Header & Sidebar

function App() {
  return (
    <Router>
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Main Layout */}
      <AppLayout />
    </Router>
  );
}

export default App;
