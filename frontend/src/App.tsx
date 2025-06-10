import { BrowserRouter, Routes, Route } from "react-router";
import Home from "@/pages/Home";
import AppLayout from "@/components/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
