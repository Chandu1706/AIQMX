import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { SignupPage } from "./pages/SignupPage";
import { RegisterHomeownerPage } from "./pages/RegisterHomeownerPage";
import { RegisterProfessionalPage } from "./pages/RegisterProfessionalPage";
import { RegisterAgentPage } from "./pages/RegisterAgentPage";
import { RegisterTenantPage } from "./pages/RegisterTenantPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/register/homeowner" element={<RegisterHomeownerPage />} />
        <Route path="/register/tenant" element={<RegisterTenantPage />} />
        <Route path="/register/professional" element={<RegisterProfessionalPage />} />
        <Route path="/register/agent" element={<RegisterAgentPage />} />
        <Route path="/listings" element={<PlaceholderPage />} />
        <Route path="/agents" element={<PlaceholderPage />} />
        <Route path="/products" element={<PlaceholderPage />} />
        <Route path="/news" element={<PlaceholderPage />} />
        <Route path="/about" element={<PlaceholderPage />} />
        <Route path="/glossary" element={<PlaceholderPage />} />
        <Route path="/app" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
