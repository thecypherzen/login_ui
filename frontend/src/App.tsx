import { BrowserRouter, Routes, Route } from "react-router";
import { Dashboard, HomePage, SignupPage } from "@/pages/index";
import AppLayout from "@/components/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="auth/signup" element={<SignupPage />} />
          <Route path="/user/me/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
