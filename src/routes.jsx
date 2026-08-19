import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import CIBILScore from "./pages/CIBILScore/CIBILScore";
import CheckCIBIL from "./pages/CIBILScore/CheckCIBIL";


const SignInPage = lazy(() => import("./pages/Login"));
// const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const DashboardRole = lazy(() => import("./pages/Dashboard/DashboardRole"));
const EmployeeData = lazy(() => import("./pages/EmployeeData/EmployeeData"));
const ContactUs = lazy(() => import("./pages/ContactUs/ContactUs"));
const ApplicantData = lazy(() => import("./pages/ApplicantData/ApplicantData"));
const CreditScoreData = lazy(() => import("./pages/CreditScoreData/CreditScoreData"));
const DocumentsData = lazy(() => import("./pages/DocumentsData/DocumentsData"));
const LandingPageData = lazy(() => import("./pages/LandingPageData/LandingPageData"));

const RoutesComponent = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        {/* <Route path="/register" element={<RegisterPage />} /> */}
        <Route path="/dashboard" element={<DashboardRole />} />
        <Route path="/employee-data" element={<EmployeeData />} />
        <Route path="/contact-us-info" element={<ContactUs />} />
        <Route path="/applicant-data" element={<ApplicantData />} />
        <Route path="/credit-score-data" element={<CreditScoreData />} />
        <Route path="/documents" element={<DocumentsData />} />
        <Route path="/landing-page" element={<LandingPageData />} />
        <Route path="/cibil-score" element={<CIBILScore />} />
        <Route path="/check-cibil-score" element={<CheckCIBIL />} />
      
      </Routes>
    </Suspense>
  );
};

export default RoutesComponent;
