/**
 * Main Application Component
 * Defines routes and connects pages
 */
import { BrowserRouter, Routes, Route } from "react-router";
import { Dashboard, HomePage, LogoutPage, SignupPage } from "@/pages/index";
import AppLayout from "@/components/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="auth/signup" element={<SignupPage />} />
          <Route path="/auth/logout" element={<LogoutPage />} />
          <Route path="/user/:id/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
