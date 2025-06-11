import { BrowserRouter, Routes, Route } from "react-router";
import Home from "@/pages/Home";
import SignupPage from "@/pages/SignupPage";
import AppLayout from "@/components/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="auth/signup" element={<SignupPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
